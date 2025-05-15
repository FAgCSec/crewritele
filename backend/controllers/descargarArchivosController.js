const fs = require("fs");
const path = require("path");

const mysqldump = require("mysqldump");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const dotenv = require("dotenv");
const compressing = require("compressing");

const Noticia = require("../models/noticia.model");

dotenv.config();

exports.descargarDb = async (req, res) => {
  const dumpFilePath = path.join(__dirname, "db.sql");
  const rarFilePath = path.join(__dirname, "db.zip");

  try {
    // Generar el archivo SQL
    await mysqldump({
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      },
      dumpToFile: dumpFilePath,
    });

    // Comprimir en formato ZIP
    await compressing.zip.compressFile(dumpFilePath, rarFilePath);

    // Enviar archivo comprimido
    res.download(rarFilePath, "db.zip", (err) => {
      if (err) {
        console.error("Error al enviar el archivo:", err);
        res.status(500).send("Error al descargar la base de datos.");
      }
      // Eliminar archivos temporales
      fs.unlinkSync(dumpFilePath);
      fs.unlinkSync(rarFilePath);
    });
  } catch (error) {
    console.error("Error al descargar la base de datos:", error);
    res.status(500).send("Error al descargar la base de datos.");
  }
};

exports.descargarPdf = (req, res) => {
  const pdfFilePath = path.join(__dirname, "noticias.pdf");
  const zipFilePath = path.join(__dirname, "noticias-pdf.zip");

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(pdfFilePath);
  doc.pipe(stream);

  Noticia.obtenerNoticiasPorAutor(req.params.id, (err, noticias) => {
    if (err) return res.status(500).json({ error: err.message });

    doc.fontSize(25).text("Tus Noticias", { align: "center" });
    doc.moveDown();

    if (noticias.length === 0) {
      doc.fontSize(15).text("No tienes noticias escritas", { align: "left" });
    } else {
      noticias.forEach((noticia, index) => {
        doc.fontSize(15).text(`${index + 1}. ${noticia.titulo}`, { align: "left" });
        doc.moveDown();
        doc.fontSize(10).text(noticia.contenido, { align: "left" });
        doc.moveDown();
        doc.moveDown();
      });
    }

    doc.end();
  });

  stream.on("finish", async () => {
    try {
      // Comprimir el PDF en un archivo .zip
      await compressing.zip.compressFile(pdfFilePath, zipFilePath);

      // Enviar el archivo comprimido al usuario
      res.download(zipFilePath, "noticias-pdf.zip", (err) => {
        if (err) {
          console.error("Error al enviar el archivo:", err);
          res.status(500).send("Error al descargar las noticias.");
        }
        // Eliminar archivos temporales
        fs.unlinkSync(pdfFilePath);
        fs.unlinkSync(zipFilePath);
      });
    } catch (error) {
      console.error("Error al comprimir el archivo:", error);
      res.status(500).send("Error al generar el archivo comprimido.");
    }
  });

  stream.on("error", (err) => {
    console.error("Error al escribir el archivo:", err);
    res.status(500).send("Error al generar el PDF.");
  });
};

// Descargar noticias en formato Excel
exports.descargarExcel = async (req, res) => {
  const excelFilePath = path.join(__dirname, "noticias.xlsx");
  const zipFilePath = path.join(__dirname, "noticias-excel.zip");

  try {
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Noticias");

    // Definir las columnas
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Título", key: "titulo", width: 30 },
      { header: "Contenido", key: "contenido", width: 50 },
      { header: "Fecha", key: "fecha", width: 20 },
    ];

    // Obtener noticias del usuario
    const noticias = await new Promise((resolve, reject) => {
      Noticia.obtenerNoticiasPorAutor(req.params.id, (err, noticias) => {
        if (err) reject(err);
        else resolve(noticias);
      });
    });

    // Agregar noticias al Excel
    noticias.forEach((noticia) => {
      worksheet.addRow({
        id: noticia.id,
        titulo: noticia.titulo,
        contenido: noticia.contenido,
        fecha: noticia.fecha_publicacion,
      });
    });

    // Guardar el archivo Excel
    await workbook.xlsx.writeFile(excelFilePath);

    // Comprimir el archivo Excel en un .zip
    await compressing.zip.compressFile(excelFilePath, zipFilePath);

    // Enviar el archivo comprimido al usuario
    res.download(zipFilePath, "noticias-excel.zip", (err) => {
      if (err) {
        console.error("Error al enviar el archivo:", err);
        res.status(500).send("Error al descargar las noticias.");
      }
      // Eliminar archivos temporales
      fs.unlinkSync(excelFilePath);
      fs.unlinkSync(zipFilePath);
    });
  } catch (error) {
    console.error("Error al generar el archivo Excel:", error);
    res.status(500).send("Error al generar el archivo Excel.");
  }
};
