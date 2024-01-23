require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }], //This is referring to the Todo in the todo.js
  },
  {
    timestamps: true, //To keep track when someone creates a user when it gets created or modified
  }
);

userSchema.pre("save", async function (next) {
  this.isModified("password")
    ? (this.password = await bcrypt.hash(this.password, 8))
    : null;
  next();
});

userSchema.methods.generateAuthToken = async function () {
  //this is for anytime we have a document that is a user, we can call generate auth token on it,
  //which will do the below function.
  const token = jwt.sign({ _id: this._id }, process.env.SECRET);
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
