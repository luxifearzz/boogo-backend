// routes/collectionRoutes.js
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
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware สำหรับตรวจสอบ JWT

// GET all collections
router.get('/', authMiddleware, getCollections);

// เส้นทาง POST สำหรับการสร้างคอลเล็กชันใหม่
router.post('/', authMiddleware, createCollection); // ตรวจสอบว่า createCollection ถูกต้อง

router.delete('/:id', authMiddleware, deleteCollection)

// GET all book from collections
router.get('/:id/books', authMiddleware, getBooksFromCollection);

// เส้นทาง POST สำหรับเพิ่มหนังสือในคอลเล็กชัน
router.post('/:id/books', authMiddleware, addBookToCollection); // ตรวจสอบว่า addBookToCollection ถูกต้อง

// เส้นทาง DELETE สำหรับลบหนังสือออกจากคอลเล็กชัน
router.delete('/:id/books/:bookId', authMiddleware, removeBookFromCollection); // ตรวจสอบว่า removeBookFromCollection ถูกต้อง

module.exports = router;
