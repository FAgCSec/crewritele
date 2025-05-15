const Reporte = require("../models/reportes.model");

// Obtener noticias con más comentarios que el promedio
exports.noticiasComentariosPromedio = (req, res) => {
  Reporte.obtenerNoticiasConComentariosPromedio((err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener noticias con más comentarios que el promedio" });
    }
    res.json(resultados);
  });
};

// Obtener usuarios que comentaron en todas las noticias de un autor
exports.usuariosComentaronTodasLasNoticias = (req, res) => {
  const { autorId } = req.params;

  // Validación de ID
  if (!autorId || isNaN(autorId)) {
    return res.status(400).json({ message: "El ID del autor no es válido." });
  }

  // Consulta al modelo
  Reporte.obtenerUsuariosComentaronTodasLasNoticias(autorId, (err, resultados) => {
    if (err) {
      console.error("Error al obtener reporte:", err.message);

      // Errores personalizados desde el modelo
      if (err.message === "El autor no existe.") {
        return res.status(404).json({ message: "El autor no existe." });
      }

      if (err.message === "El autor no tiene noticias publicadas.") {
        return res.status(404).json({ message: "El autor no tiene noticias publicadas." });
      }

      // Otros errores
      return res.status(500).json({ message: "Error al obtener usuarios que comentaron todas las noticias." });
    }

    // Sin resultados
    if (!resultados || resultados.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios que comentaron todas las noticias de este autor." });
    }

    // Todo bien
    res.status(200).json(resultados);
  });
};


// Obtener el último comentario por usuario
exports.ultimoComentarioPorUsuario = (req, res) => {
  Reporte.obtenerUltimoComentarioPorUsuario((err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener el último comentario por usuario" });
    }
    res.json(resultados);
  });
};

// Obtener la cantidad de comentarios por noticia
exports.comentariosPorNoticia = (req, res) => {
  Reporte.obtenerComentariosPorNoticia((err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener comentarios por noticia" });
    }
    res.json(resultados);
  });
};
