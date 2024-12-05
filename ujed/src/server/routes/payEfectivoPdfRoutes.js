const express = require("express");
const router = express.Router();
const db = require("../db"); // Suponiendo que db exporta el pool
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

let lastRequestTime = 0;
const requestLimit = 5000; // 5 segundos
let requestCount = 0; // Contador de solicitudes
const maxRequests = 1; // Máximo de solicitudes permitidas en el intervalo de tiempo
let isBlocked = false; // Bandera para verificar si el usuario está bloqueado
const blockTime = 30000; // 30 segundos de bloqueo

router.post("/generate-pdf-efectivo", (req, res) => {
  const currentTime = Date.now();

  // Verificar si el usuario está bloqueado
  if (isBlocked) {
    return res
      .status(429)
      .json({
        error:
          "Has sido bloqueado por intentar demasiadas solicitudes. Intenta nuevamente después de un tiempo.",
      });
  }

  // Verificar si ha pasado el tiempo de espera entre solicitudes
  if (currentTime - lastRequestTime < requestLimit) {
    requestCount++; // Incrementar el contador de solicitudes

    // Verificar si se ha superado el número máximo de solicitudes permitidas
    if (requestCount > maxRequests) {
      isBlocked = true; // Bloquear al usuario
      setTimeout(() => {
        isBlocked = false; // Desbloquear al usuario después del tiempo de bloqueo
        requestCount = 0; // Reiniciar el contador de solicitudes
      }, blockTime);

      return res
        .status(429)
        .json({
          error:
            "Demasiadas solicitudes. Has sido bloqueado temporalmente. Intenta nuevamente después de 30 segundos.",
        });
    }
  } else {
    // Reiniciar contador si ha pasado el tiempo de espera
    requestCount = 1; // Resetear contador a 1 porque es una nueva solicitud
  }

  lastRequestTime = currentTime;

  // Desestructurar los datos de la solicitud
  const {
    nombreCompleto,
    telefono,
    costo,
    curso,
    catalogo,
    comentarios,
    identificador,
  } = req.body;

  // Verificar que los datos requeridos están presentes
  if (
    !nombreCompleto ||
    !telefono ||
    !costo ||
    !curso ||
    !catalogo ||
    !comentarios ||
    !identificador
  ) {
    return res.status(400).json({ error: "Faltan datos para generar el PDF" });
  }

  // Buscar el programa por nombre del curso y el ID del curso
  db.query(
    "SELECT id, programa, centroCosto FROM cursos WHERE nombre = ?",
    [curso],
    (err, results) => {
      if (err) {
        console.error("Error al consultar la base de datos:", err);
        return res
          .status(500)
          .json({ error: "Error al consultar la base de datos" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }

      const { programa, id: idCurso, centroCosto } = results[0]; // Obtener el programa, el ID del curso y el centro de costo

      // Obtener la fecha actual para el adeudo
      const fechaActual = new Date();
      const formatDate = `${fechaActual.getFullYear()}${String(
        fechaActual.getMonth() + 1
      ).padStart(2, "0")}${String(fechaActual.getDate()).padStart(2, "0")}`;
      const formatTime = `${String(fechaActual.getHours()).padStart(
        2,
        "0"
      )}${String(fechaActual.getMinutes()).padStart(2, "0")}`;

      // Obtener el siguiente ID_Adeudo (suponiendo que es autoincremental)
      db.query(
        "SELECT MAX(ID_Adeudo) AS maxId FROM adeudos",
        (err, idResults) => {
          if (err) {
            console.error("Error al consultar el ID_Adeudo:", err);
            return res
              .status(500)
              .json({ error: "Error al consultar el ID_Adeudo" });
          }

          const nextId = idResults[0].maxId ? idResults[0].maxId + 1 : 1; // Siguiente ID_Adeudo
          const referencia = `${nextId}${formatDate}${formatTime}`; // Generar referencia sin caracteres especiales

          // Insertar el adeudo en la base de datos con la referencia generada
          const adeudoData = {
            Matricula: curso, // O el campo que uses para la matrícula
            Nombre: nombreCompleto,
            Descripcion: catalogo,
            Monto: costo,
            Fecha_Adeudo: formatDate,
            Pagado: 0, // 0 significa no pagado
            Referencia: referencia,
            id_alumno: identificador,
            centroCosto: centroCosto,
            programa: programa,
            descripcionIngreso: comentarios,
          };

          db.query("INSERT INTO adeudos SET ?", adeudoData, (err) => {
            if (err) {
              console.error("Error al insertar el adeudo:", err);
              return res
                .status(500)
                .json({ error: "Error al insertar el adeudo" });
            }

            // Insertar en la tabla de inscripciones usando el idCurso obtenido
            const inscripcionData = {
              id_curso: idCurso, // Usar el id del curso
              nombre: nombreCompleto,
              fecha_inscripcion: new Date(),
              estado_pago: "Pendiente", // Cambiar el estado según tu lógica
              forma_pago: "Efectivo", // Asumiendo que la forma de pago es efectivo
            };

            db.query(
              "INSERT INTO inscripciones SET ?",
              inscripcionData,
              (err) => {
                if (err) {
                  console.error("Error al insertar la inscripción:", err);
                  return res
                    .status(500)
                    .json({ error: "Error al insertar la inscripción" });
                }

                // Crear un documento PDF con tamaño personalizado
                const doc = new PDFDocument({
                  size: [600, 300], // Dimensiones para la papeleta de pago
                  margins: { top: 10, bottom: 10, left: 10, right: 10 }, // Márgenes pequeños para aprovechar mejor el espacio
                });
                const now = new Date();

                // Nombre del archivo PDF temporal
                const filePath = path.join(
                  __dirname,
                  `recibo_pago_${now.getTime()}.pdf`
                );

                const stream = fs.createWriteStream(filePath);
                doc.pipe(stream);

                // Agregar una imagen al PDF (logotipo o lo que necesites)
                const imagePath = path.join(
                  __dirname,
                  "../../img/logo-faeo.png"
                );
                doc.image(imagePath, 20, 10, { width: 50 }); // Ajusta la posición y el tamaño de la imagen
                const imagePath2 = path.join(
                  __dirname,
                  "../../img/BBVA_2019.svg.png"
                );
                doc.image(imagePath2, 500, 10, { width: 50 });

                // Agregar contenido al PDF
                doc.fontSize(20).text(programa, { align: "center" });
                doc.moveDown(1.0);
                doc.fontSize(12);
                doc.text("Papeleta de Pago En Efectivo", { align: "center" });
                doc.fontSize(10);
                doc.text("Realiza tu pago en cualquier sucursal de BBVA", {
                  align: "center",
                });
                doc.moveTo(20, doc.y).lineTo(580, doc.y).stroke();
                doc.moveDown(0.5);
                doc.fontSize(10);
                doc
                  .text(`Nombre del Alumno(a): ${nombreCompleto}`)
                  .moveDown(0.5);
                doc.moveTo(20, doc.y).lineTo(580, doc.y).stroke();
                doc.moveDown(1.5);

                // Incluir fecha y hora de pago
                doc.moveUp(0.5);
                const formattedDate = `${fechaActual.getFullYear()}/${String(
                  fechaActual.getMonth() + 1
                ).padStart(2, "0")}/${String(fechaActual.getDate()).padStart(
                  2,
                  "0"
                )}`;
                doc.text(`Fecha de pago: ${formattedDate}`).moveDown(0.5);
                const formattedTime = `${String(
                  fechaActual.getHours()
                ).padStart(2, "0")}:${String(fechaActual.getMinutes()).padStart(
                  2,
                  "0"
                )}`;
                doc.text(`Hora de pago: ${formattedTime}`).moveDown(0.5);
                doc.text(`Concepto: ${catalogo}`).moveDown(0.5);
                doc.text(`Curso: ${curso}`).moveDown(0.5);
                doc.moveTo(20, doc.y).lineTo(580, doc.y).stroke();
                doc.moveDown(0.5);
                // TODO Agregar Descricion del ingreso
                // Método de pago y monto en la misma línea
                doc.text(`Método de pago: Efectivo`, 20);
                doc.moveDown(0.5);
                doc.text(`Descripción de ingreso: ${comentarios}`, 20);
                doc.text(`Monto: $${costo}.00`, 400);
                doc.moveDown(0.5);
                doc.moveTo(20, doc.y).lineTo(580, doc.y).stroke();
                doc.moveDown(0.5);

                // Incluir la referencia en el PDF
                doc.text(`Referencia: ${referencia}`).moveDown(0.5);
                doc.moveTo(20, doc.y).lineTo(580, doc.y).stroke();
                doc.moveDown(0.5);

                doc.text("Gracias por tu pago", { align: "center" });

                // Finalizar y guardar el archivo PDF
                doc.end();

                // Cuando el archivo esté guardado, enviar el archivo generado como respuesta
                stream.on("finish", () => {
                  res.download(filePath, "papeleta_pago.pdf", (err) => {
                    if (err) {
                      console.error("Error al enviar el archivo:", err);
                    } else {
                      // Eliminar el archivo PDF temporal después de enviarlo
                      fs.unlinkSync(filePath);
                    }
                  });
                });
              }
            );
          });
        }
      );
    }
  );
});

module.exports = router;
