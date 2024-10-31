// routes/genreRoutes.js

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const {
    getAllGenres,
    getGenreById,
    createGenre,
    updateGenreById,
    deleteGenreById,
    addBooksToGenre,
} = require('../controllers/genreController');

/**
 * @swagger
 * /genres:
 *   post:
 *     summary: Create a new genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               imageURL:
 *                 type: string
 *               description:
 *                 type: string
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Book ID
 *     responses:
 *       201:
 *         description: Genre created successfully
 */
router.post('/', authMiddleware, adminMiddleware, createGenre);

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Retrieve all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: List of genres
 */
router.get('/', getAllGenres);

/**
 * @swagger
 * /genres/{id}:
 *   get:
 *     summary: Retrieve a genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre details
 *       404:
 *         description: Genre not found
 */
router.get('/:id', getGenreById);

/**
 * @swagger
 * /genres/{id}:
 *   patch:
 *     summary: Update a genre by ID
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               imageURL:
 *                 type: string
 *               description:
 *                 type: string
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Book ID
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       404:
 *         description: Genre not found
 */
router.patch('/:id', authMiddleware, adminMiddleware, updateGenreById);

/**
 * @swagger
 * /genres/{id}:
 *   delete:
 *     summary: Delete a genre by ID
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *       404:
 *         description: Genre not found
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteGenreById);

/**
 * @swagger
 * /genres/{genreId}/books:
 *   post:
 *     summary: Add books to a genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: genreId
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Book ID
 *     responses:
 *       200:
 *         description: Books added to genre successfully
 *       400:
 *         description: Invalid request or book IDs
 *       404:
 *         description: Genre not found
 */
router.post('/:genreId/books', authMiddleware, adminMiddleware, addBooksToGenre);

module.exports = router;
