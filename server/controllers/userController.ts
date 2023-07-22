const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Test = require("../models/testModel");
const mongoose = require("mongoose");
import {Request,Response} from 'express'

const registerUser = asyncHandler(async (req:Request, res:Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please enter a valid email address");
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req:Request, res:Response) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      maxScore: user.maxScore,
      avgScore: user.avgScore,
      noOfTests: user.noOfTests,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

const getMe = asyncHandler(async (req:Request, res:Response) => {
  const { id } = req.query;

  const user = await User.findById(id);

  if (user) {
    const allTestData = await Test.find({ userId: id });
    const sortedTestData = allTestData.sort((a:any, b:any) => b.testNo - a.testNo);
    
    const top20RecentTestData = sortedTestData.slice(0, 20);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      maxScore: user.maxScore,
      avgScore: user.avgScore,
      noOfTests: user.noOfTests,
      top20RecentTestData,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const generateToken = (id:string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};