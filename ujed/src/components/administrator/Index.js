import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Index";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import CurrencyInput from "react-currency-input-field";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Index = () => {
  const { isAuthenticated } = useAuth0();
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showInscripcionesModal, setShowInscripcionesModal] = useState(false);
  const [nombreCurso, setNombreCurso] = useState("");
  const [infoCurso, setInfoCurso] = useState("");
  const [cursoId, setCursoId] = useState(null);
  const [costo, setCosto] = useState("");
  const [vigencia, setVigencia] = useState("");
  const [cupo, setCupo] = useState("");
  const [inscripciones, setInscripciones] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cursos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCursos(data);
        } else {
          console.error("Error al obtener los cursos:", response.statusText);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchCursos();
  }, []);

  const handleInscripciones = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/inscripciones/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setInscripciones(data);
        setShowInscripcionesModal(true);
      } else {
        console.error(
          "Error al obtener las inscripciones:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const limpiarCampos = () => {
    setNombreCurso("");
    setInfoCurso("");
    setCursoId(null);
  };

  const handleAgregarCurso = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombreCurso,
          info: infoCurso,
          costo: costo,
          vigencia: vigencia,
          cupo: cupo,
        }),
      });

      if (response.ok) {
        const nuevoCurso = await response.json();
        toast.success("Curso agregado correctamente");
        setCursos([...cursos, nuevoCurso]);
        setShowModal(false);
        limpiarCampos();
      } else {
        console.error("Error al agregar el curso:", response.statusText);
        toast.error("Error al agregar el curso");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al agregar el curso");
    }
  };

  const handleEditarCurso = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cursos/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const curso = await response.json();
        setNombreCurso(curso.nombre);
        setInfoCurso(curso.info);
        setCosto(curso.costo);
        setCursoId(id);
        setVigencia(curso.vigencia);
        setCupo(curso.cupo);
        setShowModal(true);
      } else {
        console.error(
          "Error al obtener el curso para editar:",
          response.statusText
        );
        toast.error("Error al obtener el curso para editar");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al obtener el curso para editar");
    }
  };

  const handleActualizarCurso = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cursos/${cursoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombreCurso,
            info: infoCurso,
            costo: costo,
            vigencia: vigencia,
            cupo: cupo,
          }),
        }
      );

      if (response.ok) {
        const cursoActualizado = await response.json();
        toast.success("Curso actualizado correctamente");
        const updatedCursos = cursos.map((curso) =>
          curso.id === cursoId
            ? {
                ...curso,
                nombre: cursoActualizado.nombre,
                info: cursoActualizado.info,
                costo: cursoActualizado.costo,
                vigencia: cursoActualizado.vigencia,
                cupo: cursoActualizado.cupo,
              }
            : curso
        );
        setCursos(updatedCursos);
        setShowModal(false);
        limpiarCampos();
      } else {
        console.error("Error al actualizar el curso:", response.statusText);
        toast.error("Error al actualizar el curso");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al actualizar el curso");
    }
  };

  const handleEliminarCurso = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cursos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.info("Curso eliminado correctamente");
        const filteredCursos = cursos.filter((curso) => curso.id !== id);
        setCursos(filteredCursos);
      } else {
        console.error("Error al eliminar el curso:", response.statusText);
        toast.error("Error al eliminar el curso");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al eliminar el curso");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col mt-16 lg:mt-20 h-auto m-8 rounded-xl p-5 text-black lg:mx-20 lg:ml-96 ">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Consultar Cursos</h1>
          <div className="mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              onClick={() => {
                setShowModal(true);
                limpiarCampos();
              }}
            >
              Agregar Curso
            </button>
          </div>
          <h2 className="text-lg text-gray-700 font-semibold">
            Cursos Disponibles
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                className="bg-gray-50 p-4 shadow-md rounded-md relative mt-3 lg:mx-20"
              >
                <h2 className="text-lg font-semibold">{curso.nombre}</h2>
                <hr className="my-2" />
                <p className="font-semibold text-gray-600">Descripción:</p>
                <p className="text-gray-700 mt-3">{curso.info}</p>
                <p className="font-semibold text-gray-600 mt-3">Costo:</p>
                <p className="text-gray-700">${curso.costo}</p>
                <p className="text-sm text-gray-500 my-3">
                  Vigencia: {formatDate(curso.vigencia)}
                </p>
                <p className="text-sm text-gray-500 my-3">
                  Cupo: {curso.cupo}
                </p>
                <p className="text-sm text-gray-500 my-3">
                  Fecha de Actualización: {formatDate(curso.date)}
                </p>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                  onClick={() => handleInscripciones(curso.id)}
                >
                  Consultar alumnos inscritos
                </button>
                <div className="lg:absolute lg:top-0 lg:right-0 lg:flex lg:space-x-2 lg:mt-1 lg:mr-2 flex items-center space-x-2">
                  <button
                    className="text-sm text-white bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded"
                    onClick={() => handleEditarCurso(curso.id)}
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    className="text-xs text-white bg-red-500 hover:bg-red-600 py-1 px-2 rounded "
                    onClick={() => handleEliminarCurso(curso.id)}
                  >
                    <MdDeleteForever size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg">
            <h2
              className="text-xl font-semibold mb-4
"
            >
              {cursoId ? "Editar Curso" : "Agregar Curso"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                cursoId ? handleActualizarCurso() : handleAgregarCurso();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Nombre del Curso
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nombreCurso}
                  onChange={(e) => setNombreCurso(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="info"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Información del Curso
                </label>
                <textarea
                  id="info"
                  value={infoCurso}
                  onChange={(e) => setInfoCurso(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="costo"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Costo
                </label>
                <CurrencyInput
                  id="costo"
                  value={costo}
                  onValueChange={(value) => setCosto(value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  prefix="$"
                  decimalsLimit={2}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="vigencia"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Vigencia
                </label>
                <input
                  type="date"
                  id="vigencia"
                  value={vigencia}
                  onChange={(e) => setVigencia(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="cupo"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Cupo
                </label>
                <input
                  type="number"
                  id="cupo"
                  value={cupo}
                  onChange={(e) => setCupo(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover
text-white py-2 px-4 rounded-md mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  {cursoId ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showInscripcionesModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Alumnos Inscritos</h2>
            <ul>
              {inscripciones.length > 0 ? (
                inscripciones.map((inscripcion) => (
                  <li
                    key={inscripcion.id}
                    className="border-b border-gray-200 py-2 flex items-center space-x-4"
                  >
                    <div>
                      <p className="font-semibold">Nombre: {inscripcion.nombre}</p>
                      <p>Fecha de Inscripción: {formatDate(inscripcion.fecha_inscripcion)}</p>
                      <p className="font-semibold">Estado de pago:</p>
                      <p
                        className={`font-semibold flex items-center space-x-2 ${
                          inscripcion.estado_pago === "Autorizado"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {inscripcion.estado_pago === "Autorizado" ? (
                          <>
                            <FaCheckCircle />
                            <span>{inscripcion.estado_pago}</span>
                          </>
                        ) : (
                          <>
                            <FaTimesCircle />
                            <span>{inscripcion.estado_pago}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No hay inscripciones.</p>
              )}
            </ul>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md mt-5"
              onClick={() => setShowInscripcionesModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
