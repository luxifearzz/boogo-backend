// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const logoutMiddleware = require('../middlewares/logoutmiddleware')
const { registerUser, loginUser, getUserInfo, logout, getLoginInfo, getRegisterInfo } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authmiddleware');

router.get('/register', logoutMiddleware, getRegisterInfo)

// เส้นทาง POST สำหรับการลงทะเบียนผู้ใช้
router.post('/register', logoutMiddleware, registerUser);

router.get('/login', logoutMiddleware, getLoginInfo)

// เส้นทาง POST สำหรับการเข้าสู่ระบบผู้ใช้
router.post('/login', logoutMiddleware, loginUser);

// GET User Info
router.get('/info', authMiddleware, getUserInfo);

// log out
router.get('/logout', authMiddleware, logout);

module.exports = router;
