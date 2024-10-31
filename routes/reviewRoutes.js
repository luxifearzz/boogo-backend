// routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const { createReview, getReviewsByBook, deleteReviewsById } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');
const subscriptionRequiredMiddleware = require('../middlewares/subscriptionRequiredMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

/**
 * @swagger
 * /reviews/{bookId}:
 *   post:
 *     summary: Create a new review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       409:
 *         description: Review already exists for this book by the user
 *       404:
 *         description: Book not found
 */
router.post('/:bookId', authMiddleware, subscriptionRequiredMiddleware, createReview);

/**
 * @swagger
 * /reviews/{bookId}:
 *   get:
 *     summary: Retrieve all reviews for a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: List of reviews for the book
 */
router.get('/:bookId', getReviewsByBook);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: No review found
 */
router.delete('/:reviewId', authMiddleware, adminMiddleware, deleteReviewsById);

module.exports = router;
