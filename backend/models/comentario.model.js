const db = require('../config/db');

// Define la clase Comentario
class Comentario {
    constructor(autor_id, contenido, noticia_id) {
        this.autor_id = autor_id;
        this.contenido = contenido;
        this.noticia_id = noticia_id;
    }

    // Crear nuevo comentario
    static crear(comentario, callback) {
        const sql = 'INSERT INTO comentario (autor_id, contenido, noticia_id) VALUES (?, ?, ?)';
        db.query(sql, [comentario.autor_id, comentario.contenido, comentario.noticia_id], callback);
    }

    // Obtener todos los comentarios de una noticia
    static obtenerComentariosPorNoticia(id, callback) {
        const sql = `
            SELECT c.*, u.nombre_usuario 
            FROM comentario AS c 
            JOIN usuario AS u ON c.autor_id = u.id 
            WHERE c.noticia_id = ?;
        `;
        db.query(sql, [id], (err, resultados) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return callback(err, null);
            }

            const comentarios = resultados.map((comentario) => ({
                id: comentario.id,
                contenido: comentario.contenido,
                autor_id: comentario.autor_id,
                noticia_id: comentario.noticia_id,
                fecha_publicacion: comentario.fecha_publicacion,
                usuario_nombre: comentario.nombre_usuario
            }));

            callback(null, comentarios);
        });
    }

    // Obtener un comentario por su ID
    static obtenerPorId(id, callback) {
        const sql = 'SELECT * FROM comentario WHERE id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]);
        });
    }

    // Editar un comentario existente
    static editar(id, comentarioActualizado, callback) {
        const sql = 'UPDATE comentario SET autor_id = ?, contenido = ?, noticia_id = ? WHERE id = ?';
        db.query(
            sql,
            [comentarioActualizado.autor_id, comentarioActualizado.contenido, comentarioActualizado.noticia_id, id],
            callback
        );
    }

    // Eliminar un comentario
    static eliminar(id, callback) {
        const sql = 'DELETE FROM comentario WHERE id = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = Comentario;
