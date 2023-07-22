import asyncHandler from "express-async-handler";
const Test = require("../models/testModel");
const User = require("../models/userModel");

const getAllTests = asyncHandler(async (req, res) => {
  const tests = await Test.find({ userId: req.body.id });

  res.status(200).json(tests);
});

const allTests = asyncHandler(async (req, res) => {
  try {
    const avgScoreResult = await Test.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$score" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          avgScore: 1,
          count: 1,
        },
      },
    ]);

    const tests = await Test.find();

    const testsWithUserName = await Promise.all(
      tests.map(async (test:any) => {
        const user = await User.findById(test.userId);
        const userName = user ? user.name : "Unknown User";
        const userEmail = user ? user.email : "Unknown User";
        return {
          ...test._doc,
          userName,
          userEmail
        };
      })
    );

    res.status(200).json({
      avgScore: avgScoreResult.length ? avgScoreResult[0].avgScore : 0,
      noOfTests: avgScoreResult.length ? avgScoreResult[0].count : 0,
      testsWithUserName,
    });
  } catch (error:any) {
    res.status(500).json({ message: "Failed to fetch test data." });
    console.log('====================================');
    console.log(error.message);
    console.log('====================================');
  }
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

export default {
  getAllTests,
  newTest,
  allTests
}
