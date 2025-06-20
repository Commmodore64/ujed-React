import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import MaskedInput from "react-text-mask";
import Sidebar from "./sidebar/Index";

const Profile = () => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [matricula, setMatricula] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [roles, setRoles] = useState([]);

  // Hook para obtener datos del alumno
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
            setMatricula(cleanString(data.matricula));
            setNombreCompleto(cleanString(data.nombre_completo));
            setTelefono(cleanString(data.telefono));
            setFechaNacimiento(data.fecha_nacimiento.split("T")[0]);
            setOriginalData({
              matricula: cleanString(data.matricula),
              nombreCompleto: cleanString(data.nombre_completo),
              telefono: cleanString(data.telefono),
              fechaNacimiento: data.fecha_nacimiento.split("T")[0],
            });
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

    if (isAuthenticated) {
      obtenerDatosAlumno();
    }
  }, [isAuthenticated, user]);

  // Hook para verificar cambios
  useEffect(() => {
    const hasChanged =
      cleanString(matricula) !== originalData.matricula ||
      cleanString(nombreCompleto) !== originalData.nombreCompleto ||
      cleanString(telefono) !== originalData.telefono ||
      fechaNacimiento !== originalData.fechaNacimiento;
    setIsChanged(hasChanged);
  }, [matricula, nombreCompleto, telefono, fechaNacimiento, originalData]);

  // Hook para obtener roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const tokenClaims = await getIdTokenClaims();
        const roles = tokenClaims["https://roles.com/roles"];
        setRoles(roles || []);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    if (isAuthenticated) {
      fetchRoles();
    }
  }, [isAuthenticated, getIdTokenClaims]);

  // Función para limpiar cadenas
  const cleanString = (value) => {
    if (typeof value !== "string") return "";
    const trimmedValue = value.trim();
    return trimmedValue === "" ? "" : trimmedValue;
  };

  // Función para enviar datos
  const enviarDatos = async () => {
    if (
      !cleanString(matricula) ||
      !cleanString(nombreCompleto) ||
      !cleanString(telefono) ||
      !fechaNacimiento
    ) {
      toast.error("Por favor completa todos los campos antes de guardar.");
      return;
    }

    try {
      const response = await fetch(
        "https://ujed.solmoviles.com.mx/api/userdata",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            id: user.sub,
            matricula: cleanString(matricula),
            nombre_completo: cleanString(nombreCompleto),
            telefono: cleanString(telefono),
            fecha_nacimiento: fechaNacimiento,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.info(result.message);
        setOriginalData({
          matricula: cleanString(matricula),
          nombreCompleto: cleanString(nombreCompleto),
          telefono: cleanString(telefono),
          fechaNacimiento: fechaNacimiento,
        });
        setIsChanged(false);
        console.log("Datos del alumno enviados correctamente");
      } else {
        console.error("Error al enviar datos del alumno");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al enviar datos del alumno");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  const phoneMask = [
    /[1-9]/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  return (
    <>
      <Sidebar />
      <div className="flex flex-col mt-16 lg:mt-20 h-auto m-8 rounded-xl p-5 text-black lg:mx-20 lg:ml-96">
        <h1 className="text-2xl font-bold mb-3">Perfil de Usuario</h1>
        {roles.includes("admin") && (
          <div className="flex flex-col">
            <p className="text-gray-700 mb-2">Rol de Usuario</p>
            <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-black flex items-center mb-5 w-32">
              <p className="font-semibold">Administrador</p>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row">
          <img
            className="rounded-full w-32 h-32 mr-4 mb-4 lg:mb-0"
            src={user.picture}
            alt={user.name}
          />
          <div className="flex flex-col lg:mr-4 mb-4 lg:mb-0">
            <p className="text-gray-700 mb-2">Correo Electrónico</p>
            <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-black flex items-center">
              <p className="">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-700 mb-2">Nombre de usuario</p>
            <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-black flex items-center">
              <p className="">{user.nickname}</p>
            </div>
          </div>
        </div>

        <hr className="mt-10 border-gray-400 w-full" />

        <h2 className="text-xl font-semibold mt-10 mb-4">
          Datos del Administrador
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <p className="text-gray-700 mb-2">Número de Identificación</p>
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="p-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-gray-400 focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-gray-700 mb-2">Número de Teléfono</p>
            <MaskedInput
              mask={phoneMask}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="p-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-gray-400 focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-gray-700 mb-2">Nombre Completo</p>
            <input
              type="text"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              className="p-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-gray-400 focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-gray-700 mb-2">Fecha de Nacimiento</p>
            <div className="p-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-gray-400 focus:border-gray-400 flex items-center">
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className="bg-transparent text-black"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-1 lg:justify-start">
          <button
            className={`bg-gray-900 hover:bg-[#B11830] transition duration-300 ease-in-out text-white font-bold py-2 px-4 rounded-lg mt-4 ${
              !isChanged && "opacity-50 cursor-not-allowed"
            }`}
            onClick={enviarDatos}
            disabled={!isChanged}
          >
            Guardar Cambios
          </button>
        </div>

        <hr className="mt-5 border-gray-400 w-full" />
        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default Profile;
