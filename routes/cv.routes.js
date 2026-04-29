const router = require("express").Router();
const cvController = require("../controllers/cv.controller");

router.post("/generate", cvController.generateCV);

module.exports = router;
