import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HomeIcon, ChatBubbleBottomCenterIcon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
// import io from "socket.io-client";

// const socket = io("https://github-back-alumnos-8.onrender.com");

const Messages = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef(null);  // Referencia para desplazarse al final del chat
  const isAtBottom = useRef(false);  // Ref para saber si estamos en el fondo
  const firstLoad = useRef(true);  // Ref para controlar si es la primera vez que abrimos el chat

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
      fetchUserEmail(token).then(() => fetchMessages(token));
    }
  }, [navigate]);

  useEffect(() => {
    ("newMessage", (newMessage) => {
      setContacts((prevContacts) => {
        return prevContacts.map((contact) => {
          if (contact.email === newMessage.senderEmail || contact.email === newMessage.recipientEmail) {
            return { ...contact, messages: [...contact.messages, newMessage] };
          }
          return contact;
        });
      });

      if (selectedChat && (newMessage.senderEmail === selectedChat.email || newMessage.recipientEmail === selectedChat.email)) {
        setSelectedChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        }));
      }
    });
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) return; // ⛔ No hacer nada si no hay chat abierto
  
    const token = localStorage.getItem("token");
  
    const interval = setInterval(() => {
      fetchUpdatedMessages(token, selectedChat.email);
    }, 5000);
  
    return () => clearInterval(interval); // 🛑 Limpiar intervalo cuando cambie de chat o salga de la página
  }, [selectedChat]);

  useEffect(() => {
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  const fetchUserEmail = async (token) => {
    try {
      const response = await axios.get("https://github-back-alumnos-8.onrender.com/api/user", {
        headers: { Authorization: token },
      });
      setUserEmail(response.data.email);
      setUserName(response.data.name);
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  };

  const fetchMessages = async (token) => {
    try {
      const response = await axios.get("https://github-back-alumnos-8.onrender.com/api/messages/user", {
        headers: { Authorization: token },
      });
  
      const groupedContacts = response.data.reduce((acc, message) => {
        const contactEmail = message.senderEmail === userEmail ? message.recipientEmail : message.senderEmail;
        const contactName = message.senderEmail === userEmail ? message.recipientName : message.senderName;
  
        if (!acc[contactEmail]) {
          acc[contactEmail] = {
            email: contactEmail,
            name: contactName,
            messages: [],
          };
        }
        acc[contactEmail].messages.push({
          ...message,
          isRead: message.isRead, // Asegurar que el estado se refleje
        });
        return acc;
      }, {});
  
      setContacts(Object.values(groupedContacts));
      setFilteredContacts(Object.values(groupedContacts));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  const fetchUpdatedMessages = async (token, contactEmail) => {
    try {
      const response = await axios.get("https://github-back-alumnos-8.onrender.com/api/messages/user", {
        headers: { Authorization: token },
      });
  
      const updatedMessages = response.data.filter(
        (msg) => msg.senderEmail === contactEmail || msg.recipientEmail === contactEmail
      );
  
      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: updatedMessages, // Ahora `isRead` viene directamente del backend
      }));
    } catch (error) {
      console.error("Error al actualizar mensajes:", error);
    }
  };
  

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;
    const token = localStorage.getItem("token");
    try {
      const newMessage = {
        senderEmail: userEmail,
        recipientEmail: selectedChat.email,
        content: message,
      };
      await axios.post("https://github-back-alumnos-8.onrender.com/api/messages/send", newMessage, {
        headers: { Authorization: token },
      });
      // socket.emit("sendMessage", newMessage);

      setContacts((prevContacts) => {
        return prevContacts.map((contact) => {
          if (contact.email === selectedChat.email) {
            return { ...contact, messages: [...contact.messages, newMessage] };
          }
          return contact;
        });
      });

      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, newMessage],
      }));

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const markAsRead = async (messageId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`https://github-back-alumnos-8.onrender.com/api/messages/${messageId}/read`, {}, {
        headers: { Authorization: token },
      });
      // 🚀 No actualizamos manualmente los mensajes aquí, solo esperamos la siguiente llamada al backend
    } catch (error) {
      console.error("Error marcando mensaje como leído:", error);
    }
  };
  
  

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedChat(null);
  };

  const openChat = (contact) => {
    setSelectedChat(contact);
    setIsChatOpen(true);
    firstLoad.current = false;  // No desplazamos al fondo si es la primera vez
  };

  useEffect(() => {
    if (!firstLoad.current && chatEndRef.current) {
      if (isAtBottom.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [selectedChat?.messages]);

  const handleScroll = () => {
    const chatContainer = chatEndRef.current?.parentElement;
    if (chatContainer) {
      isAtBottom.current = chatContainer.scrollHeight === chatContainer.scrollTop + chatContainer.clientHeight;
    }
  };

  useEffect(() => {
    const chatContainer = chatEndRef.current?.parentElement;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => {
        chatContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [selectedChat]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen">
      {/* Menú fijo */}
      <div className="bg-[#2C3E50] text-white w-64 p-4 space-y-4 fixed h-full">
        <h2 className="text-xl font-semibold text-center">Dashboard</h2>
        <nav className="space-y-2">
          <button
            className="flex items-center w-full p-2 rounded hover:bg-gray-700"
            onClick={() => navigate("/dashboard")}
          >
            <HomeIcon className="w-6 h-6 mr-2" />
            Inicio
          </button>
          <button
            className="flex items-center w-full p-2 rounded hover:bg-gray-700"
            onClick={() => navigate("/calendario")}
          >
            <ChatBubbleBottomCenterIcon className="w-6 h-6 mr-2" />
            Calendario
          </button>
          <button
            className="flex items-center w-full p-2 rounded hover:bg-gray-700"
            onClick={() => navigate("/chat")}
          >
            <ChatBubbleBottomCenterIcon className="w-6 h-6 mr-2" />
            Agregar enviando mensaje
          </button>
          <button
            className="flex items-center w-full p-2 rounded hover:bg-gray-700"
            onClick={() => navigate("/notificaciones")}
          >
            <BellIcon className="w-6 h-6 mr-2" />
            Notificaciones
          </button>
        </nav>
      </div>

      {/* Contenido desplazable */}
      <div className="flex-1 flex flex-col ml-64 p-0">
        {/* Header con búsqueda de contactos */}
        <div className="bg-[#34495E] p-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Contactos</h1>
          <input
            type="text"
            placeholder="Buscar contactos..."
            className="bg-white text-gray-700 px-4 py-2 rounded-lg w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Lista de contactos filtrados */}
        <div className="p-6">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.email}
                className="bg-white p-4 rounded-lg shadow-lg mb-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => openChat(contact)}
              >
                <h3 className="text-lg font-semibold">{contact.name}</h3>
                <p className="text-gray-600">{contact.email}</p>
              </div>
            ))
          ) : (
            <p>No hay contactos disponibles.</p>
          )}
        </div>
      </div>

    {/* Chat Modal */}
    {selectedChat && isChatOpen && (
      <div className="fixed bottom-0 right-0 w-96 bg-white shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chat con {selectedChat.name}</h2>
          <button onClick={closeChat} className="text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="h-48 overflow-y-auto border p-2 mb-2">
          {[...selectedChat.messages].reverse().map((msg, index) => (
            <div key={index} className="mb-2 flex justify-between items-center">
              <p
                className={`p-1 border-b ${
                  msg.senderEmail === userEmail ? "text-right" : "text-left"
                }`}
              >
                <strong>{msg.senderEmail === userEmail ? "Tú" : msg.senderName}</strong>: {msg.content}
              </p>
              
              {/* Estado del mensaje */}
              <h5> {msg.status}
              </h5>

              {/* Botón pequeño para marcar como visto si no lo está */}
              {!msg.isRead && msg.senderEmail !== userEmail && (
                <button
                  className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => markAsRead(msg._id)}
                >
                  ✓
                </button>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          className="w-full p-2 border rounded mt-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="w-full mt-2 py-2 bg-[#34495E] text-white rounded"
        >
          Enviar
        </button>
      </div>
    )}

    </div>
  );
};

export default Messages;
