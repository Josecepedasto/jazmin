import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { HomeIcon, UserIcon, ChatBubbleBottomCenterIcon, BellIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import logo from "../img/log-alum.png";

function Card({ children, className, onClick }) {
  return (
    <div
      className={`shadow-md rounded-2xl bg-white ${className}`}
      onClick={onClick}
      style={{ width: '950px', minHeight: '150px' }}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default function ClassroomTasks() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({ id: "", email: "", role: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/login");
      return;
    }

    setUserInfo({
      id: user.id || "",
      email: user.email || "",
      role: user.role || ""
    });

    if (!classId) {
      setErrorMessage("No se encontró el ID de la clase.");
      setLoading(false);
      return;
    }

    fetchTasks(token, user.email);
  }, [classId, navigate]);

  const fetchTasks = async (token, userEmail) => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      const response = await fetch(`https://github-back-alumnos-8.onrender.com/api/tasks/${classId}`, {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener las tareas');
      }

      const data = await response.json();
      
      // Filtrar tareas según el rol del usuario
      const filteredTasks = userInfo.role === 'teacher' 
        ? data 
        : data.filter(task => task.studentEmail === userEmail);
      
      setTasks(filteredTasks);
    } catch (err) {
      setErrorMessage(`Hubo un problema al cargar las tareas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'entregado': return 'bg-green-100 text-green-800';
      case 'fuera de plazo': return 'bg-red-100 text-red-800';
      case 'calificado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleTaskClick = (task) => {
    // Verificar que el alumno solo pueda acceder a sus propias tareas
    if (userInfo.role === 'student' && task.studentEmail !== userInfo.email) {
      setErrorMessage('No tienes permiso para ver esta tarea');
      return;
    }
    navigate(`/tareas/${task._id}`);
  };

  return (
    <div className="min-h-screen flex bg-gray-200">
      <div className="bg-[#2C3E50] text-white w-64 p-4 space-y-4 fixed top-0 left-0 h-full z-10">
        <h2 className="text-xl font-semibold text-center">Dashboard</h2>
        <nav className="space-y-2">
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/dashboard")}>
            <HomeIcon className="w-6 h-6 mr-2" /> Inicio
          </button>
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/calendario")}>
            <UserIcon className="w-6 h-6 mr-2" /> Calendario
          </button>
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/chat")}>
            <ChatBubbleBottomCenterIcon className="w-6 h-6 mr-2" /> Agregar contacto
          </button>
          <button className="flex items-center w-full p-2 rounded hover:bg-gray-700" onClick={() => navigate("/clases")}>
            <UserIcon className="w-6 h-6 mr-2" /> Clases
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col ml-64">
        <div className="bg-[#34495E] p-4 flex justify-between items-center z-20 relative">
          <img src={logo} alt="Logo" className="h-12" />
          <div className="flex items-center space-x-4">
            <p className="text-white">{userInfo.email}</p>
            <BellIcon className="w-6 h-6 text-white cursor-pointer" onClick={() => navigate("/notificaciones")} />
            <EnvelopeIcon className="w-6 h-6 text-white cursor-pointer" onClick={() => navigate("/mensajes")} />
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="p-6 pt-20">
          <h1 className="text-3xl font-semibold mb-6">Tareas de la Clase</h1>

          {errorMessage && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{errorMessage}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando tareas...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <Card key={task._id} onClick={() => handleTaskClick(task)}>
                    <CardContent className="flex flex-col h-full">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold mb-2">{task.instructions}</h2>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Fecha límite:</span> {formatDate(task.dueDate)}
                          </p>
                          {userInfo.role === 'teacher' && (
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium">Estudiante:</span> {task.studentEmail}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status.toUpperCase()}
                          </span>
                          {task.grade && (
                            <span className="mt-2 text-lg font-bold">
                              Calificación: {task.grade}/10
                            </span>
                          )}
                        </div>
                      </div>
                      {task.submission?.submittedAt && (
                        <div className="mt-2 text-sm text-gray-500">
                          Entregado el: {formatDate(task.submission.submittedAt)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No hay tareas para esta clase.</p>
                  {userInfo.role === 'teacher' && (
                    <button 
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={() => navigate(`/clases/${classId}/tareas/crear`)}
                    >
                      Crear Nueva Tarea
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}