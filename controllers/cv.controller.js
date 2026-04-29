const puppeteer = require("puppeteer-core");

exports.generateCV = async (req, res) => {
  try {
    const {
      work = [],
      education = [],
      skills = [],
      languages = [],
      projects = [],
      certificates = [],
      templateId = 1,
    } = req.body;

    const html = buildHTML({
      work,
      education,
      skills,
      languages,
      projects,
      certificates,
    });

    const browser = await puppeteer.launch({
      headless: "new",
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "24px", bottom: "24px", left: "32px", right: "32px" },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");
    res.end(pdfBuffer);
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ error: "PDF yaradılmadı", detail: err.message });
  }
};

function buildHTML({
  work,
  education,
  skills,
  languages,
  projects,
  certificates,
}) {
  const section = (title, content) =>
    content
      ? `<div class="section">
           <div class="section-title">${title}</div>
           ${content}
         </div>`
      : "";

  const workHTML = work
    .map(
      (w) => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${w.position || ""}</span>
        <span class="item-date">${w.startDate || ""} – ${w.endDate || ""}</span>
      </div>
      <div class="item-subtitle">${w.company || ""}${w.location ? " • " + w.location : ""}</div>
      ${w.description ? `<div class="item-desc">${w.description}</div>` : ""}
    </div>`,
    )
    .join("");

  const educationHTML = education
    .map(
      (e) => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${e.school || ""}</span>
        <span class="item-date">${e.startYear || ""} – ${e.endYear || ""}</span>
      </div>
      <div class="item-subtitle">${e.degree || ""}${e.field ? " • " + e.field : ""}</div>
    </div>`,
    )
    .join("");

  const skillsHTML = skills.length
    ? `<div class="chips">
         ${skills.map((s) => `<span class="chip">${s}</span>`).join("")}
       </div>`
    : "";

  const languagesHTML = languages
    .map(
      (l) => `
    <div class="lang-row">
      <span class="item-title">${l.name || ""}</span>
      <span class="lang-level">${l.level || ""}</span>
    </div>`,
    )
    .join("");

  const projectsHTML = projects
    .map(
      (p) => `
    <div class="item">
      <div class="item-title">${p.title || ""}</div>
      ${p.description ? `<div class="item-desc">${p.description}</div>` : ""}
      ${p.link ? `<div class="item-link">${p.link}</div>` : ""}
    </div>`,
    )
    .join("");

  const certificatesHTML = certificates
    .map(
      (c) => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${c.title || ""}</span>
        <span class="item-date">${c.year || ""}</span>
      </div>
      <div class="item-subtitle">${c.issuer || ""}</div>
    </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 13px;
    color: #1a1a2e;
    line-height: 1.5;
  }
  .section {
    margin-bottom: 18px;
  }
  .section-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #4a4aff;
    border-bottom: 1.5px solid #4a4aff;
    padding-bottom: 3px;
    margin-bottom: 10px;
  }
  .item {
    margin-bottom: 10px;
  }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .item-title {
    font-weight: 600;
    font-size: 13px;
    color: #1a1a2e;
  }
  .item-date {
    font-size: 11px;
    color: #888;
    white-space: nowrap;
    margin-left: 8px;
  }
  .item-subtitle {
    font-size: 12px;
    color: #555;
    margin-top: 1px;
  }
  .item-desc {
    font-size: 12px;
    color: #444;
    margin-top: 4px;
    line-height: 1.6;
  }
  .item-link {
    font-size: 11px;
    color: #4a4aff;
    margin-top: 2px;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    background: #eeeeff;
    color: #4a4aff;
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 500;
  }
  .lang-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .lang-level {
    font-size: 12px;
    color: #888;
  }
</style>
</head>
<body>
  ${section("Work Experience", workHTML)}
  ${section("Education", educationHTML)}
  ${section("Skills", skillsHTML)}
  ${section("Languages", languagesHTML)}
  ${section("Projects", projectsHTML)}
  ${section("Certificates", certificatesHTML)}
</body>
</html>`;
}
