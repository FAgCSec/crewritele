const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");

require("dotenv").config();

// Crear nuevo usuario
exports.crearUsuario = async (req, res) => {
  const defaultRol = 2

  const nuevoUsuario = new Usuario(
    req.body.nombre,
    req.body.apellidos,
    req.body.nombre_usuario,
    req.body.password,
    req.body.email,
    req.body.rol_id ?? defaultRol
  );

  await Usuario.crear(nuevoUsuario, (err, resultado) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ mensaje: "Usuario creado exitosamente", id: resultado.insertId });
  });
};

// Subir foto de perfil
// Clave y IV para cifrado AES-256-CBC
const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, "hex");

// Función para encriptar
const encryptData = (buffer) => {
  const iv = crypto.randomBytes(16); // IV aleatorio de 16 bytes
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]); // Guardamos IV + datos encriptados
};

exports.subirFotoPerfil = async (req, res) => {
  try {
    if (!req.files || !req.files.fotoPerfil) {
      return res.status(400).json({ error: "No se ha subido ninguna imagen" });
    }

    const { fotoPerfil } = req.files;
    const mimetype = fotoPerfil.mimetype;
    const size = fotoPerfil.size;

    if (size > 500000) {
      return res.status(400).json({ error: "La imagen es demasiado grande. Máximo 500 KB" });
    }

    if (!["image/jpeg", "image/png"].includes(mimetype)) {
      return res.status(400).json({ error: "Formato de imagen no válido. Solo se permiten JPG y PNG" });
    }

    // Encriptar la imagen antes de guardarla
    const encryptedImage = encryptData(fotoPerfil.data);

    // Crear nombre de archivo encriptado
    const hash = crypto.createHash("sha256").update(fotoPerfil.data).digest("hex");
    const fileName = `${hash}.enc`;

    const uploadDir = path.join(__dirname, "../uploads");
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, encryptedImage);

    // Guardar solo la ruta en la base de datos
    const rutaLocal = `/uploads/${fileName}`;
    Usuario.subirFotoPerfil(req.params.id, rutaLocal, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ mensaje: "Foto de perfil subida exitosamente", ruta: rutaLocal });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// Obtener foto de perfil
// funcion para desencriptar
const decryptData = (encryptedBuffer, iv) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, iv);
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
};

exports.obtenerFotoPerfil = (req, res) => {
  const userId = req.params.id;

  Usuario.obtenerFotoPerfil(userId, (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    const rutaFotoPerfil = result[0].ruta_foto_perfil;

    if (!rutaFotoPerfil) {
      return res.status(404).json({ error: "No hay imagen disponible" });
    }

    const filePath = path.join(__dirname, "..", rutaFotoPerfil);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    // Leer el archivo encriptado
    const encryptedData = fs.readFileSync(filePath);

    // Extraer IV y datos encriptados
    const iv = encryptedData.slice(0, 16); // Los primeros 16 bytes son el IV
    const encryptedImage = encryptedData.slice(16); // El resto son los datos encriptados

    // Desencriptar imagen
    const decryptedImage = decryptData(encryptedImage, iv);

    res.writeHead(200, { "Content-Type": "image/jpeg" }); // Cambia según el tipo
    res.end(decryptedImage);
  });
};

// Obtener todos los usuarios
exports.obtenerUsuarios = (req, res) => {
  Usuario.obtenerTodos((err, usuarios) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(usuarios);
  });
};

// Obtener un usuario
exports.obtenerUnUsuario = (req, res) => {
  Usuario.obtenerUnUsuario(req.params.id, (err, usuario) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(usuario);
  });
};

// Editar usuario
exports.editarUsuario = (req, res) => {
  const usuarioActualizado = new Usuario(
    req.body.nombre,
    req.body.apellidos,
    req.body.nombre_usuario,
    "",
    req.body.email,
    ""
  );
  Usuario.editar(req.params.id, usuarioActualizado, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: "Usuario actualizado exitosamente" });
  });
};

// Eliminar usuario
exports.eliminarUsuario = (req, res) => {
  Usuario.eliminar(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: "Usuario eliminado exitosamente" });
  });
};

// Eliminar foto de perfil
exports.eliminarFotoPerfil = (req, res) => {
  const userId = req.params.id;

  // Obtener la ruta de la foto desde la base de datos
  Usuario.obtenerFotoPerfil(userId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result || result.length === 0 || !result[0].ruta_foto_perfil) {
      return res.status(404).json({ error: "No hay foto de perfil para eliminar" });
    }

    const filePath = path.join(__dirname, "..", result[0].ruta_foto_perfil);

    // Verificar si el archivo existe y eliminarlo
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar la referencia en la base de datos
    Usuario.eliminarFotoPerfil(userId, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ mensaje: "Foto de perfil eliminada exitosamente" });
    });
  });
};

// Login de usuario con correo y contraseña
exports.loginUsuario = async (req, res) => {

  // Validar que el correo y la contraseña no estén vacíos
  if (!req.body.correo || !req.body.contrasena) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }

  Usuario.login(req.body.correo, req.body.contrasena, (err, usuario) => {
    try {
      if (err) return res.status(500).json({ error: err.message });
      if (!usuario) return res.status(400).json({ error: "Usuario o contraseña incorrectos" });

      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
        expiresIn: 86400, // 1 dia
      });

      
      res.json({
        token,
        userId: usuario.id, // o user.id, según cómo se guarde en tu base de datos
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Login usuario con su correo con google
exports.loginUsuarioCorreo = async (req, res) => {
  const {user} = req.body

  Usuario.obtenerUnUsuarioPorCorreo(user.email, (err, usuario) => {
    try {
      if (err) return res.status(500).json({ error: err.message });

      // Si ya hay un usuario registrado
      if (usuario && usuario.length > 0) {
        const token = jwt.sign({ id: usuario[0].id }, process.env.JWT_SECRET, {
          expiresIn: 86400, // 1 dia
        });
    
        return res.json({token});
      }

      // Si no hay un usuario con ese correo, lo registramos
      const { nombre, apellido } = dividirNombreCompleto(user.name);
      const nombre_usuario = user.email.split('@')[0];

      const nuevoUsuario = new Usuario(
        nombre,
        apellido,
        nombre_usuario,
        "",
        user.email,
        2 // Rol por defecto
      )

      Usuario.crearDesdeGoogle(nuevoUsuario, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });
  
        const nuevoId = resultado.insertId;
  
        const token = jwt.sign({ id: nuevoId }, process.env.JWT_SECRET, {
          expiresIn: 86400, // 1 dia
        });
  
        res.json({ token });
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    
  });
};

function dividirNombreCompleto(nombreCompleto) {
  const partes = nombreCompleto.trim().split(/\s+/);

  if (partes.length === 2) {
    return {
      nombre: partes[0],
      apellido: partes[1],
    };
  } else if (partes.length === 3) {
    return {
      nombre: partes[0],
      apellido: partes.slice(1).join(' '), // 2 apellidos
    };
  } else {
    return {
      nombre: partes.slice(0, -2).join(' '),
      apellido: partes.slice(-2).join(' '),
    };
  }
}
