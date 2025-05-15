const https = require("https");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors"); // Middleware para habilitar CORS
const fileUpload = require('express-fileupload')

// Cargar variables de entorno
dotenv.config();

// Importación de rutas
const usuarioRoutes = require("./routes/usuarios.routes");
const noticiaRoutes = require("./routes/noticias.routes");
const comentarioRoutes = require("./routes/comentarios.routes");
const rolRoutes = require("./routes/roles.routes");
const authRoutes = require("./routes/auth.routes");
const descargarRoutes = require("./routes/descargar.routes");
const reportesRoutes = require("./routes/reportes.routes");


const app = express();
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } })) // 10MB
const PORT = process.env.DB_PORT || 3001
// Middleware para habilitar CORS (permitir solicitudes desde otros orígenes)
app.use(cors({
  origin: "*", // Permitir solicitudes desde cualquier origen
})); // Permite todas las solicitudes de cualquier origen

// Middleware para parsear el cuerpo de las solicitudes en JSON y URL encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Asignación de rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/noticias", noticiaRoutes);
app.use("/api/comentarios", comentarioRoutes);
app.use("/api/rol", rolRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", descargarRoutes);
app.use("/reportes",reportesRoutes);


// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ocurrió un error en el servidor" });
});

// servidor https
const httpsOptions = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem")
}

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Servidor corriendo en: https://localhost:${PORT}`);
  console.log(`Servidor corriendo en el puerto :${PORT}`);
})
