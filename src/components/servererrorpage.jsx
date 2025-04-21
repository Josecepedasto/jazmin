import React from "react";
import { useNavigate } from "react-router-dom";

const ServerErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      <h1 className="text-6xl font-bold text-[#34495E]">500</h1>
      <p className="text-xl text-gray-700 mt-2">Error Interno del Servidor</p>
      <p className="text-gray-500 mb-6">Lo sentimos, algo salió mal en el servidor. Por favor, intenta de nuevo más tarde.</p>
      
      <button
        onClick={() => navigate("/")}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-lg"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default ServerErrorPage;
