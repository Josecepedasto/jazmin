import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentTextIcon, ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function TaskSubmission() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/login");
      return;
    }

    fetchTaskDetails(token);
  }, [taskId, navigate]);

  const fetchTaskDetails = async (token) => {
    try {
      const response = await fetch(`https://github-back-alumnos-8.onrender.com/api/tasks/task/${taskId}`, {
        headers: {
          "Authorization": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener la tarea');
      }

      const taskData = await response.json();
      setTask(taskData);
      
      if (taskData.submission?.fileUrl) {
        const urlParts = taskData.submission.fileUrl.split('/');
        setFileName(urlParts[urlParts.length - 1]);
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage(err.message);
    }
  };

  const handleFileChange = (e) => {
    if (task?.submission?.fileUrl) return; // No permitir cambios si ya hay entrega

    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage('El archivo no puede ser mayor a 5MB');
        return;
      }
      
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'image/jpeg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        setErrorMessage('Solo se permiten archivos PDF, DOC, DOCX, JPG o PNG');
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setErrorMessage('');
    }
  };

  const handleSubmit = async () => {
    if (!file || task?.submission?.fileUrl) return; // No permitir envío si ya hay entrega

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);

    try {
      const response = await fetch("https://github-back-alumnos-8.onrender.com/api/tasks/submit", {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al entregar la tarea');
      }

      setSuccessMessage('¡Tarea entregada con éxito!');
      await fetchTaskDetails(token);
      
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage(err.message || 'Hubo un problema al subir el archivo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = () => {
    if (!task?.status) return null;
    
    let badgeClass = '';
    let icon = null;

    switch (task.status.toLowerCase()) {
      case 'entregado':
        badgeClass = 'bg-green-100 text-green-800';
        icon = <CheckCircleIcon className="h-5 w-5 mr-1" />;
        break;
      case 'fuera de plazo':
        badgeClass = 'bg-red-100 text-red-800';
        icon = <ExclamationCircleIcon className="h-5 w-5 mr-1" />;
        break;
      case 'calificado':
        badgeClass = 'bg-blue-100 text-blue-800';
        icon = <CheckCircleIcon className="h-5 w-5 mr-1" />;
        break;
      default:
        badgeClass = 'bg-yellow-100 text-yellow-800';
        icon = <ClockIcon className="h-5 w-5 mr-1" />;
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>
        {icon}
        {task.status.toUpperCase()}
      </span>
    );
  };

  if (!task) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Entrega de Tarea</h1>
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Instrucciones:</h2>
        <p className="text-gray-600 whitespace-pre-line">{task.instructions}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Fecha límite:</h3>
          <p className="text-gray-900">
            {new Date(task.dueDate).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Estado:</h3>
          {renderStatusBadge()}
        </div>
      </div>

      {task.grade && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Calificación:</h3>
          <p className="text-2xl font-bold text-blue-600">{task.grade}/10</p>
        </div>
      )}

      {/* Formulario de entrega - Solo si no hay entrega existente */}
      {!task.submission?.fileUrl ? (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subir archivo de entrega
            </label>
            <div className="mt-1 flex items-center">
              <label className={`cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
                <span>Seleccionar archivo</span>
                <input 
                  type="file" 
                  className="sr-only" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
              <span className="ml-4 text-sm text-gray-600">
                {fileName || 'Ningún archivo seleccionado'}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Formatos aceptados: PDF, DOC, DOCX, JPG, PNG (Máx. 5MB)
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !file}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isSubmitting || !file) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Entregar Tarea'
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Entrega actual</h3>
          <div className="flex items-center">
            <DocumentTextIcon className="h-10 w-10 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              <p className="text-sm text-gray-500">
                Entregado el: {new Date(task.submission.submittedAt).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-700">Esta tarea ya fue entregada. No puedes modificarla.</p>
          </div>
        </div>
      )}
    </div>
  );
}