const express = require("express");
const cors = require("cors");
const systemRoutes = require("./routes/system.routes");

const cvRoutes = require("./routes/cv.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cv", cvRoutes);
app.use("/api/system", systemRoutes);

module.exports = app;
