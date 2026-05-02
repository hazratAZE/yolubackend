const router = require("express").Router();

router.get("/ping", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "pong",
    time: new Date().toISOString(),
  });
});
const LATEST_VERSION = "1.8.0"; // 🔥 server version

// version compare helper
function isLowerVersion(client, server) {
  const c = client.split(".").map(Number);
  const s = server.split(".").map(Number);

  for (let i = 0; i < Math.max(c.length, s.length); i++) {
    const cv = c[i] || 0;
    const sv = s[i] || 0;

    if (cv < sv) return true;
    if (cv > sv) return false;
  }

  return false;
}

router.get("/check-version", (req, res) => {
  const clientVersion = req.query.version;

  if (!clientVersion) {
    return res.status(400).json({
      success: false,
      message: "version is required",
    });
  }

  const forceUpdate = isLowerVersion(clientVersion, LATEST_VERSION);

  return res.status(200).json({
    success: true,
    forceUpdate,
    latestVersion: LATEST_VERSION,
  });
});
module.exports = router;
