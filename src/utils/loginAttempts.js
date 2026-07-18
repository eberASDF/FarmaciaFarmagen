const STORAGE_KEY = "farmagen_login_attempts";
const MAX_ATTEMPTS = 4;
const LOCK_STEP_MINUTES = 2;
const LOCK_STEP_MS = LOCK_STEP_MINUTES * 60 * 1000;

function readAttempts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAttempts(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function getScopeState(scope) {
  const attempts = readAttempts();
  return attempts[scope] || { failedAttempts: 0, lockUntil: 0, lockLevel: 0 };
}

function setScopeState(scope, state) {
  const attempts = readAttempts();
  attempts[scope] = state;
  writeAttempts(attempts);
}

function getRemainingMinutes(lockUntil) {
  const remainingMs = Number(lockUntil || 0) - Date.now();
  return Math.max(1, Math.ceil(remainingMs / 60000));
}

export function getLoginLock(scope = "login") {
  const state = getScopeState(scope);
  const now = Date.now();

  if (state.lockUntil && state.lockUntil > now) {
    return {
      locked: true,
      remainingMinutes: getRemainingMinutes(state.lockUntil),
    };
  }

  if (state.lockUntil && state.lockUntil <= now) {
    setScopeState(scope, { ...state, failedAttempts: 0, lockUntil: 0 });
  }

  return { locked: false, remainingMinutes: 0 };
}

export function registerFailedLoginAttempt(scope = "login") {
  let state = getScopeState(scope);
  const now = Date.now();

  if (state.lockUntil && state.lockUntil > now) {
    return {
      locked: true,
      remainingMinutes: getRemainingMinutes(state.lockUntil),
    };
  }

  if (state.lockUntil && state.lockUntil <= now) {
    state = { ...state, failedAttempts: 0, lockUntil: 0 };
    setScopeState(scope, state);
  }

  const failedAttempts = Number(state.failedAttempts || 0) + 1;

  if (failedAttempts >= MAX_ATTEMPTS) {
    const lockLevel = Number(state.lockLevel || 0) + 1;
    const lockMinutes = lockLevel * LOCK_STEP_MINUTES;
    const lockUntil = now + lockLevel * LOCK_STEP_MS;
    setScopeState(scope, { failedAttempts: 0, lockLevel, lockUntil });
    return {
      locked: true,
      remainingMinutes: lockMinutes,
    };
  }

  setScopeState(scope, {
    failedAttempts,
    lockLevel: Number(state.lockLevel || 0),
    lockUntil: 0,
  });

  return { locked: false, attemptsLeft: MAX_ATTEMPTS - failedAttempts };
}

export function clearLoginAttempts(scope = "login") {
  const attempts = readAttempts();
  delete attempts[scope];
  writeAttempts(attempts);
}

export function getLockMessage(minutes) {
  return `Demasiados intentos fallidos, vuelva a intentar en ${minutes} minuto${minutes === 1 ? "" : "s"}.`;
}
