import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";

export default function BranchesPage() {
  const { branches } = useApp();
  const activeBranches = branches.filter(branch => branch.active !== false);

  return (
    <div className="page-container">
      <Breadcrumbs />

      <div className="branches-header">
        <h1 className="page-title">Nuestras Sucursales</h1>
        <p className="page-subtitle">Visita cualquiera de nuestras {activeBranches.length} ubicaciones</p>
      </div>

      <div className="branches-grid">
        {activeBranches.map(branch => (
          <div key={branch.id} className="branch-card" id={`branch-${branch.id}`}>
            <div className="branch-card-map" style={{ height: '200px' }}>
              <img
                src={branch.image || "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=400&h=300"}
                alt={branch.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="branch-card-body">
              <h3 className="branch-card-name">{branch.name}</h3>

              <div className="branch-card-row">
                <svg className="branch-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{branch.address}</span>
              </div>

              <div className="branch-card-row">
                <svg className="branch-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{branch.phone}</span>
              </div>

              <div className="branch-card-row">
                <svg className="branch-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{branch.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
