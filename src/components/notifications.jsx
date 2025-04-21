import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon, ChatBubbleBottomCenterIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const Notifications = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Para el buscador
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
      fetchNotifications(token); // Obtener las notificaciones cuando el usuario está autenticado
    }
  }, [navigate]);

  // Función para obtener las notificaciones
  const fetchNotifications = async (token) => {
    try {
      const response = await axios.get("https://github-back-alumnos-8.onrender.com/api/notifications/user", {
        headers: {
          Authorization: token,
        },
      });
      setNotifications(response.data); // Guardamos las notificaciones recibidas
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Filtrar las notificaciones por el texto de búsqueda
  const filteredNotifications = notifications.filter(
    (notification) =>
      (notification.title && notification.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (notification.message && notification.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-gray-200">
      {/* Sidebar */}
      <div className={`bg-[#2C3E50] text-white w-64 p-4 space-y-4 ${sidebarOpen ? "block" : "hidden"} md:block`}>
        <h2 className="text-xl font-semibold text-center">Dashboard</h2>
        <nav className="space-y-2">
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/dashboard")}>
            <HomeIcon className="w-6 h-6 mr-2" /> Inicio
          </button>
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/calendario")}>
            <ChatBubbleBottomCenterIcon className="w-6 h-6 mr-2" /> Calendario
          </button>
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/chat")}>
            <ChatBubbleBottomCenterIcon className="w-6 h-6 mr-2" /> Chat
          </button>
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/mensajes")}>
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 mr-2" /> Mensajes
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#34495E] p-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Notificaciones</h1>
          <input
            type="text"
            placeholder="Buscar notificaciones..."
            className="bg-white text-gray-700 px-4 py-2 rounded-lg w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notifications Content */}
        <div className="p-6">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div key={notification._id} className="bg-white p-4 rounded-lg shadow-lg mb-4 hover:bg-gray-100">
                <h3 className="text-lg font-semibold">{notification.title}</h3>
                <p className="text-gray-600">{notification.message}</p>
                <div className="flex justify-between text-sm text-gray-500 mt-4">
                  <span>{new Date(notification.sentAt).toLocaleDateString()}</span>
                  <span>{new Date(notification.sentAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No hay notificaciones disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
