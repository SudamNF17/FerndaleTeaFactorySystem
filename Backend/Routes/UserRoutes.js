const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, getUserById, updateUser, deleteUser } = require('../Controllers/UserController');
const jwt = require('jsonwebtoken');

// Middleware to verify token
function verifyToken(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, "secretkey"); // same key as in UserController
        req.user = decoded; // id, role, fullName
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// Middleware to allow only HR Manager
function requireHRManager(req, res, next) {
    if (req.user.role !== "HRManager") {
        return res.status(403).json({ message: "Forbidden: HR Manager only" });
    }
    next();
}

// Routes
router.post('/register', register);
router.post('/login', login);

// Protected route: only HR Manager can view all users
router.get('/', verifyToken, requireHRManager, getAllUsers);

router.get('/:id', verifyToken, requireHRManager, getUserById);
router.put('/:id', verifyToken, requireHRManager, updateUser);
router.delete('/:id', verifyToken, requireHRManager, deleteUser);

module.exports = router;
