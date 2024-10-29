// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchBooks } = require('../controllers/searchController');

// สร้างเส้นทาง API สำหรับการค้นหาหนังสือ
router.get('/:query', searchBooks);

module.exports = router;
