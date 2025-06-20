const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos pool en lugar de connection

// Obtener un centro de costo por ID
router.get("/centroCosto/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM centrocosto WHERE id = ?";

  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el centro de costo:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Centro de Costo no encontrado" });
    }

    res.status(200).json(results);
  });
});

// Obtener todos los centros de costo
router.get("/centroCosto", (req, res) => {
  const query = "SELECT * FROM centrocosto";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los centros de costo:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
