import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../img/log-alum.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setError("Ya tienes una sesión activa.");
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (token) {
      setError("Ya tienes una sesión activa.");
      return;
    }

    try {
      const response = await axios.post("https://github-back-alumnos-8.onrender.com/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      setError("Correo o contraseña incorrectos");
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <div className="bg-[#34495E] p-4 flex justify-between items-center relative">
        <img src={logo} alt="Logo" className="h-12" />
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {menuOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
        </button>
        {menuOpen && (
          <div className="absolute top-16 right-4 bg-[#34495E] text-white shadow-lg rounded-lg py-2 w-48">
            <button onClick={() => handleNavigation("/")} className="block px-4 py-2 w-full text-left hover:bg-gray-700">Inicio</button>
            <button onClick={() => handleNavigation("/informacion")} className="block px-4 py-2 w-full text-left hover:bg-gray-700">Información</button>
            {!isAuthenticated ? (
              <button onClick={() => handleNavigation("/login")} className="block px-4 py-2 w-full text-left hover:bg-gray-700">Iniciar sesión</button>
            ) : (
              <button onClick={handleLogout} className="block px-4 py-2 w-full text-left hover:bg-red-600">Cerrar sesión</button>
            )}
          </div>
        )}
      </div>

      <div className="flex-grow flex justify-center items-center w-full h-full p-4">
        <div className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-[#34495E] text-2xl font-semibold mb-4 text-center">Iniciar Sesión</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {!isAuthenticated ? (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  className="w-full px-4 py-3 border rounded-lg text-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full px-4 py-3 border rounded-lg text-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
                Log in
              </button>
              <p className="text-center mt-4">
                <a href="/recuperarpassword" className="text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
              </p>
            </form>
          ) : (
            <p className="text-green-600 text-center">Sesión activa</p>
          )}
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

export default LoginPage;
