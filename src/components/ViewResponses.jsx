// components/ViewResponses.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewResponses({ questionnaireId }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get(`/api/questionnaires/${questionnaireId}/responses`).then(res => {
      setStudents(res.data);
    })
    .catch(error => console.error("Error al obtener respuestas:", error));
  }, [questionnaireId]);

  return (
    <div>
      <h2>Alumnos que han contestado</h2>
      <ul>
        {students.map(s => (
          <li key={s.id}>{s.email}</li>
        ))}
      </ul>
    </div>
  );
}
