const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateCV = async (req, res) => {
  const { education } = req.body;

  const fileName = `cv-${Date.now()}.pdf`;
  const filePath = path.join(__dirname, "../uploads", fileName);

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text("Education CV");
  doc.moveDown();

  education?.forEach((e) => {
    doc.fontSize(12).text(e.school || "");
    doc.fontSize(10).text(`${e.degree || ""} - ${e.field || ""}`);
    doc.moveDown();
  });

  doc.end();

  doc.on("finish", () => {
    res.json({
      success: true,
      url: `https://yolubackend.onrender.com/uploads/${fileName}`,
    });
  });
};
