const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtener todos los pagos
router.get("/diversepayments", (req, res) => {
  const query = "SELECT * FROM pagos_diversos";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener pagos:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    res.status(200).json(results);
  });
});

// Obtener un pago por id
router.get("/diversepayments/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM pagos_diversos WHERE id = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener pago:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    res.status(200).json(results[0]);
  });
});

// Crear un nuevo pago
router.post("/diversepayments", (req, res) => {
  // Suponemos que el pago requiere: nombre y monto
  const { nombre, monto } = req.body;
  if (!nombre || !monto) {
    return res.status(400).json({ error: "Datos incompletos" });
  }
  const query = "INSERT INTO pagos_diversos (nombre, monto) VALUES (?, ?)";
  pool.query(query, [nombre, monto], (err, result) => {
    if (err) {
      console.error("Error al crear pago:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    res.status(201).json({ id: result.insertId, nombre, monto });
  });
});

// Actualizar un pago existente
router.put("/diversepayments/:id", (req, res) => {
  const { id } = req.params;
  // Suponemos que se deben enviar: nombre y monto
  const { nombre, monto } = req.body;
  if (!nombre || !monto) {
    return res.status(400).json({ error: "Datos incompletos" });
  }
  const query = "UPDATE pagos_diversos SET nombre = ?, monto = ? WHERE id = ?";
  pool.query(query, [nombre, monto, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar pago:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    res.status(200).json({ id, nombre, monto });
  });
});

// Eliminar un pago
router.delete("/diversepayments/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM pagos_diversos WHERE id = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar pago:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }
    res.status(200).json({ message: "Pago eliminado exitosamente" });
  });
});

module.exports = router;
