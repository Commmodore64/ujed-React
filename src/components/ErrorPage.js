// ErrorPage.js
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Puedes reutilizar el arreglo JSON con todos los errores o crearlo acá mismo.
// (Lo ideal es tenerlo en un archivo aparte e importarlo)
export const errorList = [
  {
    error_code: 1000,
    message:
      "Ha ocurrido un error interno en el servidor de Openpay. Por favor, contacta a soporte.",
  },
  {
    error_code: 1001,
    message:
      "La solicitud es inválida o no está en formato JSON. Verifica los campos requeridos.",
  },
  {
    error_code: 1002,
    message:
      "La llamada no está autenticada o la autenticación es incorrecta. Verifica tus credenciales.",
  },
  {
    error_code: 1003,
    message:
      "No se pudo completar la operación porque uno o más parámetros son inválidos.",
  },
  {
    error_code: 1004,
    message:
      "Un servicio necesario para procesar la transacción no está disponible. Intenta más tarde.",
  },
  {
    error_code: 1005,
    message: "El recurso solicitado no existe.",
  },
  {
    error_code: 1006,
    message: "Ya existe una transacción con el mismo ID de orden.",
  },
  {
    error_code: 1007,
    message: "La transferencia fue rechazada por el procesador.",
  },
  {
    error_code: 1008,
    message: "La cuenta requerida está inactiva.",
  },
  {
    error_code: 1009,
    message: "El cuerpo de la solicitud excede el tamaño permitido.",
  },
  {
    error_code: 1010,
    message:
      "Se utilizó la llave pública donde se requiere la llave privada. Ajusta la configuración.",
  },
  {
    error_code: 1011,
    message: "El recurso solicitado fue eliminado.",
  },
  {
    error_code: 1012,
    message: "El monto excede el límite de transacción permitido.",
  },
  {
    error_code: 1013,
    message: "La operación no está permitida para este recurso.",
  },
  {
    error_code: 1014,
    message: "La cuenta está inactiva. Contacta a soporte.",
  },
  {
    error_code: 1015,
    message: "No se recibió respuesta del servicio. Intenta más tarde.",
  },
  {
    error_code: 1016,
    message: "El correo del comercio ya fue registrado.",
  },
  {
    error_code: 1017,
    message:
      "El gateway no está disponible en este momento. Intenta más tarde.",
  },
  {
    error_code: 1018,
    message: "Se ha superado el número máximo de intentos de cargo.",
  },
  {
    error_code: 1020,
    message: "La cantidad de decimales es inválida para esta moneda.",
  },
  {
    error_code: 1023,
    message:
      "Has agotado las transacciones de tu paquete. Contacta a soporte para contratar otro.",
  },
  {
    error_code: 1024,
    message: "El monto de la transacción excede el límite permitido por TPV.",
  },
  {
    error_code: 1025,
    message: "Se han bloqueado las transacciones CoDi de tu plan.",
  },
  {
    error_code: 2001,
    message: "Ya existe una cuenta de banco con esta CLABE.",
  },
  {
    error_code: 2003,
    message: "Ya existe un cliente con ese identificador externo.",
  },
  {
    error_code: 2004,
    message: "El número de tarjeta es inválido.",
  },
  {
    error_code: 2005,
    message: "La tarjeta está vencida (la fecha de expiración ya pasó).",
  },
  {
    error_code: 2006,
    message: "No se proporcionó el código de seguridad (CVV2).",
  },
  {
    error_code: 2007,
    message: "Esta tarjeta de prueba solo puede usarse en Sandbox.",
  },
  {
    error_code: 2008,
    message: "La tarjeta no es válida para pago con puntos.",
  },
  {
    error_code: 2009,
    message: "El código de seguridad (CVV2) es inválido.",
  },
  {
    error_code: 2010,
    message: "Falló la autenticación 3D Secure.",
  },
  {
    error_code: 2011,
    message: "Tipo de tarjeta no soportado.",
  },
  {
    error_code: 3001,
    message: "La tarjeta fue rechazada por el banco.",
  },
  {
    error_code: 3002,
    message: "La tarjeta está vencida.",
  },
  {
    error_code: 3003,
    message: "Fondos insuficientes en la tarjeta.",
  },
  {
    error_code: 3004,
    message: "La tarjeta fue reportada como robada.",
  },
  {
    error_code: 3005,
    message: "La tarjeta fue rechazada por sospecha de fraude (lista negra).",
  },
  {
    error_code: 3006,
    message: "No se permite esta operación para este cliente o transacción.",
  },
  {
    error_code: 3009,
    message: "La tarjeta fue reportada como perdida.",
  },
  {
    error_code: 3010,
    message: "La tarjeta está restringida por el banco.",
  },
  {
    error_code: 3011,
    message: "El banco ha pedido retener la tarjeta. Contacta al banco.",
  },
  {
    error_code: 3012,
    message:
      "Se requiere autorización previa del banco para realizar este pago.",
  },
  {
    error_code: 3201,
    message:
      "Este comercio no está autorizado para pagos a meses sin intereses.",
  },
  {
    error_code: 3203,
    message: "La promoción no aplica para este tipo de tarjeta.",
  },
  {
    error_code: 3204,
    message: "El monto es menor al mínimo requerido para la promoción.",
  },
  {
    error_code: 3205,
    message: "La promoción no está permitida.",
  },
  {
    error_code: 4001,
    message: "No hay fondos suficientes en la cuenta de Openpay.",
  },
  {
    error_code: 4002,
    message: "Paga las comisiones pendientes antes de continuar.",
  },
  {
    error_code: 6001,
    message: "Este webhook ya fue procesado.",
  },
  {
    error_code: 6002,
    message: "No se pudo conectar con el servicio de webhook. Verifica la URL.",
  },
  {
    error_code: 6003,
    message: "El servicio reporta errores, intenta más tarde.",
  },
];

function ErrorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Obtener el parámetro "error_code" de la URL
  const errorCode = searchParams.get("error_code");
  const numericErrorCode = errorCode ? parseInt(errorCode, 10) : null;

  // Buscar el error en tu lista de errores
  const errorData = errorList.find(
    (err) => err.error_code === numericErrorCode
  );

  // Mensaje a mostrar (si no se encuentra el código, mostrar uno genérico)
  const errorMessage = errorData
    ? errorData.message
    : "Ha ocurrido un error desconocido. Por favor, contacta a soporte.";

  // Acción para el botón que lleva a la raíz del proyecto
  const handleBack = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#E74C3C" }}>Oops, ocurrió un error</h1>

      {/* Ícono (puede ser un emoji o cualquier otro elemento gráfico) */}
      <div style={{ fontSize: "48px", color: "#E74C3C", margin: "20px 0" }}>
        ❌
      </div>

      <p style={{ color: "#333", margin: "10px 0", fontSize: "18px" }}>
        <strong>Código de error: {errorCode || "N/A"}</strong>
      </p>

      <p style={{ color: "#555", margin: "10px 0", fontSize: "16px" }}>
        {errorMessage}
      </p>

      {/* Botón para volver a la raíz del proyecto */}
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#3498DB",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onClick={handleBack}
      >
        Regresar al inicio
      </button>
    </div>
  );
}

export default ErrorPage;
