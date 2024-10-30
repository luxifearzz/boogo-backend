// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware')
const adminMiddleware = require('../middlewares/adminmiddleware')
const subscriptionRequiredMiddleware = require('../middlewares/subscriptionRequiredmiddleware')
const { getBooks, getBookDetailsById, createBook, updateBookById, deleteBook, createBookContent, getBookContent, updateBookContent, deleteBookContent, addGenresToBook, getBookChapters } = require('../controllers/bookController');

router.get('/', getBooks);

router.get('/:bookId', getBookDetailsById)

router.get('/:bookId/chapters', getBookChapters)

router.post('/', authMiddleware, adminMiddleware, createBook);

router.patch('/:bookId', authMiddleware, adminMiddleware, updateBookById)

router.delete('/:bookId', authMiddleware, adminMiddleware, deleteBook)

router.post('/:bookId/genres', authMiddleware, adminMiddleware, addGenresToBook)

router.post('/:bookId/contents', authMiddleware, adminMiddleware, createBookContent)

router.get('/:bookId/contents/:chapterNo?', authMiddleware, subscriptionRequiredMiddleware, getBookContent)

router.patch('/:bookId/contents/:chapterNo', authMiddleware, adminMiddleware, updateBookContent)

router.delete(':bookId/contents/:chapterNo', authMiddleware, adminMiddleware, deleteBookContent)

module.exports = router;
