// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const subscriptionRequiredMiddleware = require('../middleware/subscriptionRequiredMiddleware')
const { getBooks, getBookDetailsById, createBook, updateBookById, deleteBook, createBookContent, getBookContent, updateBookContent, deleteBookContent } = require('../controllers/bookController');

router.get('/', getBooks);

router.get('/:bookId', getBookDetailsById)

router.post('/', authMiddleware, adminMiddleware, createBook);

router.patch('/:bookId', authMiddleware, adminMiddleware, updateBookById)

router.delete('/:bookId', authMiddleware, adminMiddleware, deleteBook)

router.post('/:bookId/chapters', authMiddleware, adminMiddleware, createBookContent)

router.get('/:bookId/chapters/:chapterNo', authMiddleware, subscriptionRequiredMiddleware, getBookContent)

router.patch('/:bookId/chapters/:chapterNo', authMiddleware, adminMiddleware, updateBookContent)

router.delete(':bookId/chapters/:chapterNo', authMiddleware, adminMiddleware, deleteBookContent)

module.exports = router;
