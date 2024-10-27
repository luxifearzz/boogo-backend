// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const logoutMiddleware = require('../middleware/logoutMiddleware')
const { registerUser, loginUser, getUserInfo, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// เส้นทาง POST สำหรับการลงทะเบียนผู้ใช้
router.post('/register', logoutMiddleware, registerUser);

// เส้นทาง POST สำหรับการเข้าสู่ระบบผู้ใช้
router.post('/login', logoutMiddleware, loginUser);

// GET User Info
router.get('/info', authMiddleware, getUserInfo);

// log out
router.get('/logout', authMiddleware, logout);

module.exports = router;
