const express = require('express');
const router = express.Router();
const {
    getCollections,
    createCollection,
    deleteCollection,
    getBooksFromCollection,
    addBookToCollection,
    removeBookFromCollection
} = require('../controllers/collectionController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *      name: Collections
 *      description: API for managing collections
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all collections of the user
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user collections
 */
router.get('/', authMiddleware, getCollections);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new collection
 *     tags: [Collections]
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
 *     responses:
 *       201:
 *         description: Collection created successfully
 *       409:
 *         description: Collection name already exists
 */
router.post('/', authMiddleware, createCollection);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a collection by ID
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Collection deleted successfully
 *       404:
 *         description: Collection not found or not authorized to delete
 */
router.delete('/:id', authMiddleware, deleteCollection);

/**
 * @swagger
 * /{id}/books:
 *   get:
 *     summary: Get books from a specific collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Books in the collection
 *       404:
 *         description: Collection not found or not authorized
 */
router.get('/:id/books', authMiddleware, getBooksFromCollection);

/**
 * @swagger
 * /{id}/books:
 *   post:
 *     summary: Add a book to a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book added to collection
 *       404:
 *         description: Collection or book not found
 */
router.post('/:id/books', authMiddleware, addBookToCollection);

/**
 * @swagger
 * /{id}/books/{bookId}:
 *   delete:
 *     summary: Remove a book from a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Book removed from collection
 *       404:
 *         description: Collection not found or not authorized
 */
router.delete('/:id/books/:bookId', authMiddleware, removeBookFromCollection);

module.exports = router;
