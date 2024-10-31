// routes/authorRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { 
    getAuthors, getAuthorById, createAuthor, updateAuthorById, deleteAuthorById, addBookToAuthor, removeBookFromAuthor 
} = require('../controllers/authorController');

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: API for managing authors
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: A list of authors
 *       500:
 *         description: Server error
 */
router.get('/', getAuthors);

/**
 * @swagger
 * /authors/{authorId}:
 *   get:
 *     summary: Get an author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the author
 *     responses:
 *       200:
 *         description: The author data
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.get('/:authorId', getAuthorById);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
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
 *               biography:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               nationality:
 *                 type: string
 *               booksWritten:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Author already exists
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, adminMiddleware, createAuthor);

/**
 * @swagger
 * /authors/{authorId}:
 *   patch:
 *     summary: Update an author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               biography:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               nationality:
 *                 type: string
 *               booksWritten:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.patch('/:authorId', authMiddleware, adminMiddleware, updateAuthorById);

/**
 * @swagger
 * /authors/{authorId}:
 *   delete:
 *     summary: Delete an author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.delete('/:authorId', authMiddleware, adminMiddleware, deleteAuthorById);

/**
 * @swagger
 * /authors/{authorId}/books:
 *   post:
 *     summary: Add books to an author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Books added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.post('/:authorId/books', authMiddleware, adminMiddleware, addBookToAuthor);

/**
 * @swagger
 * /authors/{authorId}/books/{bookId}:
 *   delete:
 *     summary: Remove a book from an author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed successfully
 *       400:
 *         description: Book not found in author's collection
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */
router.delete('/:authorId/books/:bookId', authMiddleware, adminMiddleware, removeBookFromAuthor);

module.exports = router;