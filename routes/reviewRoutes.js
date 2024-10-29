const express = require('express');
const router = express.Router();
const { createReview, getReviewsByBook, deleteReviewsById } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const subscriptionRequiredMiddleware = require('../middleware/subscriptionRequiredMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// POST สำหรับสร้างรีวิวใหม่
router.post('/:bookId', authMiddleware, subscriptionRequiredMiddleware, createReview);

// GET สำหรับดึงรีวิวของหนังสือ
router.get('/:bookId', getReviewsByBook);

router.delete('/:reviewId', authMiddleware, adminMiddleware, deleteReviewsById)

module.exports = router;
