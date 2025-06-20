import React from "react";

const Details = () => {
  const matricula = localStorage.getItem("matricula");
  const nombreCompleto = localStorage.getItem("nombreCompleto");
  const telefono = localStorage.getItem("telefono");
  const fechaNacimiento = localStorage.getItem("fechaNacimiento");
  const comentarios = localStorage.getItem("comentarios");
  const cursoSeleccionado = localStorage.getItem("cursoSeleccionado");
  const costoSeleccionado = localStorage.getItem("costoSeleccionado");
  const rfc = localStorage.getItem("rfc");
  const curp = localStorage.getItem("curp");
  return (
    <div className="flex flex-col mt-5 lg:mt-0 gap-4 p-3 lg:p-8 bg-gray-200 rounded-xl text-black">
      <p className="text-lg font-bold">Detalles:</p>
      <ul>
        {matricula && (
          <li className="mb-2">
            <span className="font-semibold">Matrícula:</span> <br /> {matricula ||  "No disponible"}
          </li>
        )}
        {curp && (
          <li className="mb-2">
            <span className="font-semibold">CURP:</span> <br /> {curp ||  "No disponible"}
          </li>
        )}
        {rfc && (
          <li className="mb-2">
            <span className="font-semibold">RFC:</span> <br /> {rfc ||  "No disponible"}
          </li>
        )}
        <li className="mb-2">
          <span className="font-semibold">Nombre Completo:</span> <br />{" "}
          {nombreCompleto ||  "No disponible"}
        </li>
        <li className="mb-2">
          <span className="font-semibold">Teléfono:</span> <br /> {telefono ||  "No disponible"}
        </li>
        <li className="mb-2">
          <span className="font-semibold">Fecha de Nacimiento:</span> <br />{" "}
          {fechaNacimiento ||  "No disponible"}
        </li>
        <li className="mb-2">
          <span className="font-semibold">Comentarios:</span> <br />{" "}
          {comentarios ||  "Sin comentarios"}
        </li>
        <li className="mb-2">
          <span className="font-semibold">Curso Seleccionado:</span> <br />{" "}
          {cursoSeleccionado.split("/")[0] ||  "No disponible"}
        </li>
        <li className="mb-2">
          <span className="font-semibold">Costo del curso:</span> <br />{" "}
          ${costoSeleccionado ||  "No disponible"}
        </li>
      </ul>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
        Pagar
      </button>
    </div>
  );
};

export default Details;
