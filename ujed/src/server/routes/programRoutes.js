const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos el pool en lugar de la conexión directa

// Crear un nuevo programa
router.post("/programa", (req, res) => {
  const { nombre } = req.body;

  const query = "INSERT INTO programa (nombre) VALUES (?)";
  pool
    .query(query, [nombre]) // Usamos pool.query sin promesas
    .then(([results]) => {
      res.status(201).json({ id: results.insertId, nombre });
      console.log("Programa creado correctamente, datos: ", {
        id: results.insertId,
        nombre,
      });
    })
    .catch((err) => {
      console.error("Error al crear el programa:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    });
});

// Endpoint para obtener todos los programas
router.get("/programa", (req, res) => {
  pool
    .query("SELECT * FROM programa") // Usamos pool.query sin promesas
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      console.error("Error al obtener programa:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    });
});

// Obtener un programa por ID
router.get("/programa/:id", (req, res) => {
  const programaId = req.params.id;
  const query = "SELECT * FROM programa WHERE id = ?";
  pool
    .query(query, [programaId]) // Usamos pool.query sin promesas
    .then(([results]) => {
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ error: "Programa no encontrado" });
      }
    })
    .catch((err) => {
      console.error("Error al obtener el programa:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    });
});

// Actualizar un programa por ID
router.put("/programa/:id", (req, res) => {
  const programaId = req.params.id;
  const { nombre } = req.body;

  console.log("Datos recibidos:", { nombre });

  const query = "UPDATE programa SET nombre = ? WHERE id = ?";
  pool
    .query(query, [nombre, programaId]) // Usamos pool.query sin promesas
    .then(() => {
      res.status(200).json({ id: programaId, nombre });
    })
    .catch((err) => {
      console.error("Error al actualizar el programa:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    });
});

// Eliminar un programa por ID
router.delete("/programa/:id", (req, res) => {
  const programaId = req.params.id;
  const query = "DELETE FROM programa WHERE id = ?";
  pool
    .query(query, [programaId]) // Usamos pool.query sin promesas
    .then(() => {
      res.status(204).json({ message: "Programa eliminado" });
    })
    .catch((err) => {
      console.error("Error al eliminar el programa:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    });
});

module.exports = router;
