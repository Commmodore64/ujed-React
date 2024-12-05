import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Index";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const CourseInfo = () => {
  const [cursos, setCursos] = useState([]);
  const [ultimaFechaActualizacion, setUltimaFechaActualizacion] = useState("");

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch(
          "https://ujed.solmoviles.com.mx/api/cursos",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCursos(data);
          if (data.length > 0) {
            // Encontrar la fecha más reciente
            const fechas = data.map((data) => new Date(data.date));
            const ultimaFecha = new Date(Math.max(...fechas));
            setUltimaFechaActualizacion(ultimaFecha.toLocaleDateString());
          }
        } else {
          console.error("Error al obtener los cursos:", response.statusText);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchCursos();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="flex flex-col mt-16 lg:mt-20 h-auto m-4 lg:m-8 rounded-xl p-5 text-black lg:mx-20 lg:ml-96 ">
        <div className="flex flex-row items-center mb-5 hover:text-slate-700">
          <Link to={"/dashboard"} className="text-lg">
            <IoIosArrowBack className="inline-block " />
          </Link>
          <h1 className="text-2xl font-bold pl-1">Inicio</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto lg:p-2">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="rounded-lg border shadow-md bg-gray-50 text-gray-800 flex flex-col justify-between"
            >
              <div className="flex flex-col justify-between p-6 h-full">
                <div>
                  <h3 className="break-words tracking-tight text-2xl font-bold mb-4">
                    {curso.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Descripción: {curso.info}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Vigencia: {curso.vigencia.split("T")[0]}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Cupo: {curso.cupo}
                  </p>
                </div>
              </div>
              <hr className="border-gray-200 w-full" />
              <div className="flex items-center p-5 bg-[#f8f8f8]">
                <div className="text-4xl font-bold text-gray-800">
                  ${curso.costo}
                </div>
                <div className="text-sm text-gray-500 ml-2">por curso</div>
                <Link
                  to="/payments"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full"
                >
                  Inscribirse
                </Link>
              </div>
            </div>
          ))}
        </div>
        {ultimaFechaActualizacion && (
          <p className="text-xs mt-5 text-gray-500">
            Última actualización: {ultimaFechaActualizacion || "No disponible"}
          </p>
        )}
      </div>
    </>
  );
};

export default CourseInfo;
