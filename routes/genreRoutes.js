// routes/genreRoutes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const {
    getAllGenres,
    getGenreById,
    createGenre,
    updateGenreById,
    deleteGenreById,
    addBooksToGenre,
} = require('../controllers/genreController');

// สร้าง Genre ใหม่
router.post('/', authMiddleware, adminMiddleware, createGenre);

// ดึงข้อมูล Genre ทั้งหมด
router.get('/', getAllGenres);

// ดึงข้อมูล Genre โดยใช้ ID
router.get('/:id', getGenreById);

// อัปเดต Genre โดยใช้ ID
router.patch('/:id', authMiddleware, adminMiddleware, updateGenreById);

// ลบ Genre โดยใช้ ID
router.delete('/:id', authMiddleware, adminMiddleware, deleteGenreById);

router.post('/:genreId/books', authMiddleware, adminMiddleware, addBooksToGenre)

module.exports = router;
