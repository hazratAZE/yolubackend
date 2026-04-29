const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

exports.generateCV = async (req, res) => {
  try {
    const {
      personal = {},
      work = [],
      education = [],
      skills = [],
      languages = [],
      projects = [],
      certificates = [],
      templateId = 1,
    } = req.body;

    const html = buildHTML({
      personal,
      work,
      education,
      skills,
      languages,
      projects,
      certificates,
      templateId,
    });

    const isLocal = process.env.NODE_ENV !== "production";

    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: isLocal
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : await chromium.executablePath(),
      args: isLocal ? ["--no-sandbox"] : chromium.args,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
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
  personal,
  work,
  education,
  skills,
  languages,
  projects,
  certificates,
  templateId,
}) {
  if (templateId === 2)
    return buildTemplate2({
      personal,
      work,
      education,
      skills,
      languages,
      projects,
      certificates,
    });
  return buildTemplate1({
    personal,
    work,
    education,
    skills,
    languages,
    projects,
    certificates,
  });
}

// ─────────────────────────────────────────────
// TEMPLATE 1 — Sadə, klassik, peşəkar
// ─────────────────────────────────────────────
function buildTemplate1({
  personal,
  work,
  education,
  skills,
  languages,
  projects,
  certificates,
}) {
  const section = (title, content) =>
    content
      ? `
    <div class="section">
      <div class="section-title">${title}</div>
      <div class="section-body">${content}</div>
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
      <div class="item-sub">${w.company || ""}${w.location ? " · " + w.location : ""}</div>
      ${w.description ? `<div class="item-desc">${w.description}</div>` : ""}
    </div>`,
    )
    .join("");

  const eduHTML = education
    .map(
      (e) => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${e.school || ""}</span>
        <span class="item-date">${e.startYear || ""} – ${e.endYear || ""}</span>
      </div>
      <div class="item-sub">${e.degree || ""}${e.field ? " · " + e.field : ""}</div>
    </div>`,
    )
    .join("");

  const skillsHTML = skills.length
    ? `
    <div class="chips">
      ${skills.map((s) => `<span class="chip">${s}</span>`).join("")}
    </div>`
    : "";

  const langHTML = languages
    .map(
      (l) => `
    <div class="lang-row">
      <span class="lang-name">${l.name || ""}</span>
      <span class="lang-level">${l.level || ""}</span>
    </div>`,
    )
    .join("");

  const projHTML = projects
    .map(
      (p) => `
    <div class="item">
      <div class="item-title">${p.title || ""}</div>
      ${p.description ? `<div class="item-desc">${p.description}</div>` : ""}
      ${p.link ? `<div class="item-link">${p.link}</div>` : ""}
    </div>`,
    )
    .join("");

  const certHTML = certificates
    .map(
      (c) => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${c.title || ""}</span>
        <span class="item-date">${c.year || ""}</span>
      </div>
      <div class="item-sub">${c.issuer || ""}</div>
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
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 12px;
    color: #1a1a1a;
    background: #fff;
    padding: 48px 52px;
  }

  /* ── HEADER ── */
  .header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #1a1a1a;
  }

  .header-name {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: 'Arial', sans-serif;
  }

  .header-title {
    font-size: 13px;
    color: #555;
    margin-top: 4px;
    font-style: italic;
  }

  .header-contacts {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .header-contact {
    font-size: 11px;
    color: #444;
    font-family: 'Arial', sans-serif;
  }

  .header-contact::before {
    content: '• ';
    color: #999;
  }

  .header-contact:first-child::before {
    content: '';
  }

  .header-summary {
    margin-top: 12px;
    font-size: 12px;
    color: #333;
    line-height: 1.7;
    font-style: italic;
  }

  /* ── SECTIONS ── */
  .section {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #1a1a1a;
    font-family: 'Arial', sans-serif;
    margin-bottom: 10px;
    padding-bottom: 4px;
    border-bottom: 1px solid #ccc;
  }

  /* ── ITEMS ── */
  .item {
    margin-bottom: 12px;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .item-title {
    font-size: 13px;
    font-weight: 700;
    color: #1a1a1a;
    font-family: 'Arial', sans-serif;
  }

  .item-date {
    font-size: 11px;
    color: #666;
    font-family: 'Arial', sans-serif;
  }

  .item-sub {
    font-size: 12px;
    color: #555;
    font-style: italic;
    margin-top: 1px;
  }

  .item-desc {
    font-size: 11.5px;
    color: #333;
    margin-top: 5px;
    line-height: 1.65;
    font-family: 'Arial', sans-serif;
  }

  .item-link {
    font-size: 11px;
    color: #444;
    margin-top: 3px;
    font-family: 'Arial', sans-serif;
  }

  /* ── SKILLS ── */
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .chip {
    font-size: 11px;
    font-family: 'Arial', sans-serif;
    background: #f5f5f5;
    color: #1a1a1a;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 10px;
  }

  /* ── LANGUAGES ── */
  .lang-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px dotted #ddd;
    font-family: 'Arial', sans-serif;
  }

  .lang-row:last-child { border-bottom: none; }

  .lang-name {
    font-size: 12px;
    color: #1a1a1a;
    font-weight: 600;
  }

  .lang-level {
    font-size: 11px;
    color: #555;
  }
</style>
</head>
<body>

<div class="header">
  <div class="header-name">${personal.name || ""}</div>
  ${personal.title ? `<div class="header-title">${personal.title}</div>` : ""}
  <div class="header-contacts">
    ${personal.email ? `<span class="header-contact">${personal.email}</span>` : ""}
    ${personal.phone ? `<span class="header-contact">${personal.phone}</span>` : ""}
    ${personal.location ? `<span class="header-contact">${personal.location}</span>` : ""}
  </div>
  ${personal.summary ? `<div class="header-summary">${personal.summary}</div>` : ""}
</div>

${section("Work Experience", workHTML)}
${section("Education", eduHTML)}
${section("Skills", skillsHTML)}
${section("Languages", langHTML)}
${section("Projects", projHTML)}
${section("Certificates", certHTML)}

</body>
</html>`;
}

// ─────────────────────────────────────────────
// TEMPLATE 2 — Elegant top header + two columns
// ─────────────────────────────────────────────
function buildTemplate2({
  personal,
  work,
  education,
  skills,
  languages,
  projects,
  certificates,
}) {
  const workHTML = work
    .map(
      (w) => `
    <div class="item">
      <div class="item-row">
        <span class="item-title">${w.position || ""}</span>
        <span class="item-date">${w.startDate || ""} – ${w.endDate || ""}</span>
      </div>
      <div class="item-company">${w.company || ""}${w.location ? " · " + w.location : ""}</div>
      ${w.description ? `<div class="item-desc">${w.description}</div>` : ""}
    </div>`,
    )
    .join("");

  const eduHTML = education
    .map(
      (e) => `
    <div class="item">
      <div class="item-row">
        <span class="item-title">${e.school || ""}</span>
        <span class="item-date">${e.startYear || ""} – ${e.endYear || ""}</span>
      </div>
      <div class="item-company">${e.degree || ""}${e.field ? " · " + e.field : ""}</div>
    </div>`,
    )
    .join("");

  const skillsHTML = skills
    .map((s) => `<span class="skill-tag">${s}</span>`)
    .join("");

  const langHTML = languages
    .map(
      (l) => `
    <div class="lang-row">
      <span class="lang-name">${l.name || ""}</span>
      <span class="lang-level">${l.level || ""}</span>
    </div>`,
    )
    .join("");

  const projHTML = projects
    .map(
      (p) => `
    <div class="item">
      <div class="item-title">${p.title || ""}</div>
      ${p.description ? `<div class="item-desc">${p.description}</div>` : ""}
      ${p.link ? `<div class="item-link">${p.link}</div>` : ""}
    </div>`,
    )
    .join("");

  const certHTML = certificates
    .map(
      (c) => `
    <div class="item">
      <div class="item-row">
        <span class="item-title">${c.title || ""}</span>
        <span class="item-date">${c.year || ""}</span>
      </div>
      <div class="item-company">${c.issuer || ""}</div>
    </div>`,
    )
    .join("");

  const colSection = (title, content) => `
    <div class="col-section">
      <div class="col-title">${title}</div>
      ${content}
    </div>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    background: #fff;
    color: #1e1e2e;
  }

  .header {
    background: linear-gradient(135deg, #1e1e2e 0%, #2d2b55 50%, #1e1e2e 100%);
    padding: 40px 48px 32px;
    position: relative;
    overflow: hidden;
  }

  .header::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.15);
  }

  .header::after {
    content: '';
    position: absolute;
    bottom: -30px; left: 30%;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.1);
  }

  .header-name {
    font-size: 36px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -1px;
    line-height: 1;
  }

  .header-name span { color: #818cf8; }

  .header-role {
    font-size: 14px;
    color: #a5b4fc;
    font-weight: 400;
    margin-top: 6px;
    letter-spacing: 0.5px;
  }

  .header-contacts {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 16px;
  }

  .header-contact-item {
    font-size: 11px;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .header-contact-item::before {
    content: '▸';
    color: #6366f1;
    font-size: 10px;
  }

  .header-summary {
    margin-top: 14px;
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.7;
    max-width: 600px;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 12px;
  }

  .body {
    display: flex;
  }

  .left-col {
    width: 58%;
    padding: 28px 28px 28px 48px;
    border-right: 1px solid #f1f5f9;
  }

  .right-col {
    width: 42%;
    padding: 28px 48px 28px 28px;
    background: #fafafa;
  }

  .col-section { margin-bottom: 24px; }

  .col-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #6366f1;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .col-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  .item {
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f1f5f9;
  }

  .item:last-child { border-bottom: none; }

  .item-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 6px;
  }

  .item-title {
    font-size: 13px;
    font-weight: 600;
    color: #1e1e2e;
  }

  .item-date {
    font-size: 10px;
    color: #fff;
    background: #6366f1;
    padding: 2px 8px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .item-company {
    font-size: 11px;
    color: #6366f1;
    font-weight: 500;
    margin-top: 2px;
  }

  .item-desc {
    font-size: 11px;
    color: #64748b;
    margin-top: 5px;
    line-height: 1.6;
  }

  .item-link {
    font-size: 10px;
    color: #6366f1;
    margin-top: 3px;
  }

  .skills-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .skill-tag {
    font-size: 10px;
    font-weight: 500;
    background: #eef2ff;
    color: #4f46e5;
    border-radius: 6px;
    padding: 4px 10px;
    border: 1px solid #c7d2fe;
  }

  .lang-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px dashed #e2e8f0;
  }

  .lang-row:last-child { border-bottom: none; }

  .lang-name {
    font-size: 12px;
    font-weight: 500;
    color: #1e1e2e;
  }

  .lang-level {
    font-size: 10px;
    color: #6366f1;
    font-weight: 600;
    background: #eef2ff;
    padding: 2px 8px;
    border-radius: 20px;
  }
</style>
</head>
<body>

<div class="header">
  <div class="header-name">
    ${(personal.name || "").split(" ").slice(0, -1).join(" ")}
    <span> ${(personal.name || "").split(" ").slice(-1).join("")}</span>
  </div>
  ${personal.title ? `<div class="header-role">${personal.title}</div>` : ""}
  <div class="header-contacts">
    ${personal.email ? `<div class="header-contact-item">${personal.email}</div>` : ""}
    ${personal.phone ? `<div class="header-contact-item">${personal.phone}</div>` : ""}
    ${personal.location ? `<div class="header-contact-item">${personal.location}</div>` : ""}
  </div>
  ${personal.summary ? `<div class="header-summary">${personal.summary}</div>` : ""}
</div>

<div class="body">
  <div class="left-col">
    ${work.length ? colSection("Work Experience", workHTML) : ""}
    ${education.length ? colSection("Education", eduHTML) : ""}
    ${projects.length ? colSection("Projects", projHTML) : ""}
  </div>
  <div class="right-col">
    ${skills.length ? colSection("Skills", `<div class="skills-wrap">${skillsHTML}</div>`) : ""}
    ${languages.length ? colSection("Languages", langHTML) : ""}
    ${certificates.length ? colSection("Certificates", certHTML) : ""}
  </div>
</div>

</body>
</html>`;
}
