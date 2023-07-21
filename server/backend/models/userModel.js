const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    maxScore: {
      type: Number,
      default: 0, 
    },
    avgScore: {
      type: Number,
      default: 0, 
    },
    noOfTests: {
      type: Number,
      default: 0, // Default value is set to 0
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);