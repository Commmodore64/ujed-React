const express = require("express");
const router = express.Router();
const https = require("https"); // Para hacer solicitudes HTTPS
const dbPool = require("../db"); // Para interactuar con la base de datos


const PRIVATE_API_KEY = process.env.OPENPAY_PRIVADA; // Reemplaza con tu clave API privada
const MERCHANT_ID = process.env.OPENPAY_ID; // Reemplaza con tu Merchant ID

// Función para obtener el id del curso basado en el nombre del curso
const getCursoIdByName = (curso) => {
  return new Promise((resolve, reject) => {
    console.log(`Iniciando búsqueda del curso: ${curso}`);
    const query = "SELECT id FROM cursos WHERE nombre = ?";
    dbPool.query(query, [curso], (error, results) => {
      if (error) {
        console.error(
          `Error al ejecutar la consulta para el curso "${curso}":`,
          error
        );
        return reject(error);
      }
      console.log(`Resultados de la consulta para "${curso}":`, results);
      if (results.length > 0) {
        console.log(`Curso encontrado: ${results[0].id}`);
        resolve(results[0].id);
      } else {
        console.log(`No se encontró el curso: ${curso}`);
        resolve(null);
      }
    });
  });
};

// Función para insertar un registro en la tabla inscripciones
const insertInscripcion = (idCurso, nombre, fechaInscripcion, estadoPago) => {
  return new Promise((resolve, reject) => {
    console.log(
      `Insertando inscripción para el curso ${idCurso}, nombre: ${nombre}, fecha: ${fechaInscripcion}, estado: ${estadoPago}`
    );
    const query =
      "INSERT INTO inscripciones (id_curso, nombre, fecha_inscripcion, estado_pago) VALUES (?, ?, ?, ?)";
    const fechaActual = new Date().toISOString().slice(0, 19).replace("T", " "); // Formato YYYY-MM-DD HH:MM:SS
    dbPool.query(
      query,
      [idCurso, nombre, fechaActual, estadoPago],
      (error, results) => {
        if (error) {
          console.error("Error al insertar inscripción:", error);
          return reject(error);
        }
        console.log("Inscripción insertada correctamente.");
        resolve(results);
      }
    );
  });
};

// Endpoint para crear un checkout
router.post("/create-checkout", async (req, res) => {
  console.log("Llamada al endpoint /create-checkout");
  const {
    amount,
    currency,
    newDescription,
    order_id,
    send_email,
    customer,
    redirect_url,
    curso,
    comentarios,
  } = req.body;

  console.log("Datos recibidos en el body:", req.body);

  // Verificar que todos los campos requeridos están presentes
  if (
    !amount ||
    !currency ||
    !newDescription ||
    !order_id ||
    !redirect_url ||
    !customer ||
    !curso ||
    !comentarios
  ) {
    console.error("Faltan campos requeridos en la solicitud.");
    return res
      .status(400)
      .json({ error: "Todos los campos requeridos deben ser proporcionados" });
  }

  try {
    // Obtener el id del curso basado en el nombre del curso
    const cursoId = await getCursoIdByName(curso);

    if (!cursoId) {
      console.error("Curso no encontrado.");
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    console.log(`Obteniendo datos del curso con ID: ${cursoId}`);
    const cursoResponse = await fetch(
      `https://ujed.solmoviles.com.mx/api/cursos/${cursoId}`
    );
    const cursoData = await cursoResponse.json();

    if (!cursoResponse.ok) {
      console.error("Error al obtener datos del curso desde la API.");
      return res
        .status(500)
        .json({ error: "Error al obtener datos del curso" });
    }

    const { programa, centroCosto } = cursoData;
    console.log(`Datos del curso obtenidos:`, cursoData);

    // Crear el nombre completo del cliente
    const nombreCompleto = `${customer.name}`;
    console.log(`Nombre completo del cliente: ${nombreCompleto}`);

    // Insertar en la tabla inscripciones
    await insertInscripcion(
      cursoId,
      nombreCompleto,
      new Date().toISOString().slice(0, 19).replace("T", " "),
      "Pendiente"
    );

    const description = `${newDescription}-${cursoId}`;
    console.log(`Descripción generada: ${description}`);

    const postData = JSON.stringify({
      amount,
      currency,
      description,
      order_id,
      send_email,
      customer: {
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone_number,
      },
      redirect_url,
    });

    console.log("Datos del POST a OpenPay:", postData);

    // Extraer el id_alumno del order_id
    const idAlumno = order_id.split("_")[3];
    console.log(`ID del alumno extraído: ${idAlumno}`);

    // Insertar en la tabla adeudos
    const insertAdeudoQuery = `
      INSERT INTO adeudos (id_alumno, monto, descripcion, fecha_adeudo, descripcionIngreso, Matricula, programa, centroCosto) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const adeudoValues = [
      idAlumno,
      amount,
      description,
      new Date().toISOString().slice(0, 19).replace("T", " "),
      comentarios,
      curso,
      programa,
      centroCosto,
    ];
    console.log("Insertando en la tabla de adeudos:", adeudoValues);

    dbPool.query(insertAdeudoQuery, adeudoValues, (err, result) => {
      if (err) {
        console.error("Error al insertar en la tabla de adeudos:", err);
        return res
          .status(500)
          .json({ error: "Error al insertar en la tabla de adeudos" });
      }
      console.log("Adeudo insertado correctamente.");
    });

    const options = {
      hostname: "sandbox-api.openpay.mx",
      port: 443,
      path: `/v1/${MERCHANT_ID}/checkouts`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${PRIVATE_API_KEY}:`).toString(
          "base64"
        )}`,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    console.log("Opciones para la solicitud HTTPS:", options);

    const request = https.request(options, (response) => {
      console.log(
        `Respuesta del servidor OpenPay con código: ${response.statusCode}`
      );
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", async () => {
        console.log("Datos recibidos de OpenPay:", data);
        if (response.statusCode === 200) {
          try {
            const parsedData = JSON.parse(data);
            console.log("Datos parseados correctamente:", parsedData);
            res.json(parsedData);
          } catch (parseError) {
            console.error("Error al parsear la respuesta JSON:", parseError);
            res
              .status(500)
              .json({ error: "Error al parsear la respuesta JSON" });
          }
        } else {
          try {
            const parsedData = JSON.parse(data);
            console.log("Error en OpenPay:", parsedData);
            res.status(response.statusCode).json(parsedData);
          } catch (parseError) {
            console.error("Error al parsear la respuesta JSON:", parseError);
            res
              .status(500)
              .json({ error: "Error al parsear la respuesta JSON" });
          }
        }
      });
    });

    request.on("error", (e) => {
      console.error("Error al crear el checkout:", e);
      res.status(500).json({ error: "Error al crear el checkout" });
    });

    request.write(postData);
    request.end();
  } catch (error) {
    console.error(
      "Error al obtener id del curso o insertar inscripción:",
      error
    );
    res
      .status(500)
      .json({ error: "Error al obtener id del curso o insertar inscripción" });
  }
});
// Nueva ruta para verificar una transacción y guardarla en la base de datos
router.get("/verify-transaction", (req, res) => {
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
        const holderName = transactionData.card
          ? transactionData.card.holder_name
          : "Desconocido";
        const amount = transactionData.amount;
        const date = transactionData.operation_date;
        const accountNumber = transactionData.card
          ? transactionData.card.card_number
          : "N/A";
        const method = transactionData.method;
        const description = transactionData.description;
        const orderId = transactionData.order_id;
        const name = orderId.split("_")[1];
        const order_id = orderId.split("_")[2];

        // Extraer el número después del guion en la descripción
        const descriptionNumber = description.split("-")[1]?.trim();
        // Verificar el método de pago para redirigir
        if (method === "store" || method === "bank_account") {
          // Si el método de pago es 'store' o 'bank_account', redirigir a la página de inicio
          return res.redirect("https://ujed.solmoviles.com.mx/");
        }

        // Insertar datos en la tabla de pagos si la transacción se completó
        if (status === "completed") {
          const insertQuery = `
            INSERT INTO pagos (Nombre_usuario, Nombre, Monto, Fecha_Pago, Numero_Cuenta, Metodo_Pago, Descripcion) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          const values = [
            name,
            holderName,
            amount,
            date,
            accountNumber,
            method,
            description,
          ];
          const courseId = values[6].split("-")[1]?.trim();

          dbPool.query(insertQuery, values, (err, result) => {
            if (err) {
              console.error("Error al insertar en la base de datos:", err);
              return res
                .status(500)
                .json({ error: "Error al insertar en la base de datos" });
            }

            // Después de insertar en la tabla de pagos, actualizar la tabla de inscripciones
            const updateInscriptionQuery = `
              UPDATE inscripciones 
              SET estado_pago = 'Autorizado' 
              WHERE Nombre = ? AND id_curso = ?
            `;
            const inscriptionValues = [name, descriptionNumber];
            dbPool.query(
              updateInscriptionQuery,
              inscriptionValues,
              (err, result) => {
                if (err) {
                  console.error("Error al actualizar la inscripción:", err);
                  return res
                    .status(500)
                    .json({ error: "Error al actualizar la inscripción" });
                }

                // Restar un cupo al curso correspondiente
                const updateCupoQuery = `
                UPDATE cursos
                SET cupo = cupo - 1
                WHERE id = ?
              `;
                dbPool.query(
                  updateCupoQuery,
                  [descriptionNumber],
                  (err, result) => {
                    if (err) {
                      console.error(
                        "Error al actualizar el cupo del curso:",
                        err
                      );
                      return res.status(500).json({
                        error: "Error al actualizar el cupo del curso",
                      });
                    }

                    console.log(
                      `Cupo actualizado y reducido en 1 para el curso con ID ${descriptionNumber}`
                    );
                    console.log("order_id: ", order_id);

                    // Redirigir a la ruta con los parámetros en la query string
                    res.redirect(
                      `https://ujed.solmoviles.com.mx/paypdf?name=${encodeURIComponent(
                        name
                      )}&holderName=${encodeURIComponent(
                        holderName
                      )}&amount=${amount}&date=${encodeURIComponent(
                        date
                      )}&accountNumber=${accountNumber}&method=${encodeURIComponent(
                        method
                      )}&description=${encodeURIComponent(
                        description
                      )}&courseId=${courseId}&order_id=${order_id}`
                    );
                  }
                );
              }
            );
          });
        } else {
          console.log(`Pago no autorizado para ${holderName} o ${name}`);
          res.status(400).json({
            success: false,
            message: "Pago no autorizado",
            data: transactionData,
          });
        }
      } else {
        res.status(response.statusCode).json(JSON.parse(data));
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
