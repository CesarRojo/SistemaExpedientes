import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from './authStore';

const NavbarFolio = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const nombreUsuario = () => {
    if (!user.fullName) {
      return `Usuario-${user.numFolio}`;
    }else{
      return user.fullName;
    }
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <ul className="flex space-x-4">
        <li><Link to="/home" className="hover:text-gray-300">Inicio</Link></li>
        <li><Link to="/Videos" className="hover:text-gray-300">Videos</Link></li>
        <li><Link to="/ExamMedico" className="hover:text-gray-300">Examen Medico</Link></li>
        <li><Link to="/Consent" className="hover:text-gray-300">Consentimiento</Link></li>
        <li><Link to="/SolicInt" className="hover:text-gray-300">Solicitud Interna</Link></li>
      </ul>
      <div className="relative">
        <button 
          onClick={toggleMenu} 
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          {nombreUsuario()}
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
            <button 
              onClick={handleLogout} 
              className="block px-4 py-2 text-left w-full hover:bg-gray-200"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarFolio;