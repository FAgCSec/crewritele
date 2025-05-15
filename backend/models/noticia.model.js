const db = require('../config/db');

// define la clase Noticia
class Noticia {
    constructor(titulo, contenido, autor_id, id_foto_noticia) {
        this.titulo = titulo;
        this.contenido = contenido;
        this.autor_id = autor_id;
        this.id_foto_noticia = id_foto_noticia;
    }

    // crear una nueva noticia
    static crear(noticia, callback) {
        const sql = 'INSERT INTO noticia (titulo, contenido, autor_id, id_foto_noticia) VALUES (?, ?, ?, ?)';
        db.query(sql, [noticia.titulo, noticia.contenido, noticia.autor_id, noticia.id_foto_noticia], callback);
    }

    // obtener todas las noticias
    static obtenerTodos(callback) {
        const sql = 'SELECT n.*, u.nombre_usuario, u.ruta_foto_perfil, u.nombre, u.apellido FROM noticia n JOIN usuario u ON n.autor_id = u.id ORDER BY n.id DESC';
        db.query(sql, callback);
    }

    static obtenerNoticiasPorAutor (id, callback) {
        const sql = 'SELECT n.*, u.nombre_usuario, u.nombre, u.ruta_foto_perfil, u.apellido FROM noticia AS n JOIN usuario AS u ON n.autor_id = u.id WHERE autor_id = ? ORDER BY n.id DESC';
        db.query(sql, [id], callback);
    }

    // obtener una noticia
    static obtenerUnaNoticia(id, callback) {
        const sql = 'SELECT n.*, u.nombre_usuario FROM noticia n JOIN usuario u ON n.autor_id = u.id WHERE n.id = ?';
        db.query(sql, [id], callback);
    }

    // Editar una noticia existente
    static editar(id, noticiaActualizada, callback) {
        const sql = 'UPDATE noticia SET titulo = ?, contenido = ?, autor_id = ? WHERE id = ?';
        db.query(sql, [noticiaActualizada.titulo, noticiaActualizada.contenido, noticiaActualizada.autor_id, id], callback);
    }

    // Eliminar una noticia
    static eliminar(id, callback) {
        const sql = 'DELETE FROM noticia WHERE id = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = Noticia;
