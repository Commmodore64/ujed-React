// paynetVerification.js
const express = require("express");
const router = express.Router();
const https = require("https");
const db = require("../db"); // Reemplaza con la ruta a tu módulo de conexión a la base de datos
require("dotenv").config();

const PRIVATE_API_KEY = process.env.OPENPAY_PRIVADA; // Reemplaza con tu clave API privada
const MERCHANT_ID = process.env.OPENPAY_ID; // Reemplaza con tu Merchant ID

// Ruta para verificar una transacción
router.get("/verify-payment", (req, res) => {
  const transactionId = req.query.id;

  if (!transactionId) {
    return res.status(400).json({ error: "Falta el ID de la transacción" });
  }

  const options = {
    hostname: "sandbox-api.openpay.mx",
    port: 443,
    path: `/v1/${MERCHANT_ID}/charges/${transactionId}`,
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${PRIVATE_API_KEY}:`).toString(
        "base64"
      )}`,
    },
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      if (response.statusCode === 200) {
        const transactionData = JSON.parse(data);
        const status = transactionData.status;

        if (status === "completed") {
          // Aquí puedes registrar la transacción en la base de datos
          const insertQuery = `
            INSERT INTO pagos (Nombre_usuario, Monto, Fecha_Pago, Metodo_Pago, Descripcion) 
            VALUES (?, ?, ?, ?, ?)
          `;

          const values = [
            transactionData.customer.name,
            transactionData.amount,
            transactionData.operation_date,
            transactionData.method,
            transactionData.description,
          ];

          db.query(insertQuery, values, (err) => {
            if (err) {
              console.error("Error al insertar en la base de datos:", err);
              return res
                .status(500)
                .json({ error: "Error al insertar en la base de datos" });
            }

            console.log("Registro en pagos insertado correctamente");
            return res.status(200).json({
              success: true,
              message: "Pago autorizado y registrado correctamente",
            });
          });
        } else if (status === "in_process") {
          return res.status(202).json({
            success: false,
            message: "El pago está en proceso",
            data: transactionData,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Pago no autorizado",
            data: transactionData,
          });
        }
      } else {
        return res.status(response.statusCode).json(JSON.parse(data));
      }
    });
  });

  request.on("error", (e) => {
    console.error("Error al consultar la transacción:", e);
    res.status(500).json({ error: "Error al consultar la transacción" });
  });

  request.end();
});

module.exports = router;
