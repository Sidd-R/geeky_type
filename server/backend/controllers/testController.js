const asyncHandler = require("express-async-handler");
const Test = require("../models/testModel");
const User = require("../models/userModel");

const getAllTests = asyncHandler(async (req, res) => {
  const tests = await Test.find({ userId: req.body.id });

  res.status(200).json(tests);
});

const newTest = asyncHandler(async (req, res) => {
  if (!req.body.id) {
    res.status(400).json({ error: "Test not Valid" });
    return;
  }

  const user = await User.findById(req.body.id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const prevScoreSum = parseFloat(user.avgScore) * parseInt(user.noOfTests);

  user.noOfTests = parseInt(user.noOfTests) + 1;

  user.avgScore = (prevScoreSum + parseFloat(req.body.score)) / parseInt(user.noOfTests);
  await user.save();

  if (req.body.score > parseInt(user.maxScore)) {
    user.maxScore = parseInt(req.body.score);
    await user.save();
  }

  const test = await Test.create({
    userId: req.body.id,
    testNo: user.noOfTests,
    score: parseInt(req.body.score),
  });

  res.status(200).json(test);
});

module.exports = {
  getAllTests,
  newTest,
};
