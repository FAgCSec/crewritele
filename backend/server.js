const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require('express-fileupload');

dotenv.config();

// Rutas
const usuarioRoutes = require("./routes/usuarios.routes");
const noticiaRoutes = require("./routes/noticias.routes");
const comentarioRoutes = require("./routes/comentarios.routes");
const rolRoutes = require("./routes/roles.routes");
const authRoutes = require("./routes/auth.routes");
const descargarRoutes = require("./routes/descargar.routes");
const reportesRoutes = require("./routes/reportes.routes");

const app = express();
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }));

const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/noticias", noticiaRoutes);
app.use("/api/comentarios", comentarioRoutes);
app.use("/api/rol", rolRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", descargarRoutes);
app.use("/reportes", reportesRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ocurrió un error en el servidor" });
});

// Servidor HTTP
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

