// routes/authorRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const { getAuthors, getAuthorById, createAuthor, updateAuthorById, deleteAuthorById, addBookToAuthor, removeBookFromAuthor } = require('../controllers/authorController');

router.get('/', getAuthors);

router.get('/:authorId', getAuthorById);

router.post('/', authMiddleware, adminMiddleware, createAuthor);

router.patch('/:authorId', authMiddleware, adminMiddleware, updateAuthorById)

router.delete('/:authorId', authMiddleware, adminMiddleware, deleteAuthorById);

router.post('/:authorId/books', authMiddleware, adminMiddleware, addBookToAuthor)

router.delete('/:authorId/books/:bookId', authMiddleware, adminMiddleware, removeBookFromAuthor)

module.exports = router;
