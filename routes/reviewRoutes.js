const express = require('express');
const router = express.Router();
const { createReview, getReviewsByBook, deleteReviewsById } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authmiddleware');
const subscriptionRequiredMiddleware = require('../middlewares/subscriptionRequiredmiddleware');
const adminMiddleware = require('../middlewares/adminmiddleware');

// POST สำหรับสร้างรีวิวใหม่
router.post('/:bookId', authMiddleware, subscriptionRequiredMiddleware, createReview);

// GET สำหรับดึงรีวิวของหนังสือ
router.get('/:bookId', getReviewsByBook);

router.delete('/:reviewId', authMiddleware, adminMiddleware, deleteReviewsById)

module.exports = router;
