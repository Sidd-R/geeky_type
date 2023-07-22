const express = require("express");
const router = express.Router();

const {
    getAllTests,
    newTest,
    allTests
} = require("../controllers/testController");

router.route("/").get(getAllTests);
router.route("/new").post(newTest);
router.route("/all").get(allTests);


module.exports = router;