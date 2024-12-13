const User = require("../model/user");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getRegisterForm = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
};

exports.postRegisterForm = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User Already exist, Try with new Email" });
    }
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.log("err:", err);
      }
      const user = new User({
        name: name,
        email: email,
        password: hash,
      });
      await user.save();

      res.status(201).json({ message: "Successfully created new user" });
    });
  } catch (err) {
    console.log("User not Created", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, process.env.TOKEN_SECRET);
}

exports.postLoginForm = async (req, res, next) => {
  try {
    console.log(req.body);
    const userAvailable = await User.findOne({ email: req.body.email });
    if (userAvailable) {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        userAvailable.password
      );

      if (isPasswordValid) {
        console.log("login successful");
        res
          .status(200)
          .json({
            message: "logged in",
            token: generateAccessToken(userAvailable._id),
          });
      } else {
        console.log("Password Wrong");
        res.status(401).json({ message: "User not authorized" });
      }
    } else {
      console.log("not logged in");
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal error" });
  }
};
