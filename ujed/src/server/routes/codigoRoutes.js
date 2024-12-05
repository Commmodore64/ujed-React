const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos pool en lugar de connection

// Validar código
router.post("/validar-codigo", async (req, res) => {
  const { codigo, id } = req.body;

  // Consulta a la base de datos filtrando por materia y código
  const query = "SELECT * FROM cursos WHERE codigo = ? AND id = ?";

  let connection;

  try {
    connection = await pool.getConnection();

    const [results] = await connection.query(query, [codigo, id]);

    // Verifica si se encontró el código para la materia
    const esValido = results.length > 0;
    res.status(200).json({ valido: esValido });
  } catch (err) {
    console.error("Error en la consulta:", err);
    res.status(500).json({ valido: false });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
