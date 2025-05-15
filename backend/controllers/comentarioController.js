const Comentario = require('../models/comentario.model');

// Crear nuevo comentario
exports.crearComentario = (req, res) => {
    if (!req.body.autor_id || !req.body.contenido || !req.body.noticia_id) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const nuevoComentario = new Comentario(req.body.autor_id, req.body.contenido, req.body.noticia_id);
    

    Comentario.crear(nuevoComentario, (err, resultado) => {
        if (err) {
            console.error("Error al crear comentario:", err);
            return res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
        }
        res.status(201).json({ mensaje: 'Comentario creado exitosamente', id: resultado.insertId });
    });
};


// Obtener todos los comentarios
exports.obtenerTodosLosComentariosPorNoticia = (req, res) => {
    
    // Llamar al método del modelo para obtener los comentarios con el nombre de usuario
    Comentario.obtenerComentariosPorNoticia(req.params.comentario_id, (err, comentarios) => {
        if (err) {
            console.error("Error al obtener comentarios:", err);
            return res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
        }
        res.json(comentarios);
    });
};


// Editar comentario
exports.editarComentario = (req, res) => {
    const comentarioId = req.params.comentario_id;
    const { autor_id, contenido } = req.body;

    // Obtener el comentario original
    Comentario.obtenerPorId(comentarioId, (err, comentarioOriginal) => {
        if (err) {
            console.error("Error al buscar el comentario:", err);
            return res.status(500).json({ error: 'Error al buscar el comentario' });
        }

        if (!comentarioOriginal) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        // Verificar si el autor del comentario coincide
        if (comentarioOriginal.autor_id !== parseInt(autor_id)) {
            return res.status(403).json({ error: 'No tienes permiso para editar este comentario' });
        }

        // Crear el objeto actualizado
        const comentarioActualizado = new Comentario(autor_id, contenido, comentarioOriginal.noticia_id);

        Comentario.editar(comentarioId, comentarioActualizado, (err) => {
            if (err) {
                console.error("Error al editar comentario:", err);
                return res.status(500).json({ error: 'Hubo un error al editar el comentario' });
            }
            res.json({ mensaje: 'Comentario actualizado exitosamente' });
        });
    });
};


exports.eliminarComentario = (req, res) => {
    const comentarioId = req.params.id;
    const autorId = req.body.autor_id;

    Comentario.obtenerPorId(comentarioId, (err, comentario) => {
        if (err || !comentario) {
            return res.status(404).json({ error: "Comentario no encontrado" });
        }

        // Verifica si el usuario es el autor
        if (comentario.autor_id !== parseInt(autorId)) {
            return res.status(403).json({ error: "No autorizado para eliminar este comentario" });
        }

        Comentario.eliminar(comentarioId, (err) => {
            if (err) {
                console.error("Error al eliminar comentario:", err);
                return res.status(500).json({ error: "Error interno" });
            }
            res.json({ mensaje: "Comentario eliminado exitosamente" });
        });
    });
};

