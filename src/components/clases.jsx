import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  HomeIcon, 
  UserIcon, 
  ChatBubbleBottomCenterIcon, 
  BellIcon, 
  EnvelopeIcon, 
  PlusCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import logo from "../img/log-alum.png";
import placeholderImage from "../img/class-icon.jpg";

function Card({ children, className, onClick }) {
  return (
    <div
      className={`shadow-md rounded-2xl bg-white ${className}`}
      onClick={onClick}
      style={{ height: '250px' }}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default function Classroom() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState({ created: [], joined: [] });
  const [userInfo, setUserInfo] = useState({ email: "", name: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    students: []
  });
  const [studentInput, setStudentInput] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token || !user?.email) {
      navigate("/login");
      return;
    }

    setUserInfo({
      email: user.email,
      name: user.name || ""
    });

    // Cargar las clases
    fetchClasses(token, user.email);
  }, [navigate]);

  const fetchClasses = async (token, userEmail) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("https://github-back-alumnos-8.onrender.com/api/classes", {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las clases');
      }

      const data = await response.json();
      
      // Procesar los datos como en la versión que funcionaba
      const createdClasses = data.filter(classItem => 
        classItem.creatorEmail === userEmail
      );

      const joinedClasses = data.filter(classItem => 
        classItem.students.some(student => student.email === userEmail) &&
        !createdClasses.some(c => c._id === classItem._id)
      );

      setClasses({ 
        created: createdClasses, 
        joined: joinedClasses 
      });

    } catch (err) {
      setErrorMessage(err.message || "Error al cargar las clases");
    } finally {
      setIsLoading(false);
    }
  };

  // Resto de las funciones (handleSubmitClass, handleClassClick, etc.) permanecen igual
  const handleSubmitClass = async () => {
    try {
      if (!newClass.name.trim()) {
        throw new Error("El nombre de la clase es requerido");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No estás autenticado");
      }

      const classData = {
        className: newClass.name,
        students: newClass.students,
        creatorName: userInfo.name,
        creatorEmail: userInfo.email
      };

      const response = await fetch("https://github-back-alumnos-8.onrender.com/api/classes", {
        method: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(classData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la clase");
      }

      // Recargar las clases después de crear una nueva
      await fetchClasses(token, userInfo.email);
      handleCloseModal();
    } catch (err) {
      setErrorMessage(err.message || "Error al crear la clase");
    }
  };

  const handleClassClick = (classId, isCreator) => {
    navigate(isCreator ? `/clases/${classId}/tareas/crear` : `/clases/${classId}/tareas`);
  };

  const handleCreateClass = () => {
    setShowCreateModal(true);
    setErrorMessage("");
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewClass({ name: "", students: [] });
    setStudentInput("");
    setErrorMessage("");
  };

  const handleAddStudent = () => {
    try {
      if (!studentInput.trim()) {
        throw new Error("Ingresa un email");
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(studentInput)) {
        throw new Error("Ingresa un email válido");
      }

      if (studentInput === userInfo.email) {
        throw new Error("No puedes agregarte como estudiante");
      }

      if (newClass.students.some(s => s.email === studentInput)) {
        throw new Error("Este estudiante ya fue agregado");
      }

      setNewClass(prev => ({
        ...prev,
        students: [...prev.students, { 
          name: studentInput.split('@')[0], 
          email: studentInput 
        }]
      }));
      setStudentInput("");
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleRemoveStudent = (email) => {
    setNewClass(prev => ({
      ...prev,
      students: prev.students.filter(s => s.email !== email)
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gray-200">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-200">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <div className="bg-[#34495E] p-4 flex justify-between items-center z-20 relative">
          <img src={logo} alt="Logo" className="h-12" />
          <div className="flex items-center space-x-4">
            <BellIcon className="w-6 h-6 text-white cursor-pointer" onClick={() => navigate("/notificaciones")} />
            <EnvelopeIcon className="w-6 h-6 text-white cursor-pointer" onClick={() => navigate("/mensajes")} />
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm" 
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Class Content */}
        <div className="p-6 pt-20">
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold">Mis Clases</h1>
            <button
              onClick={handleCreateClass}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Crear Nueva Clase
            </button>
          </div>

          {/* Created Classes */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Clases Creadas ({classes.created.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.created.length > 0 ? (
                classes.created.map((classItem) => (
                  <Card key={classItem._id} onClick={() => handleClassClick(classItem._id, true)}>
                    <img src={placeholderImage} alt="Clase" className="w-full h-2/3 object-cover rounded-t-2xl" />
                    <CardContent>
                      <h2 className="text-2xl font-semibold">{classItem.name}</h2>
                      <p className="text-gray-600">Estudiantes: {classItem.students?.length || 0}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-4 text-center">
                  <p className="text-gray-500">No has creado ninguna clase</p>
                </div>
              )}
            </div>
          </div>

          {/* Joined Classes */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Clases a las que Perteneces ({classes.joined.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.joined.length > 0 ? (
                classes.joined.map((classItem) => (
                  <Card key={classItem._id} onClick={() => handleClassClick(classItem._id, false)}>
                    <img src={placeholderImage} alt="Clase" className="w-full h-2/3 object-cover rounded-t-2xl" />
                    <CardContent>
                      <h2 className="text-2xl font-semibold">{classItem.name}</h2>
                      <p className="text-gray-600">Creador: {classItem.creatorName}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-4 text-center">
                  <p className="text-gray-500">No perteneces a ninguna clase</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Crear Nueva Clase</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la clase*</label>
                <input
                  type="text"
                  name="name"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ej: Matemáticas Avanzadas"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agregar estudiantes*</label>
                <div className="flex">
                  <input
                    type="email"
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md"
                    placeholder="Email del estudiante"
                  />
                  <button
                    onClick={handleAddStudent}
                    className="bg-blue-500 text-white px-3 rounded-r-md hover:bg-blue-600"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {newClass.students.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Estudiantes agregados:</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {newClass.students.map((student) => (
                      <div key={student.email} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span>{student.email}</span>
                        <button
                          onClick={() => handleRemoveStudent(student.email)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aún no has agregado estudiantes</p>
              )}

              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitClass}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={!newClass.name || newClass.students.length === 0}
                >
                  Crear Clase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}