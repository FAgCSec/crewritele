const db = require("../config/db");

// Define la clase Reporte
class Reporte {
  // Consulta 1: Noticias con más comentarios que el promedio
static async obtenerNoticiasConComentariosPromedio(callback) {
  const sql = `
    SELECT 
      n.id, n.titulo, n.contenido, n.autor_id, n.fecha_publicacion, 
      (
        SELECT COUNT(*) 
        FROM comentario c 
        WHERE c.noticia_id = n.id
      ) AS total_comentarios
    FROM noticia n
    WHERE (
      SELECT COUNT(*) 
      FROM comentario c 
      WHERE c.noticia_id = n.id
    ) > (
      SELECT AVG(comentarios_por_noticia)
      FROM (
        SELECT COUNT(*) AS comentarios_por_noticia 
        FROM comentario 
        GROUP BY noticia_id
      ) AS sub
    );
  `;
  db.query(sql, callback);
}

static async obtenerUsuariosComentaronTodasLasNoticias(autorId, callback) {
  // Paso 1: Verificar que el autor exista
  const sqlAutorExiste = `SELECT 1 FROM usuario WHERE id = ? LIMIT 1`;
  db.query(sqlAutorExiste, [autorId], (err, autorRes) => {
    if (err) return callback(err, null);

    if (autorRes.length === 0) {
      return callback(new Error("El autor no existe."), null);
    }

    // Paso 2: Verificar que tenga noticias publicadas
    const sqlNoticiasAutor = `SELECT 1 FROM noticia WHERE autor_id = ? LIMIT 1`;
    db.query(sqlNoticiasAutor, [autorId], (err, noticiasRes) => {
      if (err) return callback(err, null);

      if (noticiasRes.length === 0) {
        return callback(new Error("El autor no tiene noticias publicadas."), null);
      }

      // Paso 3: Obtener los usuarios que comentaron en TODAS las noticias del autor
      const sqlUsuarios = `
        SELECT u.id, u.nombre, u.apellido, u.nombre_usuario, u.correo, u.rol_id
        FROM usuario u
        WHERE NOT EXISTS (
          SELECT n.id
          FROM noticia n
          WHERE n.autor_id = ?
          AND NOT EXISTS (
            SELECT 1
            FROM comentario c
            WHERE c.noticia_id = n.id AND c.autor_id = u.id
          )
        );
      `;

      db.query(sqlUsuarios, [autorId], callback);
    });
  });
}


  // Consulta 3: Último comentario por cada usuario
  static async obtenerUltimoComentarioPorUsuario(callback) {
    const sql = `
      SELECT c.*
      FROM comentario c
      WHERE c.fecha_publicacion = (
        SELECT MAX(c2.fecha_publicacion)
        FROM comentario c2
        WHERE c2.autor_id = c.autor_id
      );
    `;
    db.query(sql, callback);
  }

  // Consulta 4: Cantidad de comentarios por noticia, junto al título y autor
  static async obtenerComentariosPorNoticia(callback) {
    const sql = `
      SELECT n.titulo, u.nombre AS autor, (
        SELECT COUNT(*) 
        FROM comentario c 
        WHERE c.noticia_id = n.id
      ) AS cantidad_comentarios
      FROM noticia n
      LEFT JOIN usuario u ON n.autor_id = u.id;
    `;
    db.query(sql, callback);
  }
}

module.exports = Reporte;
