import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Index";
import { useNavigate } from "react-router-dom";
import MaskedInput from "react-text-mask";
import { toast } from "sonner";

const Index = () => {
  const Swal = require("sweetalert2");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [matricula, setMatricula] = useState(
    localStorage.getItem("matricula") || ""
  );
  const [nombreCompleto, setNombreCompleto] = useState(
    localStorage.getItem("nombreCompleto") || ""
  );
  const [telefono, setTelefono] = useState(
    localStorage.getItem("telefono") || ""
  );
  const [fechaNacimiento, setFechaNacimiento] = useState(
    localStorage.getItem("fechaNacimiento") || ""
  );
  const [comentarios, setComentarios] = useState(
    localStorage.getItem("comentarios") || ""
  );
  const [cursoSeleccionado, setCursoSeleccionado] = useState(
    localStorage.getItem("cursoSeleccionado") || ""
  );
  const [costoSeleccionado, setCostoSeleccionado] = useState(
    localStorage.getItem("costoSeleccionado") || ""
  );
  const [vigencia, setVigencia] = useState("");
  const [cupo, setCupo] = useState("");
  const [useAltID, setUseAltID] = useState(false);
  const [rfc, setRFC] = useState(localStorage.getItem("rfc") || "");
  const [curp, setCURP] = useState(localStorage.getItem("curp") || "");
  const [codigoAcceso, setCodigoAcceso] = useState(""); // Inicializa con cadena vacía
  const [codigoValido, setCodigoValido] = useState(null);
  const [catalogo, setCatalogo] = useState("");

  const navigate = useNavigate();

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

    fetchCursos();
  }, []);

  useEffect(() => {
    localStorage.setItem("matricula", matricula);
    localStorage.setItem("nombreCompleto", nombreCompleto);
    localStorage.setItem("telefono", telefono);
    localStorage.setItem("fechaNacimiento", fechaNacimiento);
    localStorage.setItem("comentarios", comentarios);
    localStorage.setItem("cursoSeleccionado", cursoSeleccionado);
    localStorage.setItem("costoSeleccionado", costoSeleccionado);
    localStorage.setItem("rfc", rfc);
    localStorage.setItem("curp", curp);
  }, [
    matricula,
    nombreCompleto,
    telefono,
    fechaNacimiento,
    comentarios,
    cursoSeleccionado,
    costoSeleccionado,
    rfc,
    curp,
  ]);

  useEffect(() => {
    if (cursoSeleccionado) {
      const selectedCurso = cursos.find(
        (curso) => curso.nombre === cursoSeleccionado.split("/")[0]
      );
      if (selectedCurso) {
        setVigencia(selectedCurso.vigencia);
        setCupo(selectedCurso.cupo);
        setCatalogo(selectedCurso.catalogo);

        if (selectedCurso.codigo) {
          setCodigoValido(false); // Reinicia la validez del código
        } else {
          setCodigoAcceso(""); // Limpia el código si no es necesario
          setCodigoValido(true); // No se necesita código, automáticamente válido
        }
      }
    }
  }, [cursoSeleccionado, cursos]);
  useEffect(() => {
    if (mostrarCampoCodigo() && codigoAcceso !== "") {
      validarCodigoAcceso();
    } else {
      setCodigoValido(mostrarCampoCodigo() ? false : true); // Si no hay campo de código, el código es válido
    }
  }, [codigoAcceso, cursoSeleccionado]);

  const handlePagoEnEfectivo = async (e) => {
    e.preventDefault();

    if (
      (!matricula && !rfc && !curp) ||
      !nombreCompleto ||
      !telefono ||
      !fechaNacimiento ||
      !cursoSeleccionado
    ) {
      toast.error("Por favor, complete todos los campos obligatorios.");
    } else if (useAltID && !rfc && !curp) {
      toast.error("Por favor, proporcione RFC o CURP.");
    } else {
      // Identificar cuál de los tres datos tiene información
      const identificador = matricula || rfc || curp;
      console.log("Identificador:", identificador);

      // Crear el objeto con la información que deseas enviar
      const pagoEfectivoData = {
        curso: cursoSeleccionado.split("/")[0], // Extrae la parte del curso
        costo: costoSeleccionado, // Costo del curso
        catalogo, // Información del catálogo
        nombreCompleto, // Nombre del alumno
        telefono, // Número de teléfono
        comentarios: localStorage.getItem("comentarios") || "",
        identificador, // Identificador (matricula, rfc o curp)
      };

      try {
        // Hacer la petición POST a la API
        const response = await fetch(
          "https://ujed.solmoviles.com.mx/api/generate-pdf-efectivo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pagoEfectivoData),
          }
        );

        if (response.ok) {
          const pdfBlob = await response.blob(); // Recibir el PDF como blob
          const url = window.URL.createObjectURL(pdfBlob); // Crear URL temporal para descargar
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "recibo_pago_efectivo.pdf"); // Nombre del archivo a descargar
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // Eliminar el enlace una vez descargado
          toast.success("PDF generado con éxito.");
          Swal.fire({
            title: "Recuerda introducir la referencia de manera correcta !",
            icon: "warning",
            text: "Cuando realices el pago en efectivo, asegúrate de introducir la referencia correctamente para evitar problemas con tu pago.",
          });
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Error al generar el PDF.");
        }
      } catch (error) {
        console.error("Error al realizar el pago en efectivo:", error);
        toast.error("Ocurrió un error al generar el PDF.");
      }
    }
  };

  const handlePagoEnLineaConTarjeta = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    if (
      (!matricula && !rfc && !curp) ||
      !nombreCompleto ||
      !telefono ||
      !fechaNacimiento ||
      !cursoSeleccionado
    ) {
      toast.error("Por favor, complete todos los campos obligatorios.");
      return;
    } else if (useAltID && !rfc && !curp) {
      toast.error("Por favor, proporcione RFC o CURP.");
      return;
    }

    setIsProcessing(true); // Deshabilita el botón

    try {
      const response = await fetch(
        "https://ujed.solmoviles.com.mx/api/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            curso: cursoSeleccionado.split("/")[0],
            amount: costoSeleccionado,
            currency: "MXN",
            newDescription: catalogo,
            order_id:
              "order_" +
              nombreCompleto +
              "_" +
              new Date()
                .toLocaleString()
                .replace(/[/\\:*?"<>|,\s]/g, "")
                .replace(/(a\.m\.|p\.m\.)/g, "") +
              "_" +
              (matricula || curp || rfc),
            send_email: false,
            customer: {
              name: nombreCompleto,
              phone_number: telefono,
              email: "email@email.com",
            },
            redirect_url:
              "https://ujed.solmoviles.com.mx/api/verify-transaction",
            comentarios: localStorage.getItem("comentarios") || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.statusText);
      }

      const data = await response.json();

      if (data.checkout_link) {
        window.location.href = data.checkout_link; // Redirige al usuario
      } else {
        toast.error("No se recibió el enlace de pago.");
        setIsProcessing(false); // Reactiva el botón si no hay enlace
      }
    } catch (error) {
      console.error("Error al crear la sesión de pago:", error);
      toast.error(
        "Ocurrió un error al procesar el pago, revisa tu información."
      );
      setIsProcessing(false); // Reactiva el botón si hay un error
    }
  };

  const handleLimpiarCampos = () => {
    setMatricula("");
    setNombreCompleto("");
    setTelefono("");
    setFechaNacimiento("");
    setComentarios("");
    setCursoSeleccionado("");
    setCostoSeleccionado("");
    setRFC("");
    setCURP("");
    setCodigoAcceso("");
    setCursoSeleccionado("");
    setCodigoValido(null);
    setUseAltID(false);
    toast.success("Campos limpiados.");
  };

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

  const isCursoDisponible = () => {
    const hoy = new Date();
    const vigenciaDate = new Date(vigencia);
    return cupo > 0 && hoy <= vigenciaDate;
  };

  const validarCodigoAcceso = async () => {
    try {
      // Encontrar el ID del curso seleccionado
      const selectedCurso = cursos.find(
        (curso) => curso.nombre + "/" + curso.costo === cursoSeleccionado
      );

      if (!selectedCurso || !mostrarCampoCodigo()) {
        setCodigoValido(true); // Si el curso no requiere código, el código es automáticamente válido
        return;
      }

      const response = await fetch(
        "https://ujed.solmoviles.com.mx/api/validar-codigo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            codigo: codigoAcceso,
            id: selectedCurso.id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCodigoValido(data.valido);
      } else {
        setCodigoValido(false);
      }
    } catch (error) {
      console.error("Error en la validación del código:", error);
      setCodigoValido(false);
    }
  };
  const esFormularioValido = () => {
    const camposRequeridosCompletos =
      (!matricula && !rfc && !curp) ||
      (nombreCompleto && telefono && fechaNacimiento && cursoSeleccionado);

    const codigoEsValido = codigoValido || !mostrarCampoCodigo();

    return camposRequeridosCompletos && codigoEsValido && isCursoDisponible();
  };

  const mostrarCampoCodigo = () => {
    // Verifica si el curso seleccionado tiene un código asociado
    const selectedCurso = cursos.find(
      (curso) => curso.nombre === cursoSeleccionado.split("/")[0]
    );
    return selectedCurso && selectedCurso.codigo;
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col mt-16 lg:mt-20 h-auto m-4 lg:m-8 rounded-xl p-5 text-black lg:mx-20 lg:ml-96">
        <div>
          <h1 className="text-2xl font-bold">Inscripción</h1>
          <form className="mt-4">
            <div className="mb-4">
              <label
                htmlFor="nombreCompleto"
                className="block text-md font-medium text-gray-700"
              >
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
            {!useAltID ? (
              <div className="mb-4">
                <label
                  htmlFor="matricula"
                  className="block text-md font-medium text-gray-700"
                >
                  Matrícula
                </label>
                <input
                  type="text"
                  id="matricula"
                  name="matricula"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                />
                <p className="mt-2 text-sm text-gray-600">
                  No cuentas con matrícula?{" "}
                  <button
                    type="button"
                    className="text-blue-500 underline"
                    onClick={() => {
                      setUseAltID(true);
                      localStorage.removeItem("matricula");
                      setMatricula("");
                    }}
                  >
                    Haz clic aquí
                  </button>
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="rfc"
                    className="block text-md font-medium text-gray-700"
                  >
                    RFC
                  </label>
                  <input
                    type="text"
                    id="rfc"
                    name="rfc"
                    value={rfc}
                    onChange={(e) => setRFC(e.target.value)}
                    className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="curp"
                    className="block text-md font-medium text-gray-700"
                  >
                    CURP
                  </label>
                  <input
                    type="text"
                    id="curp"
                    name="curp"
                    value={curp}
                    onChange={(e) => setCURP(e.target.value)}
                    className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Tienes una matrícula?{" "}
                  <button
                    type="button"
                    className="text-blue-500 underline"
                    onClick={() => {
                      setUseAltID(false);
                      localStorage.removeItem("rfc");
                      localStorage.removeItem("curp");
                      setRFC("");
                      setCURP("");
                    }}
                  >
                    Haz clic aquí
                  </button>
                </p>
              </>
            )}
            <div className="mb-4">
              <label
                htmlFor="telefono"
                className="block text-md font-medium text-gray-700"
              >
                Teléfono
              </label>
              <MaskedInput
                mask={phoneMask}
                guide={false}
                required={true}
                type="text"
                id="telefono"
                name="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="fechaNacimiento"
                className="block text-md font-medium text-gray-700"
              >
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="cursoSeleccionado"
                className="block text-md font-medium text-gray-700"
              >
                Curso Seleccionado
              </label>
              <select
                name="cursoSeleccionado"
                id="cursoSeleccionado"
                value={cursoSeleccionado}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setCursoSeleccionado(selectedValue);

                  const selectedCurso = cursos.find(
                    (curso) =>
                      curso.nombre + "/" + curso.costo === selectedValue
                  );

                  if (selectedCurso) {
                    setCostoSeleccionado(selectedCurso.costo);
                  } else {
                    setCostoSeleccionado("");
                  }

                  setCodigoAcceso(""); // Limpiar el campo de código de acceso cuando se cambia el curso
                }}
                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400"
              >
                <option value="">Selecciona un curso</option>
                {cursos.map((curso) => (
                  <option
                    key={curso.id}
                    value={curso.nombre + "/" + curso.costo}
                  >
                    {curso.nombre} - ${curso.costo}
                  </option>
                ))}
              </select>
              {cursoSeleccionado && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    Vigencia: {new Date(vigencia).toLocaleDateString("es-ES")}
                  </p>
                  <p>Cupo: {cupo}</p>
                </div>
              )}
            </div>

            <div>
              {mostrarCampoCodigo() && (
                <div className="mb-4">
                  <label
                    htmlFor="codigoAcceso"
                    className="block text-md font-medium text-gray-700"
                  >
                    Código de Acceso
                  </label>
                  <input
                    type="text"
                    id="codigoAcceso"
                    name="codigoAcceso"
                    value={codigoAcceso}
                    onChange={(e) => setCodigoAcceso(e.target.value)}
                    onBlur={validarCodigoAcceso} // Valida el código cuando se pierde el foco
                    className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                  />
                  {codigoValido === false && (
                    <p className="text-red-500">Código de acceso inválido</p>
                  )}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="comentarios"
                className="block text-md font-medium text-gray-700"
              >
                Comentarios
              </label>
              <textarea
                name="comentarios"
                id="comentarios"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                rows="4"
                className="mt-1 px-4 py-2 w-full bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className={`text-white px-2 lg:px-4 mx-2 py-2 rounded-md ${
                  codigoValido
                    ? isCursoDisponible()
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={handlePagoEnEfectivo}
                disabled={!codigoValido || !isCursoDisponible()}
              >
                Pago en efectivo
              </button>
              <button
                type="submit"
                onClick={handlePagoEnLineaConTarjeta}
                disabled={isProcessing || !esFormularioValido()} // Deshabilita si está procesando o el formulario no es válido
                className={`mt-6 px-4 py-2 w-full ${
                  esFormularioValido() ? "bg-blue-500" : "bg-gray-300"
                } text-white rounded-md`}
              >
                {isProcessing ? "Procesando..." : "Pago en línea"}
              </button>

              <button
                type="button"
                className="px-2 mt-2 lg:px-4 mx-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleLimpiarCampos}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Index;
