const Rol = require('../models/rol.model');

// Crear nuevo rol
exports.crearRol = (req, res) => {
    const nuevoRol = new Rol(req.body.nombre);
    Rol.crear(nuevoRol, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Rol creado exitosamente', id: resultado.insertId });
    });
};

// Obtener todos los roles
exports.obtenerRoles = (req, res) => {
    Rol.obtenerTodos((err, roles) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(roles);
    });
};

// Editar rol
exports.editarRol = (req, res) => {
    const rolActualizado = new Rol(req.body.nombre);
    Rol.editar(req.params.id, rolActualizado, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Rol actualizado exitosamente' });
    });
};

// Eliminar rol
exports.eliminarRol = (req, res) => {
    Rol.eliminar(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Rol eliminado exitosamente' });
    });
};
