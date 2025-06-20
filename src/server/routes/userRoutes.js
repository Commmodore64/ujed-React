const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos el pool en lugar de connection

router.get("/alumnos/:id", async (req, res) => {
  const alumnoId = req.params.id; // Obtener el ID del alumno desde los parámetros de la URL o el token JWT

  try {
    // Verificar si el alumno tiene permiso para acceder a estos datos (autenticación y autorización)

    // Consultar datos del alumno específico
    const [results] = await pool
      .promise()
      .query(
        "SELECT matricula, nombre_completo, telefono, fecha_nacimiento FROM alumnos WHERE id = ?",
        [alumnoId]
      );

    if (results.length > 0) {
      const alumnoData = results[0]; // Obtener el primer resultado (debería ser único)
      res.status(200).json(alumnoData);
    } else {
      res.status(404).json({ error: "Alumno no encontrado" });
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
