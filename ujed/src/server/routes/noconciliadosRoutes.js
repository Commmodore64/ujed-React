const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos pool en lugar de connection

// Ruta para obtener todos los pagos no conciliados
router.get("/pagosnoconciliados", async (req, res) => {
  const query =
    "SELECT Fecha_Pago, Referencia, Cargo, is_deleted, deleted_comment FROM pagosnoconciliados";

  let connection;

  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener pagos no conciliados:", err);
    res
      .status(500)
      .json({ error: "Error al obtener los pagos no conciliados" });
  } finally {
    if (connection) connection.release();
  }
});

// Ruta para actualizar datos de pagos no conciliados
router.post("/actualizarpago", async (req, res) => {
  const { Pagado, referencia, Fecha_Pago } = req.body;
  console.log("Datos actualizar pago: ", req.body);
  const query =
    "UPDATE adeudos SET Pagado = ?, Fecha_Pago = ? WHERE referencia = ?";

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.query(query, [Pagado, Fecha_Pago, referencia]);
    res
      .status(200)
      .json({ message: "Pago no conciliado actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar el pago no conciliado:", err);
    res
      .status(500)
      .json({ error: "Error al actualizar el pago no conciliado" });
  } finally {
    if (connection) connection.release();
  }
});

// Ruta para eliminar un pago no conciliado
router.post("/eliminarpago/:referencia", async (req, res) => {
  const { referencia } = req.params;
  const { comentario } = req.body;
  const query =
    "UPDATE pagosnoconciliados SET is_deleted = TRUE, deleted_comment = ? WHERE Referencia = ?";

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.query(query, [comentario, referencia]);
    res
      .status(200)
      .json({ message: "Pago no conciliado eliminado correctamente" });
  } catch (err) {
    console.error(
      "Error al eliminar el soft delete del pago no conciliado:",
      err
    );
    res.status(500).json({ error: "Error al eliminar el pago no conciliado" });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
