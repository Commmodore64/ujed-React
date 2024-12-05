import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Index";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import CurrencyInput from "react-currency-input-field";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Index = () => {
  const Navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showInscripcionesModal, setShowInscripcionesModal] = useState(false);
  const [nombreCurso, setNombreCurso] = useState("");
  const [programas, setProgramas] = useState([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState("");
  const [infoCurso, setInfoCurso] = useState("");
  const [cursoId, setCursoId] = useState(null);
  const [costo, setCosto] = useState("");
  const [vigencia, setVigencia] = useState("");
  const [cupo, setCupo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [inscripciones, setInscripciones] = useState([]);
  const [catalogos, setCatalogos] = useState([]);
  const [catalogoSeleccionado, setCatalogoSeleccionado] = useState("");
  const [centroCostos, setCentroCostos] = useState([]);
  const [centroCostoSeleccionado, setCentroCostoSeleccionado] = useState("");

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
        } else {
          console.error("Error al obtener los cursos:", response.statusText);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    const fetchProgramas = async () => {
      try {
        const response = await fetch(
          "https://ujed.solmoviles.com.mx/api/programa",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProgramas(data);
        } else {
          console.error("Error al obtener los programas:", response.statusText);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    const fetchCatalogo = async () => {
      try {
        const response = await fetch(
          "https://ujed.solmoviles.com.mx/api/catalogo",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCatalogos(data);
        } else {
          console.error("Error al obtener los catalogos:", response.statusText);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    const fetchCentroCosto = async () => {
      try {
        const response = await fetch(
          "https://ujed.solmoviles.com.mx/api/centroCosto",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCentroCostos(data);
        } else {
          console.error(
            "Error al obtener los centros de costos:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchCursos();
    fetchProgramas();
    fetchCatalogo();
    fetchCentroCosto();
  }, []);

  const handleInscripciones = async (id) => {
    try {
      const response = await fetch(
        `https://ujed.solmoviles.com.mx/api/inscripciones/${id}`,
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
    setProgramaSeleccionado("");
    setInfoCurso("");
    setCursoId(null);
    setCosto("");
    setVigencia("");
    setCupo("");
    setCodigo("");
  };

  const formatFecha = (fechaISO) => {
    if (!fechaISO) {
      console.error("Fecha no válida:", fechaISO);
      return ""; // Maneja el caso donde fechaISO sea undefined o null
    }
    const [year, month, day] = fechaISO.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleAgregarCurso = async () => {
    try {
      // Asume que la fecha está en formato ISO (YYYY-MM-DD)
      const fechaISO = vigencia; // Asegúrate de que 'vigencia' ya está en formato YYYY-MM-DD
      const fechaFormateada = formatFecha(fechaISO); // Asegúrate de que la fecha esté en formato adecuado

      const response = await fetch(
        "https://ujed.solmoviles.com.mx/api/cursos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombreCurso,
            programa: programaSeleccionado,
            info: infoCurso,
            costo: costo,
            vigencia: fechaFormateada, // Fecha en formato YYYY-MM-DD
            cupo: cupo,
            codigo: codigo || null,
            catalogo: catalogoSeleccionado,
            centroCosto: centroCostoSeleccionado,
          }),
        }
      );

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
      const response = await fetch(
        `https://ujed.solmoviles.com.mx/api/cursos/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const curso = await response.json();
        setNombreCurso(curso.nombre);
        setProgramaSeleccionado(curso.programa);
        setInfoCurso(curso.info);
        setCosto(curso.costo);
        setCursoId(id);
        setVigencia(curso.vigencia);
        setCupo(curso.cupo);
        setCodigo(curso.codigo);
        setShowModal(true);
        setCatalogoSeleccionado(curso.catalogo);
        setCentroCostoSeleccionado(curso.centroCosto);
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
        `https://ujed.solmoviles.com.mx/api/cursos/${cursoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombreCurso,
            programa: programaSeleccionado,
            info: infoCurso,
            costo: costo,
            vigencia: vigencia,
            cupo: cupo,
            codigo: codigo || null,
            catalogo: catalogoSeleccionado,
            centroCosto: centroCostoSeleccionado,
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
                programa: cursoActualizado.programa,
                info: cursoActualizado.info,
                costo: cursoActualizado.costo,
                vigencia: cursoActualizado.vigencia,
                cupo: cursoActualizado.cupo,
                codigo: cursoActualizado.codigo,
                catalogo: cursoActualizado.catalogo,
              }
            : curso
        );
        setCursos(updatedCursos);
        setShowModal(false);
        limpiarCampos();

        // Recargar la página y luego redirigir
        window.location.reload();
        setTimeout(() => {
          Navigate("/admin");
        }, 500); // Ajusta el tiempo según sea necesario
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
      const response = await fetch(
        `https://ujed.solmoviles.com.mx/api/cursos/${id}`,
        {
          method: "DELETE",
        }
      );

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
          <div className="mb-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-3xl w-full sm:w-auto"
              onClick={() => {
                setShowModal(true);
                limpiarCampos();
              }}
            >
              Agregar Curso
            </button>
            <Link to="/program" className="w-full sm:w-auto">
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-3xl w-full sm:w-auto">
                Programas
              </button>
            </Link>
            <Link to="/history" className="w-full sm:w-auto">
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-3xl w-full sm:w-auto">
                Historial de pagos
              </button>
            </Link>
            <Link to="/catalog" className="w-full sm:w-auto">
              <button className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-3xl w-full sm:w-auto">
                Catálogo de conceptos
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                className="bg-gray-100 p-4 shadow-md rounded-md relative mt-3 lg:mx-20"
              >
                <h2 className="text-lg font-semibold">{curso.nombre}</h2>
                <h3 className="text-sm text-gray-500">{curso.programa}</h3>
                <hr className="my-2" />
                <p className="font-semibold text-gray-600">Descripción:</p>
                <p className="text-gray-700 mt-3">{curso.info}</p>
                <p className="font-semibold text-gray-600 mt-3">Costo:</p>
                <p className="text-gray-700">${curso.costo}</p>
                <p className="text-sm text-gray-500 my-3">
                  Vigencia: {formatDate(curso.vigencia)}
                </p>
                <p className="text-sm text-gray-500 my-3">Cupo: {curso.cupo}</p>
                <p className="text-sm text-gray-500 my-3">
                  Código de acceso: {curso.codigo || "Sin código"}
                </p>
                <p className="text-sm text-gray-500 my-3">
                  Fecha de Actualización: {formatDate(curso.date)}
                </p>
                <p className="text-sm text-gray-500 my-3">
                  Concepto de pago: {curso.catalogo || "Sin concepto"}
                </p>
                <p className="text-sm text-gray-500 my-3">
                  Centro de Costo: {curso.centroCosto || "Sin Centro de Costo"}
                </p>
                <button
                  className="flex bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-3xl"
                  onClick={() => handleInscripciones(curso.id)}
                >
                  Consultar alumnos inscritos
                </button>
                <div className="flex items-center mt-5 lg:absolute lg:top-0 lg:right-0 lg:flex lg:space-x-2 lg:mt-1 lg:mr-2 justify-between">
                  <button
                    className="text-sm text-white bg-blue-500 hover:bg-blue-600 py-2 px-3 rounded-3xl"
                    onClick={() => handleEditarCurso(curso.id)}
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    className="text-xs text-white bg-red-500 hover:bg-red-600 py-2 px-3 rounded-3xl "
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">
              {cursoId ? "Editar Curso" : "Agregar Curso"}
            </h2>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">
                Nombre del Curso
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded"
                value={nombreCurso}
                onChange={(e) => setNombreCurso(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">
                Información del Curso
              </label>
              <textarea
                className="w-full border border-gray-300 p-2 rounded"
                value={infoCurso}
                onChange={(e) => setInfoCurso(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">Programa</label>
              <select
                className="w-full border border-gray-300 p-2 rounded"
                value={programaSeleccionado}
                onChange={(e) => setProgramaSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un programa</option>
                {programas.map((programa) => (
                  <option key={programa.id} value={programa.nombre}>
                    {programa.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">
                Catalogo de conceptos
              </label>
              <select
                className="w-full border border-gray-300 p-2 rounded"
                value={catalogoSeleccionado}
                onChange={(e) => setCatalogoSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un programa</option>
                {catalogos.map((catalogo) => (
                  <option key={catalogo.id} value={catalogo.concepto}>
                    {catalogo.concepto}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">
                Centro de Costo
              </label>
              <select
                className="w-full border border-gray-300 p-2 rounded"
                value={centroCostoSeleccionado}
                onChange={(e) => setCentroCostoSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un centro de costo</option>
                {centroCostos.map((centroCosto) => (
                  <option key={centroCosto.id} value={centroCosto.nombre}>
                    {centroCosto.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">Costo</label>
              <CurrencyInput
                className="w-full border border-gray-300 p-2 rounded"
                value={costo}
                onValueChange={(value) => setCosto(value)}
                prefix="$"
                decimalsLimit={2}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">Vigencia</label>
              <input
                type="date"
                className="w-full border border-gray-300 p-2 rounded"
                value={vigencia}
                onChange={(e) => setVigencia(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">Cupo</label>
              <input
                type="number"
                className="w-full border border-gray-300 p-2 rounded"
                value={cupo}
                onChange={(e) => setCupo(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">
                Código de acceso
              </label>
              <input
                type="text"
                className="w-1/5 border border-gray-300 p-2 rounded"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-2xl mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-2xl"
                onClick={cursoId ? handleActualizarCurso : handleAgregarCurso}
              >
                {cursoId ? "Actualizar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showInscripcionesModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Alumnos Inscritos</h2>
            <ul>
              {showInscripcionesModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">
                      Alumnos Inscritos
                    </h2>
                    <ul>
                      {inscripciones.length > 0 ? (
                        inscripciones.map((inscripcion) => (
                          <li
                            key={inscripcion.id}
                            className="border-b border-gray-200 py-2 flex items-center space-x-4"
                          >
                            <div>
                              <p className="font-semibold">
                                Nombre: {inscripcion.nombre || "No disponible"}
                              </p>
                              <p>
                                Fecha de Inscripción:{" "}
                                {formatDate(inscripcion.fecha_inscripcion)}
                              </p>
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
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-2xl mt-5"
                        onClick={() => setShowInscripcionesModal(false)}
                      >
                        Cerrar
                      </button>
                    </ul>
                  </div>
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
