import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import Sidebar from "../sidebar/Index";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import logo from "../../img/logo-banner-red.png";
import Markdown from "react-markdown";

const Index = () => {
  const { user, isAuthenticated } = useAuth0();
  const [, setMatricula] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [, setTelefono] = useState("");
  const [, setFechaNacimiento] = useState("");
  const [cursos, setCursos] = useState([]);
  const [ultimaFechaActualizacion, setUltimaFechaActualizacion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const openModal = async (title, contentUrl) => {
    let content = "";
    if (contentUrl) {
      try {
        const response = await fetch(contentUrl);
        if (response.ok) {
          content = await response.text();
        } else {
          console.error(
            "Error al cargar el archivo:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    }
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const renderMarkdown = (markdownText) => {
    return <Markdown>{markdownText}</Markdown>;
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const obtenerDatosAlumno = async () => {
      try {
        const response = await fetch(
          `https://ujed.solmoviles.com.mx/api/alumnos/${user.sub}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Incluir aquí el token JWT si es necesario para la autenticación
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setMatricula(data.matricula || "");
            setNombreCompleto(data.nombre_completo || "");
            setTelefono(data.telefono || "");
            setFechaNacimiento(data.fecha_nacimiento.split("T")[0]);
          }
        } else {
          console.error(
            "Error al obtener datos del alumno:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    // Validar si el usuario está autenticado y si el `user.sub` existe
    if (isAuthenticated && user?.sub) {
      obtenerDatosAlumno();
    } else if (!isAuthenticated) {
      console.log("El usuario no está autenticado");
    } else if (!user?.sub) {
      console.log("El usuario autenticado no tiene un 'sub'");
    }
  }, [isAuthenticated, user?.sub]);

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
          //console.log("Cursos obtenidos:", data);
          //console.log(
          //   "Fecha de actualización:",
          //   data.map((data) => data.date)
          // );
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
  //console.log("Ultima fecha de actualización:", ultimaFechaActualizacion);

  return (
    <>
      <Sidebar />
      <div className="flex justify-end mr-5">
        <img src={logo} alt="logo ujed" className="w-24 lg:w-36 mt-4 lg:mt-4" />
      </div>
      <div className="flex flex-col mt-1 lg:mt-8 h-auto m-4 lg:m-8 bg-[#c06870] rounded-xl p-5 text-black lg:mx-20 lg:ml-96">
        {/* Primera fila */}
        <div className="flex flex-col lg:flex-row w-full mt-3 space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col h-auto w-full lg:w-2/3 bg-[#f6f8fe] rounded-xl p-5 text-black shadow-sm font-semibold">
            <h2 className="text-2xl font-bold justify-start">
              Bienvenido {nombreCompleto || ""} !
            </h2>
          </div>
          <div className="flex flex-col h-auto w-full lg:w-1/3 bg-[#f6f8fe] rounded-xl p-5 text-black shadow-sm font-semibold">
            <h1 className="text-2xl font-bold mb-4">Cursos disponibles</h1>
            <div className="grid grid-cols-1 gap-4">
              {cursos.map((curso) => (
                <div key={curso.id} className="">
                  <li className="text-sm text-gray-700">{curso.nombre}</li>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 hover:text-slate-700">
              <Link
                to="/courseinfo"
                className="flex text-gray-900 hover:text-[#B11830] transition duration-300 ease-in-out items-center text-sm m-1 mt-1"
              >
                Más información <IoIosArrowForward className="ml-1 text-sm " />
              </Link>
              {ultimaFechaActualizacion && (
                <p className="text-xs mt-3 text-gray-500">
                  Última actualización:{" "}
                  {ultimaFechaActualizacion || "No disponible"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Segunda fila */}
        <div className="flex flex-col lg:flex-row w-full mt-10 space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col h-auto w-full lg:w-1/3 bg-[#f6f8fe] rounded-xl p-5 text-black shadow-sm font-semibold">
            <h2 className="text-2xl font-bold">Especialidades</h2>
            <li className="text-sm p-2 text-gray-700 mt-4">
              Especialidad en Enfermería Quirúrgica
            </li>
            <li className="text-sm p-2 text-gray-700">
              Especialidad en Enfermería en Salud Mental y Psiquiatría
            </li>
            <li className="text-sm p-2 text-gray-700">
              Especialidad en Enfermería en Salud Pública
            </li>
            <li className="text-sm p-2 text-gray-700">
              Especialidad en Enfermería Infantil
            </li>
            <li className="text-sm p-2 text-gray-700">
              Especialidad en Enfermería en Medicina Interna y Terapia Intensiva
            </li>
          </div>
          <div className="flex flex-col h-auto w-full lg:w-2/3 bg-[#f6f8fe] rounded-xl p-5 text-black shadow-sm font-semibold">
            <h2 className="text-2xl font-bold justify-start">
              Información general
            </h2>
            <p className="text-md text-gray-800 mt-4 mb-1">Dirección:</p>
            <p className="text-sm text-gray-700 ">
              Prolongación Blvd. Juan Pablo II 512.
              <br /> Col. Masié. C.P. 34217.
              <br />
              Durango, Dgo. México.
            </p>
            <p className="text-md text-gray-800 mt-4 mb-1">
              Datos de contacto:
            </p>
            <p className="text-sm text-gray-700 ">
              Tel. (618) 827 13 70.
              <br />
              <br />
              E-mail: faeoopenpay@gmail.com
            </p>
            <div>
              <div className="flex flex-col lg:flex-row w-full mt-8 space-y-4 lg:space-y-0 lg:space-x-4">
                <button
                  onClick={() => openModal("Términos y Condiciones", "/TyC.md")}
                  className="text-gray-950 hover:text-gray-700 py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Términos y Condiciones
                </button>
                <button
                  onClick={() => openModal("Aviso de Privacidad", "/AdP.md")}
                  className="text-gray-950 hover:text-gray-700 py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Aviso de Privacidad
                </button>
              </div>

              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl h-3/4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">
                      {modalContent.title}
                    </h2>
                    <div className="text-justify">
                      {renderMarkdown(modalContent.content)}
                    </div>
                    <button
                      onClick={closeModal}
                      className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
