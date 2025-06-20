const express = require("express");
const router = express.Router();
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const pool = require("../db"); // Asegúrate de que este pool provenga de mysql2 y esté configurado para promesas

const upload = multer({ dest: "uploads/" }); // Carpeta para almacenar archivos subidos

// Función para formatear la fecha desde "D/M/YYYY" a "YYYY-MM-DD"
function formatFecha(fechaStr) {
  const parts = fechaStr.split("/");
  if (parts.length !== 3) {
    throw new Error("Formato de fecha incorrecto. Se espera D/M/YYYY.");
  }
  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

// Ruta para procesar el archivo CSV
router.post("/subir-archivo", upload.single("file"), (req, res) => {
  const results = [];

  // Leer el archivo CSV
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (data) => {
      try {
        // Usar el campo "Fecha Operaci�n" (tal como aparece en tu CSV)
        if (!data["Fecha Operaci�n"]) {
          throw new Error("El campo 'Fecha Operaci�n' no se encontró.");
        }
        const fechaPagoFormatted = formatFecha(data["Fecha Operaci�n"]);
        // Determinar el monto: usar Abono si existe; si no, usar Cargo
        const monto =
          data.Abono && data.Abono.trim() !== "" ? data.Abono : data.Cargo;
        if (!data.Referencia) {
          throw new Error("El campo 'Referencia' es obligatorio.");
        }
        results.push({
          fechaPago: fechaPagoFormatted,
          referencia: data.Referencia,
          monto: monto,
        });
        console.log("Registro procesado:", data);
      } catch (error) {
        console.error("Error procesando registro:", error.message, data);
      }
    })
    .on("error", (error) => {
      console.error("Error al leer el CSV:", error);
      return res
        .status(500)
        .json({ error: "Error al leer el CSV", detalle: error.message });
    })
    .on("end", () => {
      console.log("Finalizó la lectura del CSV. Procesando registros...");
      // Procesar cada registro del CSV
      const queries = results.map(({ fechaPago, referencia, monto }) => {
        return new Promise((resolve, reject) => {
          const queryUpdate = `
            UPDATE adeudos
            SET Fecha_Pago = ?, Pagado = 1
            WHERE referencia = ?
          `;
          pool
            .promise()
            .execute(queryUpdate, [fechaPago, referencia])
            .then(([updateResults]) => {
              if (updateResults.affectedRows === 0) {
                // Si no se encuentra la referencia en adeudos, insertar en pagosnoconciliados usando la columna Cargo
                const queryInsert = `
                  INSERT INTO pagosnoconciliados (Fecha_Pago, Referencia, Cargo)
                  VALUES (?, ?, ?)
                `;
                pool
                  .promise()
                  .execute(queryInsert, [fechaPago, referencia, monto])
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
              console.error(
                "Error al actualizar el pago para la referencia:",
                referencia,
                err
              );
              reject(err);
            });
        });
      });

      Promise.all(queries)
        .then(() => {
          console.log("Todos los pagos han sido procesados exitosamente.");
          res.status(200).json({ message: "Pagos procesados exitosamente" });
        })
        .catch((error) => {
          console.error("Error al procesar los pagos:", error);
          res
            .status(500)
            .json({
              error: "Error al procesar los pagos",
              detalle: error.message,
            });
        })
        .finally(() => {
          try {
            fs.unlinkSync(req.file.path);
            console.log("Archivo CSV eliminado.");
          } catch (unlinkErr) {
            console.error("Error al eliminar el archivo CSV:", unlinkErr);
          }
        });
    });
});

module.exports = router;
