const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos pool en lugar de connection

// Obtener todos los pagos
router.get("/pagos", async (req, res) => {
  const query = "SELECT * FROM pagos";

  try {
    // Usamos la promesa del pool directamente
    const [results] = await pool.promise().query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener pagos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener un pago por ID_Pago
router.get("/pagos/:id_pago", async (req, res) => {
  const idPago = req.params.id_pago;
  const query = "SELECT * FROM pagos WHERE ID_Pago = ?";

  try {
    // Usamos la promesa del pool directamente
    const [results] = await pool.promise().query(query, [idPago]);

    // Si no se encuentra un pago con ese ID, devolver un 404
    if (results.length === 0) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error al obtener el pago:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
