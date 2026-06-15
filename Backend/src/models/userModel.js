const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, "Username already exist"],
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already exist"],
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
