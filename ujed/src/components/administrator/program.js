import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Index";
import { Link } from "react-router-dom";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const Program = () => {
  const { isAuthenticated } = useAuth0();
  const [programas, setProgramas] = useState([]);
  const [nombrePrograma, setNombrePrograma] = useState("");
  const [programaId, setProgramaId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchProgramas();
  }, []);
  if (!isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleAgregarPrograma = async () => {
    try {
      const response = await fetch(
        "https://ujed.solmoviles.com.mx/api/programa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombrePrograma,
          }),
        }
      );

      if (response.ok) {
        const nuevoPrograma = await response.json();
        toast.success("Programa agregado correctamente");
        setProgramas([...programas, nuevoPrograma]);
        setShowModal(false);
        limpiarCampos();
      } else {
        console.error("Error al agregar el programa:", response.statusText);
        toast.error("Error al agregar el programa");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al agregar el programa");
    }
  };

  const handleEditarPrograma = async (id) => {
    try {
      const response = await fetch(
        `https://ujed.solmoviles.com.mx/api/programa/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const programa = await response.json();
        setNombrePrograma(programa.nombre);
        setProgramaId(programa.id);
        setShowModal(true);
      } else {
        console.error(
          "Error al obtener el programa para editar:",
          response.statusText
        );
        toast.error("Error al obtener el programa para editar");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al obtener el programa para editar");
    }
  };

  const handleActualizarPrograma = async () => {
    try {
      const response = await fetch(
        `https://ujed.solmoviles.com.mx/api/programa/${programaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombrePrograma,
          }),
        }
      );

      if (response.ok) {
        const programaActualizado = await response.json();
        toast.success("Programa actualizado correctamente");
        const updatedProgramas = programas.map((programa) =>
          programa.id === programaId
            ? {
                ...programa,
                nombre: programaActualizado.nombre,
              }
            : programa
        );
        setProgramas(updatedProgramas);
        setShowModal(false);
        limpiarCampos();
      } else {
        console.error("Error al actualizar el programa:", response.statusText);
        toast.error("Error al actualizar el programa");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al actualizar el programa");
    }
  };

  const handleEliminarPrograma = async (id) => {
    try {
      const response = await fetch(
        `https://ujed.solmoviles.com.mx/api/programa/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.info("Programa eliminado correctamente");
        const filteredProgramas = programas.filter(
          (programa) => programa.id !== id
        );
        setProgramas(filteredProgramas);
      } else {
        console.error("Error al eliminar el programa:", response.statusText);
        toast.error("Error al eliminar el programa");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al eliminar el programa");
    }
  };

  const limpiarCampos = () => {
    setNombrePrograma("");
    setProgramaId(null);
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col mt-16 lg:mt-20 h-auto m-8 rounded-xl p-5 text-black lg:mx-20 lg:ml-96">
        <div className="container mx-auto">
          <div className="flex flex-row items-center mb-5 hover:text-slate-700">
            <Link to={"/admin"} className="text-lg">
              <IoIosArrowBack className="inline-block" />
            </Link>
            <h1 className="text-2xl font-bold pl-1">Consultar programas</h1>
          </div>
          {/* Botón de Agregar Programa */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-3xl w-full sm:w-auto"
              onClick={() => {
                setShowModal(true);
                limpiarCampos();
              }}
            >
              Agregar Programa
            </button>
            <Link to="/admin" className="w-full sm:w-auto">
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-3xl w-full sm:w-auto">
                Cursos
              </button>
            </Link>
          </div>

          <h2 className="text-lg text-gray-700 font-semibold mt-3">
            Programas Disponibles
          </h2>
          {/* Modal de Agregar/Editar Programa */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">
                  {programaId ? "Actualizar Programa" : "Agregar Programa"}
                </h2>
                <input
                  type="text"
                  value={nombrePrograma}
                  onChange={(e) => setNombrePrograma(e.target.value)}
                  placeholder="Nombre del Programa"
                  className="border p-2 mb-4 w-full"
                />
                <button
                  className="bg-gray-500 hover text-white rounded-2xl px-4 py-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className=" text-white bg-blue-500 hover:bg-blue-600 rounded-2xl px-4 py-2 ml-2"
                  onClick={
                    programaId
                      ? handleActualizarPrograma
                      : handleAgregarPrograma
                  }
                >
                  {programaId ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </div>
          )}

          {/* Lista de Programas */}
          <ul className="mt-8 mx-4 sm:mx-24">
            {programas.map((programa) => (
              <li
                key={programa.id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 border-b"
              >
                <span className="font-semibold text-center sm:text-left w-full sm:w-auto">
                  {programa.nombre}
                </span>
                <div className="flex mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    className="text-sm text-white bg-blue-500 hover:bg-blue-600 mr-3 py-2 px-3 rounded-2xl"
                    onClick={() => handleEditarPrograma(programa.id)}
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-3 rounded-2xl"
                    onClick={() => handleEliminarPrograma(programa.id)}
                  >
                    <MdDeleteForever size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Program;
