const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const router = express.Router();

// Middleware para validar el JWT de Auth0
// Reemplaza 'YOUR_DOMAIN' y 'YOUR_API_AUDIENCE' con los valores correspondientes de tu cuenta de Auth0.
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

// Simulación de base de datos en memoria
let users = [];
let currentId = 1;

// GET /users - Traer todos los usuarios
router.get("/users", checkJwt, (req, res) => {
  res.json(users);
});

// POST /users - Crear un nuevo usuario
router.post("/users", checkJwt, (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ error: "Se requieren 'nombre' y 'email'" });
  }
  const newUser = { id: currentId++, nombre, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// GET /users/:id - Traer la información de un usuario
router.get("/users/:id", checkJwt, (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.json(user);
});

// PUT /users/:id - Actualizar la información de un usuario
router.put("/users/:id", checkJwt, (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  const { nombre, email } = req.body;
  if (nombre) user.nombre = nombre;
  if (email) user.email = email;
  res.json(user);
});

// DELETE /users/:id - Eliminar un usuario
router.delete("/users/:id", checkJwt, (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  users.splice(index, 1);
  res.json({ message: "Usuario eliminado correctamente" });
});

module.exports = router;
