const mysql = require("mysql2");
require("dotenv").config(); // Importa las variables de entorno desde un archivo .env

// Configuración de la conexión a la base de datos MySQL
const pool = mysql.createPool({
  host: "localhost", // Host de la base de datos (generalmente 'localhost' si está en tu máquina)
  user: "root", // Usuario de la base de datos
  port: "3306", // Puerto de la base de datos (generalmente 3306)
  password: "K0nT4BL3-F430!!", // Contraseña del usuario de la base de datos
  database: "ujedMysql", // Nombre de la base de datos que quieres usar
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
});

// Verificar la conexión al iniciar el servidor
pool.query("SELECT 1", (err, results) => {
  if (err) {
    console.error("Error al conectar a la base de datos: ", err);
  } else {
    console.log("Conexión exitosa a la base de datos MySQL");
  }
});

module.exports = pool;
