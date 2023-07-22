import express from 'express'
export const userRoutes = express.Router();

const {
  registerUser,
  loginUser,
  getMe
} = require("../controllers/userController");

userRoutes.route("/").post(registerUser);
userRoutes.route("/login").post(loginUser);
userRoutes.route("/me").get(getMe);

