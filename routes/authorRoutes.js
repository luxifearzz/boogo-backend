// routes/authorRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const { getAuthors, getAuthorById, createAuthor, updateAuthorById, deleteAuthorById, addBookToAuthor, removeBookFromAuthor } = require('../controllers/authorController');

router.get('/', authMiddleware, getAuthors);

router.get('/:authorId', authMiddleware, getAuthorById);

router.post('/', authMiddleware, adminMiddleware, createAuthor);

router.patch('/:authorId', authMiddleware, adminMiddleware, updateAuthorById)

router.delete('/:authorId', authMiddleware, adminMiddleware, deleteAuthorById);

router.post('/:authorId/books', authMiddleware, adminMiddleware, addBookToAuthor)

router.delete('/:authorId/books/:bookId', authMiddleware, adminMiddleware, removeBookFromAuthor)

module.exports = router;
