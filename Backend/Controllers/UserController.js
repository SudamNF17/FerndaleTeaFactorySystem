const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST - Register
exports.register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// POST - Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, fullName: user.fullName },
      "secretkey",  // For production, use environment variables for secrets!
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, role: user.role, fullName: user.fullName });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// GET - All users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password field
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// GET - Single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

// PUT - Update user by ID
exports.updateUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    const updatedData = { fullName, email, role };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

// DELETE - Remove user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};
