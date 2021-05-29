const User = require("../models/userModel");
const argon2 = require("argon2");

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    const newUser = { username, password: hashedPassword };
    const user = await User.create(newUser);
    req.session.user = user;
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({ status: "fail" });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    if (user && (await argon2.verify(user.password, password))) {
      req.session.user = user;
      res.status(200).json({ status: "success" });
    } else
      res
        .status(400)
        .json({ status: "fail", message: "incorrect username or password" });
  } catch (error) {
    res.status(400).json({ status: "fail" });
  }
};
