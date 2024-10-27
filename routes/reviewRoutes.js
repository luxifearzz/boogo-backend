const express = require('express');
const router = express.Router();
const { createReview, getReviewsByBook } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// POST สำหรับสร้างรีวิวใหม่
router.post('/', authMiddleware, createReview);

// GET สำหรับดึงรีวิวของหนังสือ
router.get('/:book_id', getReviewsByBook);

module.exports = router;
