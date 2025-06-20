import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Index";
import { Link } from "react-router-dom";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const DiversePayments = () => {
  const { isAuthenticated } = useAuth0();
  const [programas, setProgramas] = useState([]);
  const [concepto, setConcepto] = useState("");
  const [precio, setPrecio] = useState("");
  const [programaId, setProgramaId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const response = await fetch(
          "https://ujed.solmoviles.com.mx/api/diversePayments",
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
          console.error(
            "Error al obtener los Pagos Diversos:",
            response.statusText
          );
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

  const limpiarCampos = () => {
    setConcepto("");
    setPrecio("");
    setProgramaId(null);
  };

  const handleAgregarPrograma = async () => {
    try {
      const response = await fetch(
        "https://ujed.solmoviles.com.mx/api/diversePayments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            concepto,
            precio: precio, // Asegúrate de que el backend acepte este campo
          }),
        }
      );

      if (response.ok) {
        const nuevoPrograma = await response.json();
        toast.success("Pago Diverso agregado correctamente");
        setProgramas([...programas, nuevoPrograma]);
        setShowModal(false);
        limpiarCampos();
      } else {
        console.error("Error al agregar el Pago Diverso:", response.statusText);
        toast.error("Error al agregar el Pago Diverso");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al agregar el Pago Diverso");
    }
  };

  const handleEditarPrograma = async (id) => {
    try {
      const response = await fetch(
        `https://ujed.solmoviles.com.mx/api/diversePayments/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const programa = await response.json();
        setConcepto(programa.concepto);
        setPrecio(programa.precio);
        setProgramaId(programa.id);
        setShowModal(true);
      } else {
        console.error(
          "Error al obtener el Pago Diverso para editar:",
          response.statusText
        );
        toast.error("Error al obtener el Pago Diverso para editar");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al obtener el Pago Diverso para editar");
    }
  };

  const handleActualizarPrograma = async () => {
    try {
      const response = await fetch(
        `https://ujed.solmoviles.com.mx/api/diversePayments/${programaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            concepto,
            precio: precio,
          }),
        }
      );

      if (response.ok) {
        const programaActualizado = await response.json();
        toast.success("Pago Diverso actualizado correctamente");
        const updatedProgramas = programas.map((programa) =>
          programa.id === programaId
            ? {
                ...programa,
                concepto: programaActualizado.concepto,
                precio: programaActualizado.precio,
              }
            : programa
        );
        setProgramas(updatedProgramas);
        setShowModal(false);
        limpiarCampos();
      } else {
        console.error(
          "Error al actualizar el Pago Diverso:",
          response.statusText
        );
        toast.error("Error al actualizar el Pago Diverso");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al actualizar el Pago Diverso");
    }
  };

  const handleEliminarPrograma = async (id) => {
    try {
      const response = await fetch(
        `https://ujed.solmoviles.com.mx/api/diversePayments/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.info("Pago Diverso eliminado correctamente");
        const filteredProgramas = programas.filter(
          (programa) => programa.id !== id
        );
        setProgramas(filteredProgramas);
      } else {
        console.error(
          "Error al eliminar el Pago Diverso:",
          response.statusText
        );
        toast.error("Error al eliminar el Pago Diverso");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al eliminar el Pago Diverso");
    }
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
            <h1 className="text-2xl font-bold pl-1">
              Consultar pagos diversos
            </h1>
          </div>
          {/* Botón de Agregar Pago Diverso */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-3xl w-full sm:w-auto"
              onClick={() => {
                setShowModal(true);
                limpiarCampos();
              }}
            >
              Agregar Pago Diverso
            </button>
            <Link to="/admin" className="w-full sm:w-auto">
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-3xl w-full sm:w-auto">
                Cursos
              </button>
            </Link>
          </div>

          <h2 className="text-lg text-gray-700 font-semibold mt-3">
            Pagos Diversos Disponibles
          </h2>
          {/* Modal para Agregar/Editar Pago Diverso */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">
                  {programaId
                    ? "Actualizar Pago Diverso"
                    : "Agregar Pago Diverso"}
                </h2>
                <input
                  type="text"
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  placeholder="Concepto del Pago Diverso"
                  className="border p-2 mb-4 w-full"
                />
                <input
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Precio del Pago Diverso"
                  className="border p-2 mb-4 w-full"
                />
                <button
                  className="bg-gray-500 hover text-white rounded-2xl px-4 py-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 rounded-2xl px-4 py-2 ml-2"
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

          {/* Lista de Pagos Diversos */}
          <ul className="mt-8 mx-4 sm:mx-24">
            {programas.map((programa) => (
              <li
                key={programa.id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 border-b"
              >
                <span className="font-semibold text-center sm:text-left w-full sm:w-auto">
                  {programa.concepto} - ${programa.precio}
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

export default DiversePayments;
