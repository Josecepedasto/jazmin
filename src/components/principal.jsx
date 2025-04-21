import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../img/log-alum.png";
import plataformaImage from "../img/fot-in.png";

const HomePage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <div className="bg-[#34495E] p-4 flex justify-between items-center relative">
        <img src={logo} alt="Logo" className="h-12" />
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {menuOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
        </button>
        {menuOpen && (
          <div className="absolute top-16 right-4 bg-[#34495E] shadow-lg rounded-lg py-2 w-48">
            <button onClick={() => handleNavigation("/")} className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">Inicio</button>
            <button onClick={() => handleNavigation("/informacion")} className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">Información</button>
            <button onClick={() => handleNavigation("/login")} className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">Iniciar sesión</button>
            <button onClick={() => handleNavigation("/registro")} className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">Registrate</button>
          </div>
        )}
      </div>
      
      <div className="flex-grow flex justify-center items-center w-full h-full p-4">
        <div className="max-w-4xl w-full bg-white rounded-lg p-6 shadow-lg flex flex-row items-center">
          <div className="w-1/2 pr-6">
            <h2 className="text-[#34495E] text-2xl font-semibold mb-4">Bienvenido a nuestra plataforma de comunicaciones</h2>
            <p className="text-gray-700 mb-6">
              Este espacio está diseñado para facilitar la interacción, el aprendizaje colaborativo y la comunicación efectiva entre estudiantes, profesores y compañeros.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <ul className="list-disc list-inside text-gray-700">
                <li>Participar en foros de discusión</li>
                <li>Enviar mensajes directos</li>
                <li>Acceder a anuncios importantes</li>
                <li>Compartir recursos</li>
                <li>Organizar tu aprendizaje</li>
              </ul>
            </div>
          </div>
          <div className="w-1/2 flex justify-center">
            <img src={plataformaImage} alt="Plataforma de comunicaciones" className="rounded-lg shadow-md w-full max-w-md" />
          </div>
        </div>
      </div>

      <footer className="bg-[#34495E] text-white text-center py-4">
        <div className="container mx-auto">
          <p>Contáctanos: (100-785-0941) | email: contacto@nuestroapp.com</p>
          <p className="mt-2">Derechos Reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
