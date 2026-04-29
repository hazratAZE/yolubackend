const PDFDocument = require("pdfkit");

exports.generateCV = (req, res) => {
  const { education } = req.body;

  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");

  doc.pipe(res);

  doc.fontSize(18).text("Education CV", { align: "center" });
  doc.moveDown(2);

  if (!education || education.length === 0) {
    doc.fontSize(12).text("No education data provided");
  } else {
    education.forEach((e) => {
      doc.fontSize(14).text(e.school || "");
      doc.fontSize(11).text(`${e.degree || ""} - ${e.field || ""}`);
      doc.fontSize(10).text(`${e.startYear || ""} - ${e.endYear || ""}`);
      doc.moveDown();
    });
  }

  doc.end();
};
