import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/principal'; // Componente de la página principal
import NotFoundPage from './components/404page'; // Componente de la página error 404
import ServerErrorPage from './components/servererrorpage'; // Componente de la página error 500
import LoginPage from './components/login'; // Componente de la página de login
import InformacionPage from './components/informacion'; // Componente de la página de informacion
import RegistroPage from './components/registro'; // Componente de la página de registro
import CalendarPage from './components/calendario'; // Componente de la página de calendario
import DashPage from './components/Dashboard'; // Componente de la página de dasboard
import Messages from './components/messages'; // Componente de la página de mensajes
import Notifications from './components/notifications'; // Componente de la página de notificaciones
import ChatPage from './components/chat'; // Componente de la página de chat
import Classroom from './components/clases'; // Componente de la página de clases
import Tasks from './components/tareas_creator'; // Componente de la página de tareas del creador
import Tasks_alum from './components/tareas_alum'; // Componente de la página de tareas del alumno
import TaskDescriptionWithFileUpload from './components/detalle_tarea'; // Componente de la página de subir tarea
import PasswordRecoveryForm from './components/recuperar_pass'; // Componente para la recuperacion de contraseña
import Breadcrumbs from './components/breadcrums'; // Componente para mostrar los breadcrumbs
import CreateQuestionnaire from './components/CreateQuestionnaire';

const App = () => {
  return (
    <Router>
      <div>
        {/* Header con los Breadcrumbs, ahora fijo en la parte superior */}
        <div className="bg-[#34495E] text-white p-4 fixed top-0 left-0 w-full z-10">
          {/* Aquí van los Breadcrumbs */}
          <Breadcrumbs />
        </div>

        {/* Contenedor para el contenido, con margen superior igual al tamaño del header fijo */}
        <div className="mt-[50px]"> {/* Ajustamos el margen superior aquí para igualar la altura del header */}
          {/* Rutas */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/informacion" element={<InformacionPage />} />
            <Route path="/registro" element={<RegistroPage />} />
            <Route path="/calendario" element={<CalendarPage />} />
            <Route path="/dashboard" element={<DashPage />} />
            <Route path="/mensajes" element={<Messages />} />
            <Route path="/notificaciones" element={<Notifications />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/clases" element={<Classroom />} />
            <Route path="/clases/:classId/tareas/crear" element={<Tasks />} />
            <Route path="/clases/:classId/tareas" element={<Tasks_alum />} />
            <Route path="/tareas/:taskId" element={<TaskDescriptionWithFileUpload />} />
            <Route path="/crear-cuestionario" element={<CreateQuestionnaire />} />
            <Route path="/recuperarpassword" element={<PasswordRecoveryForm />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
