const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const pool = require("../db"); // Usamos el pool en lugar de connection

// Middleware para parsear JSON
router.use(bodyParser.json());

// Función para guardar o actualizar los detalles en la base de datos
async function guardarDetalles(
  reference,
  nombre,
  descripcion,
  monto,
  fechaAdeudo,
  id_alumno
) {
  // Primero intentamos actualizar el registro
  const updateQuery =
    "UPDATE adeudos SET referencia = ?, Nombre = ?, Descripcion = ?, monto = ?, Fecha_Adeudo = ? WHERE id_alumno = ? AND Descripcion = ?";

  try {
    const [results] = await pool
      .promise()
      .query(updateQuery, [
        reference,
        nombre,
        descripcion,
        monto,
        fechaAdeudo,
        id_alumno,
        descripcion,
      ]);

    if (results.affectedRows > 0) {
      console.log(
        `Detalles del pago actualizados para matrícula: ${id_alumno}, Descripción: ${descripcion}`
      );
    } else {
      // Si no se actualizó nada, insertamos un nuevo registro
      const insertQuery =
        "INSERT INTO adeudos (referencia, Nombre, Descripcion, monto, Fecha_Adeudo, id_alumno) VALUES (?, ?, ?, ?, ?, ?)";
      await pool
        .promise()
        .query(insertQuery, [
          reference,
          nombre,
          descripcion,
          monto,
          fechaAdeudo,
          id_alumno,
        ]);
      console.log(
        `Detalles del pago guardados: Referencia: ${reference}, Nombre: ${nombre}, Descripción: ${descripcion}, Monto: ${monto}, Fecha: ${fechaAdeudo}`
      );
    }
  } catch (err) {
    console.error("Error al guardar los detalles del pago:", err);
  }
}

// Función para extraer el nombre del `order_id`
function extraerNombre(orderId) {
  const partes = orderId.split("_");
  if (partes.length >= 2) {
    return partes[1]; // Tomamos la parte después del primer guión bajo como nombre
  }
  return ""; // Si no tiene el formato esperado, devolvemos un string vacío
}

// Endpoint para recibir notificaciones de OpenPay
router.post("/webhook/openpay", async (req, res) => {
  console.log(
    "Cuerpo de la solicitud recibida:",
    JSON.stringify(req.body, null, 2)
  );

  const eventType = req.body.type;

  if (eventType === "verification") {
    console.log("Evento de verificación recibido:", req.body.verification_code);
    res.status(200).send("Verificación completada");
  } else if (eventType === "charge.created") {
    const paymentData = req.body.transaction;

    if (paymentData) {
      const orderId = paymentData.order_id;
      const description = paymentData.description || "";
      const amount = paymentData.amount || 0;
      const fechaAdeudo = paymentData.creation_date || "";

      let reference = "";
      let nombre = "";

      // Verificamos el tipo de método de pago y extraemos la referencia
      if (paymentData.payment_method.type === "store") {
        reference = paymentData.payment_method.reference;
      } else if (paymentData.payment_method.type === "bank_transfer") {
        reference = paymentData.payment_method.name;
      }

      if (orderId) {
        nombre = extraerNombre(orderId);
        const id_alumno = orderId.split("_")[3];
        console.log(
          `Buscando adeudo con matrícula: ${id_alumno} y descripción: ${description}`
        );

        // Consulta para buscar en la tabla adeudos
        const query =
          "SELECT * FROM adeudos WHERE id_alumno = ? AND Descripcion = ?";
        try {
          const [results] = await pool
            .promise()
            .query(query, [id_alumno, description]);

          if (results.length > 0) {
            await guardarDetalles(
              reference,
              nombre,
              description,
              amount,
              fechaAdeudo,
              id_alumno
            );
            res.status(200).send("Webhook procesado y datos guardados");
          } else {
            console.log("No se encontró coincidencia en la tabla adeudos");
            res.status(400).send("No se encontró el adeudo correspondiente");
          }
        } catch (err) {
          console.error("Error al buscar en la tabla adeudos:", err);
          return res.status(500).send("Error interno al buscar en adeudos");
        }
      } else {
        console.log("Referencia o nombre no encontrados en los datos del pago");
        res.status(400).send("Datos incompletos");
      }
    } else {
      console.log("Datos no recibidos correctamente");
      res.status(400).send("Datos no recibidos");
    }
  } else if (eventType === "charge.succeeded") {
    const paymentData = req.body.transaction;

    if (paymentData) {
      const orderId = paymentData.order_id;
      const description = paymentData.description || "";
      const id_alumno = orderId.split("_")[3];

      // Actualizar la tabla adeudos para marcar como pagado y agregar la fecha de pago
      const currentDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " "); // Fecha actual en formato SQL
      const updateQuery =
        "UPDATE adeudos SET Pagado = 1, Fecha_Pago = ? WHERE id_alumno = ? AND Descripcion = ?";

      try {
        await pool
          .promise()
          .query(updateQuery, [currentDate, id_alumno, description]);
        console.log(
          `Adeudo actualizado a pagado para matrícula: ${id_alumno}, Descripción: ${description}, Fecha de pago: ${currentDate}`
        );
      } catch (updateErr) {
        console.error("Error al actualizar el estado de pago:", updateErr);
      }
    }

    if (paymentData && paymentData.method === "card") {
      const orderId = paymentData.order_id;
      const description = paymentData.description || "";
      const id_alumno = orderId.split("_")[3];

      // Si es pago con tarjeta y el pago se completó, eliminamos el registro en adeudos
      const deleteQuery =
        "DELETE FROM adeudos WHERE id_alumno = ? AND Descripcion = ?";
      try {
        await pool.promise().query(deleteQuery, [id_alumno, description]);
        console.log(
          `Adeudo eliminado para matrícula: ${id_alumno}, Descripción: ${description}`
        );
        res.status(200).send("Adeudo eliminado para pago con tarjeta exitoso");
      } catch (deleteErr) {
        console.error("Error al eliminar el adeudo:", deleteErr);
        return res.status(500).send("Error al eliminar el adeudo");
      }
    } else {
      res.status(200).send("Pago procesado sin eliminar adeudo");
    }
  } else if (eventType === "charge.failed" || eventType === "spei.received") {
    // Otros casos de eventos
    res.status(200).send("Evento procesado");
  } else {
    console.log("Evento no manejado:", eventType);
    res.status(400).send("Evento no manejado");
  }
});

module.exports = router;
