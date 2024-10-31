// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const logoutMiddleware = require('../middlewares/logoutMiddleware');
const {
  registerUser,
  loginUser,
  getUserInfo,
  logout,
  getLoginInfo,
  getRegisterInfo,
  isLoggedIn,
  isLoggedOut,
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API for user authentication and authorization
 */

/**
 * @swagger
 * /auth/isLoggedIn:
 *   get:
 *     summary: Check if the user is logged in
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is logged in
 *       401:
 *         description: Unauthorized
 */
router.get('/isLoggedIn', authMiddleware, isLoggedIn);

/**
 * @swagger
 * /auth/isLoggedOut:
 *   get:
 *     summary: Check if the user is logged out
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User is logged out
 */
router.get('/isLoggedOut', logoutMiddleware, isLoggedOut);

/**
 * @swagger
 * /auth/register:
 *   get:
 *     summary: Get information on how to register
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Registration information
 */
router.get('/register', logoutMiddleware, getRegisterInfo);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already registered
 */
router.post('/register', logoutMiddleware, registerUser);

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Get login information
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login information
 */
router.get('/login', logoutMiddleware, getLoginInfo);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials or user not found
 */
router.post('/login', logoutMiddleware, loginUser);

/**
 * @swagger
 * /auth/info:
 *   get:
 *     summary: Get user information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *       404:
 *         description: User not found
 */
router.get('/info', authMiddleware, getUserInfo);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get('/logout', authMiddleware, logout);

module.exports = router;