const express = require("express");
const router = express.Router();
const pool = require("../db"); // Importar el pool de conexiones
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

router.post("/generate-pdf", (req, res) => {
  const {
    name,
    holderName,
    amount,
    date,
    accountNumber,
    method,
    description,
    courseId,
    comentarios,
    order_id,
  } = req.body;

  if (
    !name ||
    !holderName ||
    !amount ||
    !date ||
    !accountNumber ||
    !method ||
    !description ||
    !courseId ||
    !comentarios
  ) {
    return res.status(400).json({ error: "Faltan datos para generar el PDF" });
  }
  console.log("Comentarios: ", comentarios);

  // Usar el pool para hacer la consulta
  pool.query(
    "SELECT programa FROM cursos WHERE id = ?",
    [courseId],
    (err, results) => {
      if (err) {
        console.error("Error al consultar la base de datos:", err);
        return res
          .status(500)
          .json({ error: "Error al consultar la base de datos" });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }

      const { programa } = results[0];

      // Crear un documento PDF con tamaño personalizado
      const doc = new PDFDocument({
        size: [600, 300], // Dimensiones para la papeleta de pago
        margins: { top: 10, bottom: 10, left: 10, right: 10 }, // Márgenes pequeños para aprovechar mejor el espacio
      });
      const now = new Date();

      // Nombre del archivo PDF temporal
      const filePath = path.join(__dirname, `recibo_pago_${now.getTime()}.pdf`);

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Agregar una imagen al PDF (logotipo o lo que necesites)
      const imagePath = path.join(__dirname, "../../img/logo-faeo.png");
      doc.image(imagePath, 20, 10, { width: 50 }); // Ajusta la posición y el tamaño de la imagen

      // Agregar contenido al PDF
      doc.fontSize(20).text(programa, { align: "center" });
      doc
        .fontSize(15)
        .text("Papeleta de Pago por medio digital", { align: "center" });
      doc.moveDown(1.5); // Espacio reducido entre elementos
      doc.moveTo(20, doc.y).lineTo(580, doc.y).stroke(); // Línea ajustada al ancho de la papeleta
      doc.moveDown(0.5);
      doc.fontSize(10); // Texto reducido para evitar saltos de página
      doc.text(`Nombre del Alumno(a): ${name}`);
      doc.moveDown(0.5);
      doc.moveTo(20, doc.y).lineTo(580, doc.y).stroke();
      doc.moveDown(0.5);

      // Formatear fecha y hora
      const [datePart, timePart] = date.split("T");
      const formatDate = datePart.replace(/\//g, "/");
      const formatTime = timePart ? timePart.split(".")[0].slice(0, 5) : "";
      doc.text(`Fecha de pago: ${formatDate}`);
      doc.moveDown(0.5);
      doc.text(`Hora de pago: ${formatTime}`);
      doc.moveDown(0.5);
      const concepto = description.split("-")[0];
      doc.text(`Concepto: ${concepto}`);
      doc.moveDown(0.5);
      doc.text(`Descripción de ingreso: ${comentarios}`);
      doc.moveDown(0.5);
      doc.text(`Referencia: ${order_id}`);
      doc.moveTo(20, doc.y).lineTo(580, doc.y).stroke();
      doc.moveDown(0.5);

      // Método de pago y monto en la misma línea
      const paymentMethod = method === "card" ? "Tarjeta" : method;
      const currentY = doc.y;
      doc.text(`Método de pago: ${paymentMethod}`, 20, currentY); // Método de pago alineado a la izquierda
      doc.text(`Monto: $${amount}`, 400, currentY); // Monto alineado a la derecha, ajustado al tamaño de la papeleta
      doc.moveDown(0.5);
      doc.moveTo(20, doc.y).lineTo(580, doc.y).stroke();
      doc.moveDown(0.5);

      // Número de cuenta
      doc.text(`Número de tarjeta de quien realizo el pago: ${accountNumber}`);
      doc.moveDown(0.5);
      doc.text("Cuenta: 012190001136163048");
      doc.text("BBVA Bancomer");
      doc.moveTo(20, doc.y).lineTo(580, doc.y).stroke();
      doc.moveDown(0.5);

      // Mensaje de agradecimiento
      doc.fontSize(10).text("Gracias por su pago.", { align: "center" });

      // Finalizar el documento
      doc.end();

      stream.on("finish", () => {
        res.sendFile(filePath, (err) => {
          if (err) {
            console.error("Error al enviar el archivo PDF:", err);
            res.status(500).json({ error: "Error al enviar el archivo PDF" });
          }

          // Eliminar el archivo temporal después de enviarlo
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error al eliminar el archivo temporal:", err);
            }
          });
        });
      });
    }
  );
});

module.exports = router;
