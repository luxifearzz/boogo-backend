// routes/searchRoutes.js

const express = require('express');
const router = express.Router();
const { searchBooks } = require('../controllers/searchController');

/**
 * @swagger
 * /search/{query}:
 *   get:
 *     summary: Search for books by title or keywords
 *     tags: [Search]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query for the book title or keywords
 *     responses:
 *       200:
 *         description: A list of books matching the search criteria
 *       500:
 *         description: Error searching books
 */
router.get('/:query', searchBooks);

module.exports = router;
