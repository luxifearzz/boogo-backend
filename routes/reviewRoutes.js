const express = require('express');
const router = express.Router();
const { createReview, getReviewsByBook, deleteReviewsById } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');
const subscriptionRequiredMiddleware = require('../middlewares/subscriptionRequiredMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// POST สำหรับสร้างรีวิวใหม่
router.post('/:bookId', authMiddleware, subscriptionRequiredMiddleware, createReview);

// GET สำหรับดึงรีวิวของหนังสือ
router.get('/:bookId', getReviewsByBook);

router.delete('/:reviewId', authMiddleware, adminMiddleware, deleteReviewsById)

module.exports = router;
