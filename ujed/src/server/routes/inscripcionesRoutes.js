const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos pool en lugar de connection

// Crear una nueva inscripción
router.post("/inscripciones", async (req, res) => {
  const fecha = new Date();
  const { id_curso, nombre } = req.body;
  const query =
    "INSERT INTO inscripciones (id_curso, nombre, fecha_inscripcion) VALUES (?, ?, ?)";

  let connection;

  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(query, [id_curso, nombre, fecha]);
    res.status(201).json({ id: results.insertId, id_curso, nombre });
    console.log("Usuario inscrito correctamente, datos: ", {
      id: results.insertId,
      id_curso,
      nombre,
    });
  } catch (err) {
    console.error("Error al inscribir el usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (connection) connection.release();
  }
});

// Obtener inscripciones por curso ID
router.get("/inscripciones/:id", async (req, res) => {
  const cursoId = req.params.id;
  const query = "SELECT * FROM inscripciones WHERE id_curso = ?";

  let connection;

  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(query, [cursoId]);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener las inscripciones:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (connection) connection.release();
  }
});

// Obtener todas las inscripciones
router.get("/inscripciones", async (req, res) => {
  const query = "SELECT * FROM inscripciones";

  let connection;

  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener las inscripciones:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
