const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos el pool en lugar de la conexión directa

// Crear un nuevo programa
router.post("/programa", (req, res) => {
  const { nombre } = req.body;

  const query = "INSERT INTO programa (nombre) VALUES (?)";
  pool.query(query, [nombre], (err, results) => {
    if (err) {
      console.error("Error al crear el programa:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    res.status(201).json({ id: results.insertId, nombre });
    console.log("Programa creado correctamente, datos:", {
      id: results.insertId,
      nombre,
    });
  });
});

// Obtener todos los programas
router.get("/programa", (req, res) => {
  const query = "SELECT * FROM programa";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener programas:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    res.status(200).json(results);
  });
});

// Obtener un programa por ID
router.get("/programa/:id", (req, res) => {
  const programaId = req.params.id;
  const query = "SELECT * FROM programa WHERE id = ?";

  pool.query(query, [programaId], (err, results) => {
    if (err) {
      console.error("Error al obtener el programa:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: "Programa no encontrado" });
    }
  });
});

// Actualizar un programa por ID
router.put("/programa/:id", (req, res) => {
  const programaId = req.params.id;
  const { nombre } = req.body;

  console.log("Datos recibidos:", { nombre });

  const query = "UPDATE programa SET nombre = ? WHERE id = ?";
  pool.query(query, [nombre, programaId], (err, results) => {
    if (err) {
      console.error("Error al actualizar el programa:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Programa no encontrado" });
    }

    res.status(200).json({ id: programaId, nombre });
    console.log("Programa actualizado correctamente, datos:", {
      id: programaId,
      nombre,
    });
  });
});

// Eliminar un programa por ID
router.delete("/programa/:id", (req, res) => {
  const programaId = req.params.id;
  const query = "DELETE FROM programa WHERE id = ?";

  pool.query(query, [programaId], (err, results) => {
    if (err) {
      console.error("Error al eliminar el programa:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Programa no encontrado" });
    }

    res.status(204).send();
    console.log("Programa eliminado correctamente, ID:", programaId);
  });
});

module.exports = router;
