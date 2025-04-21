import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import logo from "../img/log-alum.png";

const ChatPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Nuevo estado para mensaje de éxito
  const token = localStorage.getItem("token");

  const sendMessage = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Limpiar mensaje de éxito antes de intentar enviar

    if (!content.trim() || !recipientEmail.trim()) {
      setError("El mensaje y el correo del destinatario no pueden estar vacíos");
      return;
    }

    try {
      const response = await axios.post(
        "https://github-back-alumnos-8.onrender.com/api/messages/send",
        { recipientEmail, content },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setContent("");
      setRecipientEmail("");
      setSuccessMessage("¡Mensaje enviado correctamente!"); // Establecer mensaje de éxito
      console.log("Mensaje enviado:", response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Error al enviar el mensaje");
      console.error(err);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-200">
      {/* Sidebar */}
      <div className="bg-[#2C3E50] text-white w-64 p-4 space-y-4">
        <h2 className="text-xl font-semibold text-center">Dashboard</h2>
        <nav className="space-y-2">
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/dashboard")}>
            <HomeIcon className="w-6 h-6 mr-2" /> Inicio
          </button>
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/calendario")}>
            <UserIcon className="w-6 h-6 mr-2" /> Calendario
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#34495E] p-4 flex justify-between items-center">
          <img src={logo} alt="Logo" className="h-12" />

          {/* Botón de Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Chat Form */}
        <div className="p-6 flex-grow flex justify-center items-center">
          <div className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-[#34495E] text-2xl font-semibold mb-4 text-center">Agregar contacto mandando Mensaje</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
            <form onSubmit={sendMessage}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Correo del destinatario"
                  className="w-full px-4 py-3 border rounded-lg text-gray-700"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Escribe tu mensaje aquí"
                  className="w-full px-4 py-3 border rounded-lg text-gray-700"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
