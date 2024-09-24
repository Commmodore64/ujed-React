const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const userdataRoute = require('./routes/userdataRoute');
const cursosRoutes = require('./routes/cursosRoutes');
const inscripcionesRoutes = require('./routes/inscripcionesRoutes');
const programRoutes = require('./routes/programRoutes');
const codigoRoutes = require('./routes/codigoRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');
const payRoutes = require('./routes/payRoutes');
const paydetailsRoutes = require('./routes/paydetailsRoutes');
const payPdfRoutes = require('./routes/payPdfRoutes');
const payEfectivoPdfRoutes = require('./routes/payEfectivoPdfRoutes');

app.use(cors()); // CORS para todas las rutas
    
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de API
app.use('/api', userRoutes); // Rutas de API para usuarios bajo /api
app.use('/api', userdataRoute); // Rutas de API para userdata bajo /api
app.use('/api', cursosRoutes); // Rutas de API para cursos bajo /api
app.use('/api', inscripcionesRoutes); // Rutas de API para inscripciones bajo /api
app.use('/api', programRoutes); // Rutas de API para programRoutes bajo /api
app.use('/api', codigoRoutes); // Rutas de API para codigoRoutes bajo /api
app.use('/api', catalogoRoutes); // Rutas de API para catalogoRoutes bajo /api
app.use('/api', payRoutes); // Rutas de API para payRoutes bajo /api
app.use('/api', paydetailsRoutes); // Rutas de API para paydetailsRoutes bajo /api
app.use('/api', payPdfRoutes); // Rutas de API para payPdfRoutes bajo /api
app.use('/api', payEfectivoPdfRoutes); // Rutas de API para payEfectivoPdfRoutes bajo /api

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
