const express = require("express");
const router = express.Router();
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const pool = require("../db"); // Usamos el pool en lugar de la conexión directa

const upload = multer({ dest: "uploads/" }); // Carpeta para almacenar archivos subidos

// Ruta para procesar el archivo CSV
router.post("/subir-archivo", upload.single("file"), (req, res) => {
  const results = [];

  // Leer el archivo CSV
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (data) => {
      // Formatear la fecha de 'DD-MM-YYYY' a 'YYYY-MM-DD'
      const fechaPagoFormatted = new Date(
        data.Dia.split("-").reverse().join("-")
      )
        .toISOString()
        .split("T")[0];
      results.push({
        fechaPago: fechaPagoFormatted, // Fecha de pago formateada
        referencia: data.Referencia, // Referencia del CSV
        monto: data.Abono, // Captura el campo Monto desde el CSV
      });
      console.log("Data:", data);
    })
    .on("end", () => {
      // Procesar cada registro del CSV
      const queries = results.map(({ fechaPago, referencia, monto }) => {
        return new Promise((resolve, reject) => {
          const queryUpdate = `
            UPDATE adeudos
            SET Fecha_Pago = ?, Pagado = 1
            WHERE referencia = ?
          `;

          pool
            .execute(queryUpdate, [fechaPago, referencia]) // Usamos pool.execute()
            .then(([updateResults]) => {
              if (updateResults.affectedRows === 0) {
                // Si no se encuentra la referencia en adeudos, insertar en pagosnoconciliados
                const queryInsert = `
                  INSERT INTO pagosnoconciliados (Fecha_Pago, Referencia, Cargo)
                  VALUES (?, ?, ?)
                `;

                pool
                  .execute(queryInsert, [fechaPago, referencia, monto]) // Usamos pool.execute()
                  .then(() => {
                    console.log(
                      `Referencia no encontrada: ${referencia}. Insertada en pagosnoconciliados.`
                    );
                    resolve();
                  })
                  .catch((err) => {
                    console.error(
                      "Error al insertar en pagosnoconciliados:",
                      err
                    );
                    reject(err);
                  });
              } else {
                console.log(
                  `Pago actualizado para la referencia: ${referencia}`
                );
                resolve();
              }
            })
            .catch((err) => {
              console.error("Error al actualizar el pago:", err);
              reject(err);
            });
        });
      });

      // Ejecutar todas las consultas
      Promise.all(queries)
        .then(() => {
          res.status(200).json({ message: "Pagos procesados exitosamente" });
        })
        .catch((error) => {
          res.status(500).json({ error: "Error al procesar los pagos" });
        })
        .finally(() => {
          fs.unlinkSync(req.file.path); // Eliminar el archivo después de procesar
        });
    });
});

module.exports = router;
