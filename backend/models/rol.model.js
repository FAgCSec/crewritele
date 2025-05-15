const db = require('../config/db');

// Define la clase Rol
class Rol {
    constructor(descripcion) {
        this.descripcion = descripcion; // nombre del rol, por ejemplo: lector, creador de noticia
    }

    // Crear nuevo rol
    static crear(rol, callback) {
        const sql = 'INSERT INTO rol (nombre) VALUES (?)';
        db.query(sql, [rol.descripcion], callback);
    }

    // Obtener todos los roles
    static obtenerTodos(callback) {
        const sql = 'SELECT * FROM rol';
        db.query(sql, callback);
    }

    // Editar un rol existente
    static editar(id, rolActualizado, callback) {
        const sql = 'UPDATE rol SET nombre = ? WHERE id = ?';
        db.query(sql, [rolActualizado.descripcion, id], callback);
    }

    // Eliminar un rol
    static eliminar(id, callback) {
        const sql = 'DELETE FROM rol WHERE id = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = Rol;
