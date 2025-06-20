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

  pool.query(
    query,
    [cuenta, nombre_cuenta, subcuenta, tipo_poliza, llave_concepto, concepto],
    (err, results) => {
      if (err) {
        console.error("Error al crear el catálogo:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

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
    }
  );
});

// Obtener todos los catálogos
router.get("/catalogo", (req, res) => {
  const query = "SELECT * FROM catalogo_conceptos";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener el catálogo:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    res.status(200).json(results);
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

  pool.query(
    query,
    [
      cuenta,
      nombre_cuenta,
      subcuenta,
      tipo_poliza,
      llave_concepto,
      concepto,
      catalogoId,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar el catálogo:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

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
    }
  );
});

// Eliminar un catálogo por ID
router.delete("/catalogo/:id", (req, res) => {
  const catalogoId = req.params.id;
  const query = "DELETE FROM catalogo_conceptos WHERE id = ?";

  pool.query(query, [catalogoId], (err, results) => {
    if (err) {
      console.error("Error al eliminar el catálogo:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Catálogo no encontrado" });
    }

    res.status(204).send();
    console.log("Catálogo eliminado correctamente, ID:", catalogoId);
  });
});

module.exports = router;
