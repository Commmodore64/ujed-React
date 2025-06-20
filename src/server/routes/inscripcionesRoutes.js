const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos pool en lugar de connection

// Crear una nueva inscripción
router.post("/inscripciones", (req, res) => {
  const fecha = new Date();
  const { id_curso, nombre } = req.body;
  const query =
    "INSERT INTO inscripciones (id_curso, nombre, fecha_inscripcion) VALUES (?, ?, ?)";

  let connection;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener la conexión:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    connection.query(query, [id_curso, nombre, fecha], (err, results) => {
      if (err) {
        console.error("Error al inscribir el usuario:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      res.status(201).json({ id: results.insertId, id_curso, nombre });
      console.log("Usuario inscrito correctamente, datos: ", {
        id: results.insertId,
        id_curso,
        nombre,
      });
    });

    connection.release();
  });
});

// Obtener inscripciones por curso ID
router.get("/inscripciones/:id", (req, res) => {
  const cursoId = req.params.id;
  const query = "SELECT * FROM inscripciones WHERE id_curso = ?";

  let connection;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener la conexión:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    connection.query(query, [cursoId], (err, results) => {
      if (err) {
        console.error("Error al obtener las inscripciones:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      res.status(200).json(results);
    });

    connection.release();
  });
});

// Obtener todas las inscripciones
router.get("/inscripciones", (req, res) => {
  const query = "SELECT * FROM inscripciones";

  let connection;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error al obtener la conexión:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener las inscripciones:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      res.status(200).json(results);
    });

    connection.release();
  });
});

module.exports = router;
