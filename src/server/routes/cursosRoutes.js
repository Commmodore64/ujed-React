const express = require("express");
const router = express.Router();
const pool = require("../db"); // Usamos pool en lugar de connection

// Crear un nuevo curso
router.post("/cursos", (req, res) => {
  console.log("Datos recibidos:", req.body);

  const {
    nombre,
    programa,
    info,
    costo,
    vigencia,
    cupo,
    codigo = null, // Este valor por defecto asegura que 'codigo' sea null si no se envía
    catalogo,
    centroCosto,
  } = req.body;

  // Validar campos obligatorios excepto 'codigo'
  if (
    !nombre ||
    !programa ||
    !info ||
    !costo ||
    !vigencia ||
    !cupo ||
    !catalogo ||
    !centroCosto
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios excepto el código" });
  }

  // Validar el formato de la fecha (dd/MM/yyyy)
  const [day, month, year] = vigencia.split("/");

  // Convertir la fecha a un objeto Date
  const vigenciaDate = new Date(`${year}-${month}-${day}`);

  // Verificar si la fecha es válida
  if (isNaN(vigenciaDate)) {
    return res.status(400).json({ error: "Formato de fecha incorrecto" });
  }

  // Convertir la fecha a formato 'YYYY-MM-DD' para la base de datos
  const vigenciaFormat = vigenciaDate.toISOString().split("T")[0];

  // Obtener la fecha actual (para el campo 'date' que usas en la base de datos)
  const fecha = new Date().toISOString().split("T")[0];

  // Imprimir los datos para ver qué estamos enviando
  console.log("Datos a insertar:", [
    nombre,
    programa,
    info,
    fecha,
    costo,
    vigenciaFormat,
    cupo,
    codigo,
    catalogo,
    centroCosto,
  ]);

  const query =
    "INSERT INTO cursos (nombre, programa, info, date, costo, vigencia, cupo, codigo, catalogo, centroCosto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  // Realiza la consulta utilizando un callback
  pool.query(
    query,
    [
      nombre,
      programa,
      info,
      fecha,
      costo,
      vigenciaFormat,
      cupo,
      codigo,
      catalogo,
      centroCosto,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al crear el curso:", err);
        return res.status(500).json({
          error: "Error interno del servidor",
          details: err.message,
        });
      }

      // Retornar la respuesta
      res.status(201).json({
        id: results.insertId,
        nombre,
        programa,
        info,
        costo,
        vigencia: vigenciaFormat,
        cupo,
        codigo,
        catalogo,
        centroCosto,
      });

      console.log("Curso creado correctamente:", {
        id: results.insertId,
        nombre,
        programa,
        info,
        costo,
        vigencia: vigenciaFormat,
        cupo,
        codigo,
        catalogo,
        centroCosto,
      });
    }
  );
});

// Endpoint para obtener todos los cursos
router.get("/cursos", (req, res) => {
  const query = "SELECT * FROM cursos";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener los cursos:", err);
      return res
        .status(500)
        .json({ error: "Error en la consulta a la base de datos" });
    }

    // No se usa `async` ya que no es necesario aquí
    console.log("Cursos obtenidos: ", results);
    res.status(200).json(results); // Devuelve los resultados en formato JSON
  });
});

// Obtener un curso por ID
router.get("/cursos/:id", (req, res) => {
  const cursoId = req.params.id;
  const query = "SELECT * FROM cursos WHERE id = ?";

  pool.query(query, [cursoId], (error, results) => {
    if (error) {
      console.error("Error al obtener el curso:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ error: "Curso no encontrado" });
    }
  });
});

router.put("/cursos/:id", (req, res) => {
  const cursoId = req.params.id;
  const fecha = new Date().toISOString().split("T")[0]; // Formato consistente de fecha actual
  const {
    nombre,
    programa,
    info,
    costo,
    vigencia,
    cupo,
    codigo,
    catalogo,
    centroCosto,
  } = req.body;

  // Verificación de los datos recibidos
  console.log("Datos recibidos para put:", req.body);
  console.log("ID de curso:", cursoId);

  // Validar campos obligatorios
  if (
    !nombre ||
    !programa ||
    !info ||
    !costo ||
    !vigencia ||
    !cupo ||
    !catalogo ||
    !centroCosto
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios excepto el código" });
  }

  // Validar la fecha recibida (puede estar en formato ISO 8601)
  let dateObj;
  try {
    dateObj = new Date(vigencia); // La fecha podría estar en formato ISO 8601
  } catch (error) {
    console.log("Fecha inválida");
    return res.status(400).json({ error: "Formato de fecha incorrecto" });
  }

  if (isNaN(dateObj.getTime())) {
    console.log("Fecha inválida");
    return res.status(400).json({ error: "Formato de fecha incorrecto" });
  }

  // Formatear la fecha de vigencia en el formato correcto para la base de datos
  const vigenciaFormat = dateObj.toISOString().split("T")[0];
  console.log("Fecha formateada para vigencia:", vigenciaFormat);

  console.log("Datos para la consulta SQL:", [
    nombre,
    programa,
    info,
    fecha,
    costo,
    vigenciaFormat,
    cupo,
    codigo || null,
    catalogo,
    centroCosto,
    cursoId,
  ]);

  const query =
    "UPDATE cursos SET nombre = ?, programa = ?, info = ?, date = ?, costo = ?, vigencia = ?, cupo = ?, codigo = ?, catalogo = ?, centroCosto = ? WHERE id = ?";

  // Usamos la versión con callback en lugar de promesas
  pool.query(
    query,
    [
      nombre,
      programa,
      info,
      fecha,
      costo,
      vigenciaFormat,
      cupo,
      codigo || null,
      catalogo,
      centroCosto,
      cursoId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar el curso:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Curso no encontrado" });
      }

      res.status(200).json({
        id: cursoId,
        nombre,
        programa,
        info,
        costo,
        vigencia: vigenciaFormat,
        cupo,
        codigo,
        catalogo,
        centroCosto,
      });
    }
  );
});

// Eliminar un curso por ID
router.delete("/cursos/:id", async (req, res) => {
  const cursoId = req.params.id;

  // Validar que se envíe un ID válido
  if (!cursoId || isNaN(cursoId)) {
    return res.status(400).json({ error: "ID de curso inválido" });
  }

  const query = "DELETE FROM cursos WHERE id = ?";

  try {
    // Cambiar `pool.query` a `pool.promise().query` para utilizar Promesas
    const [result] = await pool.promise().query(query, [cursoId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.status(200).json({ message: "Curso eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar el curso:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
