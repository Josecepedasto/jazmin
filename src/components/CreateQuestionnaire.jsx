// components/CreateQuestionnaire.js
import { useState } from "react";

export default function CreateQuestionnaire({ teacherId, classId }) {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [questionsToShow, setQuestionsToShow] = useState(10);
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { type: "open", text: "", options: [], correctAnswer: "" }]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title || !instructions || !dueDate || questions.length === 0) {
      alert("Por favor completa todos los campos y agrega al menos una pregunta.");
      return;
    }

    try {
      const response = await fetch('/api/questionnaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          instructions,
          dueDate,
          questions,
          questionsToShow: parseInt(questionsToShow, 10),
          teacherId,
          classId,
        }),
      });

      if (response.ok) {
        const textResponse = await response.text(); // Verificar si esta vacia
        let responseData = null;

        // Si la respuesta no está vacía, intentamos analizarla como JSON
      if (textResponse) {
        responseData = JSON.parse(textResponse);
      }

      // Si la respuesta es válida y contiene datos, procesamos el JSON
      if (responseData && responseData.success) {
        alert("✅ Cuestionario guardado correctamente");
        setTitle("");
        setInstructions("");
        setDueDate("");
        setQuestions([]);
        setQuestionsToShow(10);
      } else {
        alert("❌ Error al guardar el cuestionario");
      }
    } else {
      // Si la respuesta no es exitosa, tratamos de obtener los datos de error
      const errorData = await response.json();
      console.error("Error:", errorData);
      alert("❌ Error al guardar el cuestionario");
    }
    } catch (error) {
        console.error("Error en la comunicación con el servidor:", error);
        alert("❌ Ocurrió un error al guardar el cuestionario");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Crear Cuestionario</h2>

      <div className="grid gap-4">
        <input
          className="p-2 border rounded w-full"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="p-2 border rounded w-full"
          placeholder="Instrucciones"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
        />
        <input
          className="p-2 border rounded w-full"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <input
          className="p-2 border rounded w-full"
          type="number"
          min="1"
          max={questions.length || 1}
          value={questionsToShow}
          onChange={e => setQuestionsToShow(e.target.value)}
          placeholder="Número de preguntas a mostrar"
        />

        <button
          onClick={addQuestion}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          ➕ Agregar Pregunta
        </button>

        {questions.map((q, i) => (
          <div key={i} className="p-4 border rounded-lg shadow-sm bg-gray-50 mt-4">
            <div className="mb-2 font-medium">Pregunta #{i + 1}</div>
            <select
              className="p-2 border rounded w-full mb-2"
              value={q.type}
              onChange={e => updateQuestion(i, "type", e.target.value)}
            >
              <option value="open">Abierta</option>
              <option value="multiple">Opción Múltiple</option>
              <option value="boolean">Verdadero/Falso</option>
            </select>
            <input
              className="p-2 border rounded w-full mb-2"
              placeholder="Texto de la pregunta"
              value={q.text}
              onChange={e => updateQuestion(i, "text", e.target.value)}
            />
            {q.type === "multiple" && (
              <>
                <input
                  className="p-2 border rounded w-full mb-2"
                  placeholder="Opciones separadas por coma"
                  onChange={e => updateQuestion(i, "options", e.target.value.split(","))}
                />
                <input
                  className="p-2 border rounded w-full mb-2"
                  placeholder="Respuesta correcta"
                  onChange={e => updateQuestion(i, "correctAnswer", e.target.value)}
                />
              </>
            )}
            {q.type === "boolean" && (
              <select
                className="p-2 border rounded w-full"
                onChange={e => updateQuestion(i, "correctAnswer", e.target.value)}
              >
                <option value="">Selecciona la respuesta correcta</option>
                <option value="true">Verdadero</option>
                <option value="false">Falso</option>
              </select>
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl mt-6"
        >
          ✅ Guardar Cuestionario
        </button>
      </div>
    </div>
  );
}
