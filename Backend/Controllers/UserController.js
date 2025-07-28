const User = require("../Model/UserModel");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role, fullName: user.fullName }, "secretkey", { expiresIn: "1d" });

    res.status(200).json({ token, role: user.role, fullName: user.fullName });
  }catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      message: "Registration failed",
      error: err.message 
  });
}
};
