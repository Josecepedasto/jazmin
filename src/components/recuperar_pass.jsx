import React, { useState } from "react";
import axios from "axios";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://github-back-alumnos-8.onrender.com/api/password/send-code",
        { email }
      );
      setMessage(response.data.message || "Código enviado con éxito.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar el código.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://github-back-alumnos-8.onrender.com/api/password/reset",
        { code, newPassword }
      );
      setMessage(response.data.message || "Contraseña actualizada con éxito.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Error al restablecer la contraseña.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {step === 1 && "Recuperar Contraseña"}
          {step === 2 && "Verificar Código"}
          {step === 3 && "¡Contraseña Actualizada!"}
        </h2>

        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border rounded"
              required
            />
            <button className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
              Enviar Código
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="Código de Recuperación"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 mb-4 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded"
              required
            />
            <button className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600">
              Restablecer Contraseña
            </button>
          </form>
        )}

        {step === 3 && (
          <button
            onClick={() => window.location.href = "/login"}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Volver al Login
          </button>
        )}
      </div>
    </div>
  );
};

export default PasswordRecovery;