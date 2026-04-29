const PDFDocument = require("pdfkit");

exports.generateCV = (req, res) => {
  const {
    personal,
    work,
    education,
    skills,
    languages,
    projects,
    certificates,
    templateId,
  } = req.body;

  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");

  doc.pipe(res);

  // ─────────────────────────────
  // TEMPLATE SELECTION
  // ─────────────────────────────

  if (templateId === 1) {
    drawTemplate1(doc, {
      personal,
      work,
      education,
      skills,
      languages,
      projects,
      certificates,
    });
  } else {
    drawTemplate2(doc, {
      personal,
      work,
      education,
      skills,
      languages,
      projects,
      certificates,
    });
  }

  doc.end();
};
function drawTemplate1(doc, data) {
  const { personal, work, education, skills } = data;

  // NAME
  doc.fontSize(22).text(personal.name || "No Name", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(12).text(personal.title || "", {
    align: "center",
  });

  doc.moveDown(2);

  // CONTACT
  doc
    .fontSize(10)
    .text(
      `${personal.email || ""} | ${personal.phone || ""} | ${personal.location || ""}`,
    );

  doc.moveDown();

  // SUMMARY
  doc.fontSize(14).text("Summary", { underline: true });
  doc.fontSize(11).text(personal.summary || "");

  doc.moveDown();

  // SKILLS
  doc.fontSize(14).text("Skills", { underline: true });
  skills.forEach((s) => doc.text("• " + s));

  doc.moveDown();

  // WORK
  doc.fontSize(14).text("Experience", { underline: true });

  work.forEach((w) => {
    doc.fontSize(12).text(w.position + " - " + w.company);
    doc.fontSize(10).text(`${w.startDate} - ${w.endDate}`);
    doc.fontSize(10).text(w.description || "");
    doc.moveDown();
  });

  // EDUCATION
  doc.fontSize(14).text("Education", { underline: true });

  education.forEach((e) => {
    doc.fontSize(12).text(e.school);
    doc.fontSize(10).text(`${e.degree} - ${e.field}`);
    doc.moveDown();
  });
}
