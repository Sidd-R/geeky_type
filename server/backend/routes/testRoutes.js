const express = require("express");
const router = express.Router();

const {
    getAllTests,
    newTest,
} = require("../controllers/testController");

router.route("/").get(getAllTests);
router.route("/new").post(newTest);


module.exports = router;