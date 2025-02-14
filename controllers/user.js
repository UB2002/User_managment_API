const User = require("../models/user");

exports.getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

exports.createUser = async (req, res) => {
  const { name, email, role } = req.body;
  const user = new User({ name, email, role, password: "temp123" });
  await user.save();
  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
};
