const express = require("express");
const router = express.Router();
const pool = require("../db"); // Cambia `connection` por `pool`

// Obtener un adeudo por ID
router.get("/adeudos/:id", async (req, res) => {
  const ID_Adeudo = req.params.id;
  const query = "SELECT * FROM adeudos WHERE ID_Adeudo = ?";

  try {
    // Ejecuta la consulta directamente sobre el pool
    const [results] = await pool.promise().query(query, [ID_Adeudo]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Adeudo no encontrado" });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener el adeudo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener todos los adeudos
router.get("/adeudos", async (req, res) => {
  const query = "SELECT * FROM adeudos";

  try {
    // Ejecuta la consulta directamente sobre el pool
    const [results] = await pool.promise().query(query);

    res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener los adeudos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
