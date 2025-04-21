import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateTask() {
  const [tasks, setTasks] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [className, setClassName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [grade, setGrade] = useState("");
  const { classId } = useParams();
  const navigate = useNavigate();

  const irACrearCuestionario = () => {
    navigate("/crear-cuestionario");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado");
      navigate("/login");
      return;
    }

    if (!classId) {
      console.error("El classId es indefinido");
      return;
    }

    fetchTasks(token);
    fetchClassDetails(token);
  }, [classId, navigate]);

  const fetchTasks = (token) => {
    fetch(`https://github-back-alumnos-8.onrender.com/api/tasks/${classId}`, {
      headers: { "Authorization": `${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener las tareas");
        }
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error al obtener tareas:", err));
  };

  const fetchClassDetails = (token) => {
    fetch(`https://github-back-alumnos-8.onrender.com/api/classes/${classId}`, {
      headers: { "Authorization": `${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener la clase");
        }
        return res.json();
      })
      .then((data) => {
        setClassName(data.name);
      })
      .catch((err) => console.error("Error al obtener la clase:", err));
  };

  const handleCreateTask = () => {
    if (!instructions || !dueDate) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const [year, month, day] = dueDate.split("-");
    const dueDateObject = new Date(year, month - 1, day, 23, 59, 59, 999);

    const newTask = {
      classId,
      instructions,
      dueDate: dueDateObject.toISOString(),
    };

    const token = localStorage.getItem("token");

    if (!token) {
      alert("No se encontró el token de autenticación.");
      return;
    }

    fetch("https://github-back-alumnos-8.onrender.com/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`,
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al crear la tarea");
        }
        return res.json();
      })
      .then((data) => {
        if (data.tasks) {
          setTasks([...tasks, ...data.tasks]);
          setInstructions("");
          setDueDate("");
          setIsModalOpen(false);
        } else {
          alert("Error al crear la tarea.");
        }
      })
      .catch((err) => {
        console.error("Error al crear la tarea:", err);
        alert("Error al crear la tarea.");
      });
  };

  const handleDownloadFile = async (taskId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No estás autenticado");
      return;
    }
  
    try {
      const response = await fetch(`https://github-back-alumnos-8.onrender.com/api/tasks/submission/${taskId}`, {
        headers: { 
          "Authorization": token 
        }
      });
  
      if (!response.ok) {
        throw new Error("No tienes permiso para descargar este archivo");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Obtener el nombre del archivo del header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'entrega';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar:", err);
      alert(err.message || "Error al descargar el archivo");
    }
  };

  const handleGradeTask = (taskId) => {
    if (!grade || grade < 1 || grade > 10) {
      alert("Por favor ingrese una calificación válida (1-10)");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se encontró el token de autenticación.");
      return;
    }

    fetch("https://github-back-alumnos-8.onrender.com/api/tasks/grade", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`,
      },
      body: JSON.stringify({ taskId, grade: parseInt(grade) }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al calificar la tarea");
        }
        return res.json();
      })
      .then(() => {
        alert("Tarea calificada correctamente");
        setGrade("");
        setSelectedTask(null);
        fetchTasks(token);
      })
      .catch((err) => {
        console.error("Error al calificar la tarea:", err);
        alert("Error al calificar la tarea.");
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'entregado': return 'bg-green-100 text-green-800';
      case 'fuera de plazo': return 'bg-red-100 text-red-800';
      case 'calificado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Volver
      </button>

      <h2 className="text-2xl font-semibold mb-4">Tareas de la Clase: {className}</h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Crear Tarea
      </button>

      <button 
        onClick={irACrearCuestionario}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Crear Cuestionario
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">Crear Nueva Tarea</h3>

            <label className="block mb-2">Instrucciones</label>
            <textarea
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />

            <label className="block mb-2">Fecha de entrega</label>
            <input
              type="date"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
              >
                Crear Tarea
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} className="p-4 bg-white rounded-2xl shadow-md mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{task.instructions}</h3>
                <p className="text-gray-600">Alumno: {task.studentEmail}</p>
                <p className="text-gray-600">Fecha de entrega: {new Date(task.dueDate).toLocaleDateString()}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status?.toUpperCase() || 'PENDIENTE'}
                </span>
                {task.grade && (
                  <p className="text-gray-800 font-bold">Calificación: {task.grade}/10</p>
                )}
              </div>
              
              <div className="flex flex-col space-y-2">
                {task.submission?.fileUrl && (
                  <button
                    onClick={() => handleDownloadFile(task._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Descargar Entrega
                  </button>
                )}
                <button
                  onClick={() => setSelectedTask(task)}
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                >
                  Calificar
                </button>
              </div>
            </div>

            {selectedTask?._id === task._id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded"
                    placeholder="1-10"
                  />
                  <button
                    onClick={() => handleGradeTask(task._id)}
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Enviar Calificación
                  </button>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No hay tareas disponibles.</p>
      )}
    </div>
  );
}