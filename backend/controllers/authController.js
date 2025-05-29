const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");

// Verificar si el usuario está autenticado
exports.verificarToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>


  if (!token) {
    return res.status(401).json({ error: "No se ha proporcionado un token" });
  }


  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error al verificar token:", err.message);
      return res.status(401).json({ error: "Token inválido" });
    }

    Usuario.obtenerUnUsuario(decoded.id, (err, usuario) => {
      if (err) {
        return res.status(500).json({ error: "No autorizado" });
      }

      if (!usuario || usuario.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado, no autorizado" });
      }

      res.json({ mensaje: "Token válido", userId: usuario[0].id });
    });
  });
};
