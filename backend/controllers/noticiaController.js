const Noticia = require("../models/noticia.model");
const imgur = require("imgur");
const fs = require("fs");
const path = require("path");
const moment = require('moment');


// Crear nueva noticia
exports.crearNoticia = (req, res) => {
  if (!req.files || !req.files.fotoNoticia) {
    return res.status(400).json({ error: "No se ha subido ninguna imagen" });
  }

  let { fotoNoticia } = req.files;
  const mimetype = fotoNoticia.mimetype;
  const size = fotoNoticia.size;

  // Validar tamaño de archivo max 10MB (10000000 - 10 millones bytes)
  if (size > 10000000) {
    return res.status(400).json({
      error: "La imagen es demasiado grande. Máximo 10MB",
    });
  }

  // Validar tipo de archivo
  if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
    return res.status(400).json({
      error: "Formato de imagen no válido. Solo se permiten JPG y PNG",
    });
  }

  // Usar path.join para una ruta segura
  const uploadDir = path.join(__dirname, "../uploads");
  const uploadPath = path.join(uploadDir, fotoNoticia.name);

  // Verificar si la carpeta de "uploads" existe, si no la crea
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Mover el archivo a la carpeta de "uploads"
  fotoNoticia.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    // Subir la imagen a imgur
    imgur.uploadFile(uploadPath)
      .then((urlObject) => {
        // Eliminar el archivo local después de cargarlo
        fs.unlinkSync(uploadPath);

        const idFotoNoticia = urlObject.id;

        const nuevaNoticia = new Noticia(
          req.body.titulo,
          req.body.contenido,
          req.body.autor_id,
          idFotoNoticia
        );

        // Crear la noticia en la base de datos
        Noticia.crear(nuevaNoticia, (err, resultado) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({
            mensaje: "Noticia creada exitosamente",
            id: resultado.insertId,
          });
        });
      })
      .catch((err) => {
        res.status(500).json({ error: "Error al subir imagen a Imgur", detalle: err.message });
      });
  });
};

// Obtener todas las noticias
exports.obtenerNoticias = (req, res) => {
  Noticia.obtenerTodos((err, noticias) => {
    if (err) return res.status(500).json({ error: err.message });
    // Formatear las fechas de las noticias
    noticias = noticias.map(noticia => {
      noticia.fecha_publicacion = moment(noticia.fecha_publicacion).format('DD MMMM YYYY, HH:mm');
      return noticia;
    });
    res.json(noticias);
  });
};

// Editar noticia
exports.editarNoticia = (req, res) => {
  const noticiaActualizada = new Noticia(
    req.body.titulo,
    req.body.contenido,
    req.body.autor_id
  );
  Noticia.editar(req.params.id, noticiaActualizada, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: "Noticia actualizada exitosamente" });
  });
};

// Eliminar noticia
exports.eliminarNoticia = (req, res) => {
  Noticia.eliminar(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: "Noticia eliminada exitosamente" });
  });
};
