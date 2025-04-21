import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon, UserIcon, ChatBubbleBottomCenterIcon, BellIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import logo from "../img/log-alum.png";

const CalendarPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar token
    navigate("/login"); // Redirigir al login
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-gray-200">
      {/* Sidebar */}
      <div className={`bg-[#2C3E50] text-white w-64 p-4 space-y-4 fixed top-0 left-0 h-full z-10`}>
        <h2 className="text-xl font-semibold text-center">Dashboard</h2>
        <nav className="space-y-2">
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/dashboard")}>
            <HomeIcon className="w-6 h-6 mr-2" /> Inicio
          </button>
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/calendario")}>
            <UserIcon className="w-6 h-6 mr-2" /> Calendario
          </button>
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/chat")}>
            <ChatBubbleBottomCenterIcon className="w-6 h-6 mr-2" /> Chat
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <div className="bg-[#34495E] p-4 flex justify-between items-center z-20 relative">
          <img src={logo} alt="Logo" className="h-12" />

          {/* Notificaciones, mensajes y botón de cerrar sesión */}
          <div className="flex items-center space-x-4">
            <BellIcon className="w-6 h-6 text-white cursor-pointer" onClick={() => navigate("/notificaciones")} />
            <EnvelopeIcon className="w-6 h-6 text-white cursor-pointer" onClick={() => navigate("/mensajes")} />
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="p-6 pt-16"> {/* Agregado padding-top para evitar que el contenido se solape con el header */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido Alumno</h1>
          <h2 className="text-xl text-gray-700 mb-6">marzo de 2025</h2>

          {/* Calendario */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-2 text-center text-gray-600 font-medium mb-4">
              <div>Lun</div>
              <div>Mar</div>
              <div>Mié</div>
              <div>Jué</div>
              <div>Vié</div>
              <div>Sáb</div>
              <div>Dom</div>
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-2 text-center text-gray-800">
              {[24, 25, 26, 27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6].map((day, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${day === 5 || day === 12 || day === 19 ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
