const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos pool para manejar la conexión

// Crear un nuevo catálogo
router.post("/catalogo", (req, res) => {
  const {
    cuenta,
    nombre_cuenta,
    subcuenta,
    tipo_poliza,
    llave_concepto,
    concepto,
  } = req.body;

  const query =
    "INSERT INTO catalogo_conceptos (cuenta, nombre_cuenta, subcuenta, tipo_poliza, llave_concepto, concepto) VALUES (?, ?, ?, ?, ?, ?)";

  pool
    .query(query, [
      cuenta,
      nombre_cuenta,
      subcuenta,
      tipo_poliza,
      llave_concepto,
      concepto,
    ])
    .then(([results]) => {
      res.status(201).json({
        id: results.insertId,
        cuenta,
        nombre_cuenta,
        subcuenta,
        tipo_poliza,
        llave_concepto,
        concepto,
      });

      console.log("Catálogo creado correctamente:", {
        id: results.insertId,
        cuenta,
        nombre_cuenta,
        subcuenta,
        tipo_poliza,
        llave_concepto,
        concepto,
      });
    })
    .catch((err) => {
      console.error("Error al crear el catálogo:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    });
});

// Obtener todos los catálogos
router.get("/catalogo", (req, res) => {
  const query = "SELECT * FROM catalogo_conceptos";

  pool
    .query(query)
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      console.error("Error al obtener el catálogo:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    });
});

// Actualizar un catálogo por ID
router.put("/catalogo/:id", (req, res) => {
  const catalogoId = req.params.id;
  const {
    cuenta,
    nombre_cuenta,
    subcuenta,
    tipo_poliza,
    llave_concepto,
    concepto,
  } = req.body;

  const query =
    "UPDATE catalogo_conceptos SET cuenta = ?, nombre_cuenta = ?, subcuenta = ?, tipo_poliza = ?, llave_concepto = ?, concepto = ? WHERE id = ?";

  pool
    .query(query, [
      cuenta,
      nombre_cuenta,
      subcuenta,
      tipo_poliza,
      llave_concepto,
      concepto,
      catalogoId,
    ])
    .then(([results]) => {
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Catálogo no encontrado" });
      }

      res.status(200).json({
        id: catalogoId,
        cuenta,
        nombre_cuenta,
        subcuenta,
        tipo_poliza,
        llave_concepto,
        concepto,
      });

      console.log("Catálogo actualizado correctamente:", {
        id: catalogoId,
        cuenta,
        nombre_cuenta,
        subcuenta,
        tipo_poliza,
        llave_concepto,
        concepto,
      });
    })
    .catch((err) => {
      console.error("Error al actualizar el catálogo:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    });
});

// Eliminar un catálogo por ID
router.delete("/catalogo/:id", (req, res) => {
  const catalogoId = req.params.id;
  const query = "DELETE FROM catalogo_conceptos WHERE id = ?";

  pool
    .query(query, [catalogoId])
    .then(([results]) => {
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Catálogo no encontrado" });
      }

      res.status(204).send();
      console.log("Catálogo eliminado correctamente, ID:", catalogoId);
    })
    .catch((err) => {
      console.error("Error al eliminar el catálogo:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    });
});

module.exports = router;
