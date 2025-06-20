import Sidebar from "../sidebar/Index";
import React, { useState } from "react";
import GenerarPDF from "./pdfGenerator"; // Asegúrate de importar el componente

const Index = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    consultationDate: "",
    paymentAmount: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isFormComplete = () => {
    return (
      formData.patientName.trim() !== "" &&
      formData.consultationDate.trim() !== "" &&
      formData.paymentAmount.trim() !== ""
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormComplete()) {
      // Aquí llamas a GenerarPDF para descargar el archivo
      <GenerarPDF formData={formData} />;
    }
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col mt-16 lg:mt-20 h-auto m-4 lg:m-8 rounded-xl p-5 text-black lg:mx-20 lg:ml-96">
        <div>
          <h1 className="text-2xl font-bold">Generar Ticket de Consulta</h1>
          <p className="mt-2 text-md text-gray-600">
            Completa la información necesaria para generar un ticket de consulta
            médica.
          </p>
          <div className="container mx-auto p-4 mt-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Datos del Paciente */}
              <div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del Paciente
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required 
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
              {/* Información de la Consulta */}
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha y Hora de la Consulta
                </label>
                <input
                  type="datetime-local"
                  name="consultationDate"
                  value={formData.consultationDate}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto
                </label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  placeholder="$"
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 block w-1/12 border-gray-300 rounded-md shadow-sm"
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                className={`mt-6 px-4 py-2 font-semibold rounded-2xl shadow-sm ${
                  isFormComplete()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
                disabled={!isFormComplete()}
              >
                {isFormComplete() && <GenerarPDF formData={formData} /> || "Generar Ticket PDF"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
