import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Para obtener la ubicación y mostrar enlaces

const Breadcrumbs = () => {
  const location = useLocation(); // Obtener la ubicación actual

  // Crear el array de rutas para los breadcrumbs
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <div className="breadcrumbs">
      <Link to="/" className="breadcrumb-link">Inicio</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <span key={to}>
            <span>/</span>
            <Link to={to} className="breadcrumb-link">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
