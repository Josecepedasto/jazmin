import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../img/log-alum.png";

const RegistroPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: "" });
  const [captchaError, setCaptchaError] = useState(null);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: "" });
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (e) => {
    setCaptcha({ ...captcha, answer: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCaptchaError(null);
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    if (parseInt(captcha.answer) !== captcha.num1 + captcha.num2) {
      setCaptchaError("Captcha incorrecto. Inténtalo de nuevo.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://github-back-alumnos-8.onrender.com/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      alert("Registro exitoso. Redirigiendo a login...");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      {/* Header */}
      <div className="bg-[#34495E] p-4 flex justify-between items-center relative">
        <img src={logo} alt="Logo" className="h-12" />
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {menuOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
        </button>
        {menuOpen && (
          <div className="absolute top-16 right-4 bg-[#34495E] text-white shadow-lg rounded-lg py-2 w-48">
            <button onClick={() => handleNavigation("/")} className="block px-4 py-2 w-full text-left hover:bg-gray-700">Inicio</button>
            <button onClick={() => handleNavigation("/informacion")} className="block px-4 py-2 w-full text-left hover:bg-gray-700">Información</button>
            <button onClick={() => handleNavigation("/login")} className="block px-4 py-2 w-full text-left hover:bg-gray-700">Iniciar sesión</button>
          </div>
        )}
      </div>

      {/* Formulario de Registro */}
      <div className="flex-grow flex justify-center items-center w-full h-full p-4">
        <div className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-gray-700 text-xl font-semibold mb-4 text-center">Registro de Datos</h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {captchaError && <p className="text-red-500 text-sm text-center">{captchaError}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nombre Completo" className="w-full px-4 py-2 border rounded-lg" value={formData.name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Correo Electrónico Académico" className="w-full px-4 py-2 border rounded-lg" value={formData.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="Contraseña" className="w-full px-4 py-2 border rounded-lg" value={formData.password} onChange={handleChange} />
            {/* Captcha */}
            <div className="text-center">
              <p className="text-gray-700">¿Cuánto es {captcha.num1} + {captcha.num2}?</p>
              <input type="number" placeholder="Ingresa el resultado" className="w-full px-4 py-2 border rounded-lg" value={captcha.answer} onChange={handleCaptchaChange} />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">Al registrarse acepta nuestras políticas escolares</p>
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              ¿Ya tienes una cuenta? {" "}
              <button onClick={() => navigate("/login")} className="text-green-600 font-bold">Iniciar Sesión</button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#34495E] text-white text-center py-4">
        <div className="container mx-auto">
          <p>Contáctanos: (100-785-0941) | email: contacto@nuestroapp.com</p>
          <p className="mt-2">Derechos Reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default RegistroPage;
