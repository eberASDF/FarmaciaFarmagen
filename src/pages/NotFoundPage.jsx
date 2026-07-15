import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="notfound-page">
      <div className="notfound-elements-ring">
        {/* Water */}
        <div className="notfound-element notfound-element--water" title="Agua">
          <svg viewBox="0 0 100 100" className="notfound-element-svg">
            <defs>
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#waterGrad)" strokeWidth="3"/>
            {/* Water wave symbol */}
            <path d="M25 55 C30 45, 35 45, 40 55 C45 65, 50 65, 55 55 C60 45, 65 45, 70 55" 
                  fill="none" stroke="url(#waterGrad)" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M30 45 C35 35, 40 35, 45 45 C50 55, 55 55, 60 45 C65 35, 70 35, 75 45" 
                  fill="none" stroke="url(#waterGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
            {/* Water drop */}
            <path d="M50 22 C50 22, 42 34, 42 38 C42 42.4, 45.6 46, 50 46 C54.4 46, 58 42.4, 58 38 C58 34, 50 22, 50 22Z"
                  fill="url(#waterGrad)" opacity="0.8"/>
          </svg>
          <span className="notfound-element-label">Agua</span>
        </div>

        {/* Earth */}
        <div className="notfound-element notfound-element--earth" title="Tierra">
          <svg viewBox="0 0 100 100" className="notfound-element-svg">
            <defs>
              <linearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#earthGrad)" strokeWidth="3"/>
            {/* Earth/rock triangle */}
            <path d="M50 20 L75 65 L25 65 Z" fill="none" stroke="url(#earthGrad)" strokeWidth="3.5" strokeLinejoin="round"/>
            {/* Inner triangle */}
            <path d="M50 36 L63 58 L37 58 Z" fill="url(#earthGrad)" opacity="0.4"/>
            {/* Horizontal line */}
            <line x1="30" y1="72" x2="70" y2="72" stroke="url(#earthGrad)" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <span className="notfound-element-label">Tierra</span>
        </div>

        {/* Fire */}
        <div className="notfound-element notfound-element--fire" title="Fuego">
          <svg viewBox="0 0 100 100" className="notfound-element-svg">
            <defs>
              <linearGradient id="fireGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#fireGrad)" strokeWidth="3"/>
            {/* Flame */}
            <path d="M50 18 C50 18, 35 40, 35 55 C35 63.3, 41.7 70, 50 70 C58.3 70, 65 63.3, 65 55 C65 40, 50 18, 50 18Z" 
                  fill="url(#fireGrad)" opacity="0.7"/>
            {/* Inner flame */}
            <path d="M50 38 C50 38, 42 50, 42 57 C42 61.4, 45.6 65, 50 65 C54.4 65, 58 61.4, 58 57 C58 50, 50 38, 50 38Z" 
                  fill="#fbbf24" opacity="0.8"/>
            {/* Flame tip */}
            <path d="M50 48 C50 48, 46 55, 46 58 C46 60.2, 47.8 62, 50 62 C52.2 62, 54 60.2, 54 58 C54 55, 50 48, 50 48Z" 
                  fill="#fef3c7" opacity="0.9"/>
          </svg>
          <span className="notfound-element-label">Fuego</span>
        </div>

        {/* Air */}
        <div className="notfound-element notfound-element--air" title="Aire">
          <svg viewBox="0 0 100 100" className="notfound-element-svg">
            <defs>
              <linearGradient id="airGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a5b4fc" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#airGrad)" strokeWidth="3"/>
            {/* Air swirl lines */}
            <path d="M25 40 C35 30, 55 30, 55 40 C55 48, 40 48, 40 40 C40 32, 60 28, 70 38" 
                  fill="none" stroke="url(#airGrad)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M30 55 C38 48, 55 48, 55 55 C55 60, 45 60, 45 55 C45 50, 58 47, 65 52" 
                  fill="none" stroke="url(#airGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
            <path d="M35 67 C42 62, 52 62, 52 67 C52 70, 46 70, 46 67 C46 64, 55 62, 60 65" 
                  fill="none" stroke="url(#airGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
          </svg>
          <span className="notfound-element-label">Aire</span>
        </div>
      </div>

      <div className="notfound-content">
        <h1 className="notfound-code">
          <span className="notfound-code-4">4</span>
          <span className="notfound-code-0">
            <svg viewBox="0 0 100 100" className="notfound-code-circle">
              <defs>
                <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="44" fill="none" stroke="url(#circleGrad)" strokeWidth="6" className="notfound-spin-circle"/>
            </svg>
          </span>
          <span className="notfound-code-4">4</span>
        </h1>
        <h2 className="notfound-title">Página No Encontrada</h2>
        <p className="notfound-text">
          Ni el Avatar dominando los 4 elementos podría encontrar esta página. 
          Parece que te has aventurado más allá del mapa conocido.
        </p>
        <Link to="/" className="notfound-btn" id="go-home-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="notfound-btn-icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
