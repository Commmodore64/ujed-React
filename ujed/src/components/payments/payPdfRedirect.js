import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "react-use";

const DownloadPDF = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const name = query.get("name");
  const holderName = query.get("holderName");
  const amount = query.get("amount");
  const date = query.get("date");
  const accountNumber = query.get("accountNumber");
  const method = query.get("method");
  const description = query.get("description");
  const courseId = query.get("courseId");
  const comentarios = localStorage.getItem("comentarios");
  const order_id = query.get("order_id");
  console.log("Comentarios: ", comentarios);
  console.log(courseId);

  useEffect(() => {
    // Hacer la solicitud al backend para generar y descargar el PDF
    fetch("https://ujed.solmoviles.com.mx/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        holderName,
        amount,
        date,
        accountNumber,
        method,
        description, // Modifica la descripción
        courseId, // Asegúrate de incluir el id del curso en el cuerpo
        comentarios,
        order_id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        const now = new Date();
        const date = now.toLocaleDateString().replace(/\//g, "/");
        link.setAttribute("download", `recibo_pago_${date}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        // Redirigir después de la descarga
        window.location.href = "https://ujed.solmoviles.com.mx/";
      })
      .catch((error) => console.error("Error al generar el PDF:", error));
  }, [
    name,
    holderName,
    amount,
    date,
    accountNumber,
    method,
    description,
    courseId,
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Generando tu recibo...
        </h1>
        <p className="text-gray-600">Tu descarga comenzará en breve.</p>
        <svg
          className="flex items-center justify-centeranimate-spin h-10 w-10 text-blue-500 mt-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
          />
        </svg>
      </div>
    </div>
  );
};

export default DownloadPDF;
