// components/TakeQuestionnaire.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function TakeQuestionnaire({ questionnaireId, studentId }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    axios.get(`/api/questionnaires/${questionnaireId}/random-questions/${studentId}`).then(res => {
      setQuestions(res.data);
    })
    .catch(error => console.error("Error al obtener preguntas:", error));
  }, [questionnaireId]);

  const handleAnswer = (qid, value) => setAnswers(prev => ({ ...prev, [qid]: value }));

  const handleSubmit = () => {
    const data = questions.map(q => ({
      questionId: q.id,
      answer: answers[q.id] || "",
    }));
    axios.post(`/api/questionnaires/${questionnaireId}/submit`, {
      studentId,
      answers: data,
    }).then(() => alert("Respuestas enviadas"))
    .catch(error => console.error("Error al enviar respuestas:", error));
  };

  return (
    <div>
      <h2>Responder Cuestionario</h2>
      {questions.map(q => (
        <div key={q.id}>
          <p>{q.text}</p>
          {q.type === "open" && <input onChange={e => handleAnswer(q.id, e.target.value)} />}
          {q.type === "multiple" && q.options.map(opt => (
            <label key={opt}><input type="radio" name={`q${q.id}`} value={opt} onChange={e => handleAnswer(q.id, e.target.value)} /> {opt}</label>
          ))}
          {q.type === "boolean" && (
            <>
              <label><input type="radio" name={`q${q.id}`} value="true" onChange={e => handleAnswer(q.id, e.target.value)} /> Verdadero</label>
              <label><input type="radio" name={`q${q.id}`} value="false" onChange={e => handleAnswer(q.id, e.target.value)} /> Falso</label>
            </>
          )}
        </div>
      ))}
      <button onClick={handleSubmit}>Enviar Respuestas</button>
    </div>
  );
}
