const express = require('express');
const router = express.Router();
const connection = require('../db');

// Crear un nuevo curso
router.post('/cursos', (req, res) => {
    const { nombre, programa, info, costo, vigencia, cupo, codigo, catalogo, centroCosto } = req.body;
    
    // Verifica si vigencia está en el formato esperado dd/MM/yyyy
    const [day, month, year] = vigencia.split('/');
    if (!day || !month || !year) {
        return res.status(400).json({ error: 'Formato de fecha incorrecto' });
    }

    const vigenciaFormat = `${year}-${month}-${day}`;
    const fecha = new Date();

    const query = 'INSERT INTO cursos (nombre, programa, info, date, costo, vigencia, cupo, codigo, catalogo, centroCosto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [nombre, programa, info, fecha, costo, vigenciaFormat, cupo, codigo, catalogo, centroCosto], (err, results) => {
        if (err) {
            console.error('Error al crear el curso:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.status(201).json({ id: results.insertId, nombre, programa, info, costo, vigencia: vigenciaFormat, cupo, codigo, catalogo, centroCosto });
        console.log("Curso creado correctamente, datos: ", { id: results.insertId, nombre, programa, info, costo, vigencia: vigenciaFormat, cupo, codigo, catalogo, centroCosto });
    });
});


// Endpoint para obtener todos los cursos
router.get('/cursos', (req, res) => {
    connection.query('SELECT * FROM cursos', (err, results) => {
      if (err) {
        console.error('Error al obtener cursos:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      res.status(200).json(results);
    });
  });

// Obtener un curso por ID
router.get('/cursos/:id', (req, res) => {
    const cursoId = req.params.id;
    const query = 'SELECT * FROM cursos WHERE id = ?';
    connection.query(query, [cursoId], (err, results) => {
        if (err) {
            console.error('Error al obtener el curso:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ error: 'Curso no encontrado' });
        }
    });
});

// Actualizar un curso por ID
router.put('/cursos/:id', (req, res) => {
    const cursoId = req.params.id;
    const fecha = new Date();
    const { nombre, programa, info, costo, vigencia, cupo, codigo, catalogo, centroCosto } = req.body;

    console.log('Datos recibidos:', { nombre, programa, info, costo, vigencia, cupo, codigo, catalogo, centroCosto });

    const query = 'UPDATE cursos SET nombre = ?, programa = ?, info = ?, date = ?, costo = ?, vigencia = ?, cupo = ?, codigo = ?, catalogo = ?, centroCosto = ? WHERE id = ?';
    connection.query(query, [nombre, programa, info, fecha, costo, vigencia, cupo, codigo, catalogo, centroCosto,  cursoId], (err, results) => {
        if (err) {
            console.error('Error al actualizar el curso:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.status(200).json({ id: cursoId, nombre, info });
    });
});



// Eliminar un curso por ID
router.delete('/cursos/:id', (req, res) => {
    const cursoId = req.params.id;
    const query = 'DELETE FROM cursos WHERE id = ?';
    connection.query(query, [cursoId], (err, results) => {
        if (err) {
            console.error('Error al eliminar el curso:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.status(204).json({ message: 'Curso eliminado' });
    });
});

module.exports = router;