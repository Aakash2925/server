const { createResult, getClassResult } = require("../controllers/resultController");

const router = require("express").Router();

router.post("/createResult", createResult);
router.post("/get_classResult", getClassResult);
module.exports = router;