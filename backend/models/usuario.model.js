const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Define la clase Usuario
class Usuario {
  // Constructor de la clase que inicializa las propiedades del usuario
  constructor(nombre, apellidos, nombre_usuario, password, email, rol_id) {
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.nombre_usuario = nombre_usuario;
    this.password = password;
    this.email = email;
    this.rol_id = rol_id;
  }

  // Metodo estatico para crear un nuevo usuario en la base de datos
  static async crear(usuario, callback) {
    // Encripta la contraseña del usuario
    const passwordHash = await bcrypt.hash(usuario.password, 10);

    // SQL para insertar un nuevo usuario
    const sql =
      "INSERT INTO usuario (nombre, apellido, nombre_usuario, contrasena, correo, rol_id) VALUES (?, ?, ?, ?, ?, ?)";
    // Ejecuta la consulta SQL con los valores del usuario
    db.query(
      sql,
      [
        usuario.nombre,
        usuario.apellidos,
        usuario.nombre_usuario,
        passwordHash,
        usuario.email,
        usuario.rol_id,
      ],
      callback
    );
  }

  // Crear usuario desde Google sin contraseña
  static crearDesdeGoogle(usuario, callback) {
    const sql = 
      "INSERT INTO usuario (nombre, apellido, nombre_usuario, contrasena, correo, rol_id) VALUES (?, ?, ?, ?, ?, ?)";

    // Guardamos NULL como contraseña si viene desde Google
    db.query(
      sql,
      [
        usuario.nombre,
        usuario.apellidos,
        usuario.nombre_usuario,
        null, // contrasena NULL
        usuario.email,
        usuario.rol_id,
      ],
      callback
    );
  }

  // Metodo para subir la foto de perfil de un usuario
  static subirFotoPerfil(id, rutaFotoPerfil, callback) {
    const sql = "UPDATE usuario SET ruta_foto_perfil = ? WHERE id = ?";

    db.query(sql, [rutaFotoPerfil, id], callback);
  }

  // Metodo para obtener la foto de perfil de un usuario
  static obtenerFotoPerfil(id, callback) {
    const sql = "SELECT ruta_foto_perfil FROM usuario WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // Metodo estatico para obtener todos los usuarios de la base de datos
  static obtenerTodos(callback) {
    // SQL para seleccionar todos los usuarios
    const sql = "SELECT u.*, r.nombre as nombre_rol FROM usuario AS u INNER JOIN rol AS r ON u.rol_id = r.id";
    // Ejecuta la consulta SQL
    db.query(sql, (err, results) => {
      if (err) {
        return callback(err); // Si hay un error, lo pasa a la funcion de callback
      }
      return callback(null, results); // Si no hay error, pasa los resultados a la funcion de callback
    });
  }

  // Metodo estatico para obtener un usuario por su id de la base de datos
  static obtenerUnUsuario(id, callback) {
    // SQL para seleccionar todos los usuarios
    const sql = "SELECT u.*, r.nombre AS nombre_rol FROM usuario AS u INNER JOIN rol AS r ON u.rol_id = r.id WHERE u.id = ?";
    // Ejecuta la consulta SQL
    db.query(sql, [id], (err, results) => {
      if (err) {
        return callback(err); // Si hay un error, lo pasa a la funcion de callback
      }
      return callback(null, results); // Si no hay error, pasa los resultados a la funcion de callback
    });
  }

  // Metodo estatico para obtener un usuario por su correo de la base de datos
  static obtenerUnUsuarioPorCorreo(correo, callback) {
    // SQL para seleccionar todos los usuarios
    const sql = "SELECT u.*, r.nombre AS nombre_rol FROM usuario AS u INNER JOIN rol AS r ON u.rol_id = r.id WHERE u.correo = ?";
    // Ejecuta la consulta SQL
    db.query(sql, [correo], (err, results) => {
      if (err) {
        return callback(err); // Si hay un error, lo pasa a la funcion de callback
      }
      return callback(null, results); // Si no hay error, pasa los resultados a la funcion de callback
    });
  }

  // Metodo estatico para editar un usuario existente
  static editar(id, usuarioActualizado, callback) {
    // SQL para actualizar un usuario específico
    const sql =
      "UPDATE usuario SET nombre = ?, apellido = ?, nombre_usuario = ?, correo = ? WHERE id = ?";
    // Ejecuta la consulta SQL con los valores del usuario actualizado
    db.query(
      sql,
      [
        usuarioActualizado.nombre,
        usuarioActualizado.apellidos,
        usuarioActualizado.nombre_usuario,
        usuarioActualizado.email,
        id,
      ],
      callback
    );
  }

  // Metodo estatico para eliminar un usuario
  static eliminar(id, callback) {
    // SQL para eliminar un usuario específico
    const sql = "DELETE FROM usuario WHERE id = ?";
    // Ejecuta la consulta SQL
    db.query(sql, [id], callback);
  }

  // Metodo estatico para eliminar la foto de perfil de un usuario
  static eliminarFotoPerfil(id, callback) {
    // SQL para eliminar la foto de perfil de un usuario específico
    const sql = "UPDATE usuario SET ruta_foto_perfil = NULL WHERE id = ?";
    // Ejecuta la consulta SQL
    db.query(sql, [id], callback);
  }

  // Metodo estatico para loguear un usuario
  static async login(correo, contrasena, callback) {
    const sql = "SELECT id, correo, contrasena, nombre_usuario, rol_id FROM usuario WHERE correo = ?";

    db.query(sql, [correo], (err, results) => {
      if (err) return callback(err, null);
      if (results.length === 0) return callback(null, null); // Usuario no encontrado

      const usuario = results[0];

      // Comparar la contraseña ingresada con la almacenada en la base de datos
      bcrypt.compare(contrasena, usuario.contrasena, (err, isMatch) => {
        if (err) return callback(err, null);
        if (!isMatch) return callback(null, null);

        callback(null, { id: usuario.id, username: usuario.nombre_usuario, rolId: usuario.rol_id });
      });
    });
  }
}

// Exporta la clase Usuario para su uso en otros modulos
module.exports = Usuario;
