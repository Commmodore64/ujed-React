const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos pool en lugar de connection

// Ruta para obtener todos los pagos no conciliados
router.get("/pagosnoconciliados", (req, res) => {
  const query =
    "SELECT Fecha_Pago, Referencia, Cargo, is_deleted, deleted_comment FROM pagosnoconciliados";

  let connection;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener la conexión:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener los pagos no conciliados" });
    }

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener pagos no conciliados:", err);
        return res
          .status(500)
          .json({ error: "Error al obtener los pagos no conciliados" });
      }

      res.status(200).json(results);
    });

    connection.release();
  });
});

// Ruta para actualizar datos de pagos no conciliados
router.post("/actualizarpago", (req, res) => {
  const { Pagado, referencia, Fecha_Pago } = req.body;
  console.log("Datos actualizar pago: ", req.body);
  const query =
    "UPDATE adeudos SET Pagado = ?, Fecha_Pago = ? WHERE referencia = ?";

  let connection;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener la conexión:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    connection.query(query, [Pagado, Fecha_Pago, referencia], (err) => {
      if (err) {
        console.error("Error al actualizar el pago no conciliado:", err);
        return res
          .status(500)
          .json({ error: "Error al actualizar el pago no conciliado" });
      }

      res
        .status(200)
        .json({ message: "Pago no conciliado actualizado correctamente" });
    });

    connection.release();
  });
});

// Ruta para eliminar un pago no conciliado
router.post("/eliminarpago/:referencia", (req, res) => {
  const { referencia } = req.params;
  const { comentario } = req.body;
  const query =
    "UPDATE pagosnoconciliados SET is_deleted = TRUE, deleted_comment = ? WHERE Referencia = ?";

  let connection;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener la conexión:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    connection.query(query, [comentario, referencia], (err) => {
      if (err) {
        console.error(
          "Error al eliminar el soft delete del pago no conciliado:",
          err
        );
        return res
          .status(500)
          .json({ error: "Error al eliminar el pago no conciliado" });
      }

      res
        .status(200)
        .json({ message: "Pago no conciliado eliminado correctamente" });
    });

    connection.release();
  });
});

module.exports = router;
