const SHORT_DELAY = 120;
const LOGIN_DELAY = 450;

// PROMESA 1: simula la carga del catálogo completo desde un servidor.
export function createProductsPromise(products) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve([...products]), SHORT_DELAY);
  });
}

// FUNCIÓN ASÍNCRONA 1: espera la Promesa 1 y devuelve los productos cargados.
export async function loadProductsAsync(products) {
  const loadedProducts = await createProductsPromise(products);
  return loadedProducts;
}

// PROMESA 2: simula la consulta de los productos marcados como destacados.
export function createFeaturedProductsPromise(products) {
  return new Promise((resolve) => {
    window.setTimeout(
      () => resolve(products.filter((product) => product.featured)),
      SHORT_DELAY,
    );
  });
}

// FUNCIÓN ASÍNCRONA 2: espera la Promesa 2 y devuelve los destacados.
export async function loadFeaturedProductsAsync(products) {
  const featuredProducts = await createFeaturedProductsPromise(products);
  return featuredProducts;
}

// PROMESA 3: simula la carga de los banners activos de la página principal.
export function createBannersPromise(banners) {
  return new Promise((resolve) => {
    window.setTimeout(
      () => resolve(banners.filter((banner) => banner.active)),
      SHORT_DELAY,
    );
  });
}

// FUNCIÓN ASÍNCRONA 3: espera la Promesa 3 y devuelve los banners activos.
export async function loadBannersAsync(banners) {
  const activeBanners = await createBannersPromise(banners);
  return activeBanners;
}

// PROMESA 4: simula la carga de las sucursales de la farmacia.
export function createBranchesPromise(branches) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve([...branches]), SHORT_DELAY);
  });
}

// FUNCIÓN ASÍNCRONA 4: espera la Promesa 4 y devuelve las sucursales.
export async function loadBranchesAsync(branches) {
  const loadedBranches = await createBranchesPromise(branches);
  return loadedBranches;
}

// PROMESA 5: simula el tiempo que tardaría un backend en validar el login.
export function createLoginPromise(email, password, loginValidator) {
  return new Promise((resolve) => {
    window.setTimeout(
      () => resolve(loginValidator(email, password)),
      LOGIN_DELAY,
    );
  });
}

// FUNCIÓN ASÍNCRONA 5: espera la Promesa 5 y devuelve el resultado del login.
export async function validateLoginAsync(email, password, loginValidator) {
  const loginResult = await createLoginPromise(email, password, loginValidator);
  return loginResult;
}
