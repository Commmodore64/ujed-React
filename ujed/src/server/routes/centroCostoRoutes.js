const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos pool en lugar de connection

// Obtener un centro de costo por ID
router.get("/centroCosto/:id", async (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM centrocosto WHERE id = ?";

  try {
    // No es necesario usar .promise(), ya que mysql2 lo maneja automáticamente
    const [results] = await pool.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Centro de Costo no encontrado" });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener el centro de costo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener todos los centros de costo
router.get("/centroCosto", async (req, res) => {
  const query = "SELECT * FROM centrocosto";

  try {
    // Tampoco es necesario usar .promise() aquí
    const [results] = await pool.query(query);

    res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener los centros de costo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
