const express = require("express");
const router = express.Router();
const pool = require("../db"); // Cambia `connection` por `pool`

// Obtener un adeudo por ID
router.get("/adeudos/:id", (req, res) => {
  const ID_Adeudo = req.params.id;
  const query = "SELECT * FROM adeudos WHERE ID_Adeudo = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener la conexión:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    connection.query(query, [ID_Adeudo], (err, results) => {
      if (err) {
        console.error("Error al obtener el adeudo:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Adeudo no encontrado" });
      }

      res.status(200).json(results);
    });

    connection.release();
  });
});

// Obtener todos los adeudos
router.get("/adeudos", (req, res) => {
  const query = "SELECT * FROM adeudos";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener la conexión:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener los adeudos:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      res.status(200).json(results);
    });

    connection.release();
  });
});

module.exports = router;
