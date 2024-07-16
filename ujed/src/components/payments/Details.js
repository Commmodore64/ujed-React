import React from "react";

const Details = () => {
  const matricula = localStorage.getItem("matricula");
  const nombreCompleto = localStorage.getItem("nombreCompleto");
  const telefono = localStorage.getItem("telefono");
  const fechaNacimiento = localStorage.getItem("fechaNacimiento");
  const comentarios = localStorage.getItem("comentarios");
  const cursoSeleccionado = localStorage.getItem("cursoSeleccionado");
  const costoSeleccionado = localStorage.getItem("costoSeleccionado");
  return (
    <div className="flex flex-col mt-5 lg:mt-0 gap-4 p-3 lg:p-8 bg-gray-200 rounded-xl text-black lg:ml-20">
      <p className="text-lg font-bold">Detalles:</p>
      <ul>
        <li className="mb-2">
          <span className="font-semibold">Matrícula:</span> <br /> {matricula ||  "No disponible"}
        </li>
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
          {comentarios ||  "No disponible"}
        </li>
        <li className="mb-2">
          <span className="font-semibold">Curso Seleccionado:</span> <br />{" "}
          {cursoSeleccionado ||  "No disponible"}
        </li>
        <li className="mb-2">
          <span className="font-semibold">Costo del curso:</span> <br />{" "}
          ${costoSeleccionado ||  "No disponible"}
        </li>
      </ul>
    </div>
  );
};

export default Details;
