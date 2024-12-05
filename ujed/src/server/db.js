const mysql = require("mysql2/promise");
require("dotenv").config(); // Importa las variables de entorno desde un archivo .env

const pool = mysql.createPool({
  host: "localhost",
  user: "backend_user",
  port: "3306",
  password: "K0nT4BL3-F430!!",
  database: "ujedMysql",
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
});

// Verificar la conexión al iniciar el servidor
pool
  .query("SELECT 1")
  .then(() => {
    console.log("Conexión exitosa a la base de datos MySQL");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos: ", err);
  });

module.exports = pool;
