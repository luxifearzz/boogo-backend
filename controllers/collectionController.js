// controllers/collectionController.js
const Book = require('../models/Book');
const Collection = require('../models/Collection');
const User = require('../models/User');

// ดึงข้อมูลคอลเล็กชันทั้งหมดของผู้ใช้
const getCollections = async (req, res) => {
    const user_id = req.user.id;

    try {
        const collections = await Collection.find({ user_id }).populate('books', 'title');
        res.json(collections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// สร้างคอลเล็กชันใหม่
const createCollection = async (req, res) => {
    const { name } = req.body;
    const user_id = req.user.id;

    try {
        const collection = new Collection({ user_id, name });
        const newCollection = await collection.save();
        return res.status(201).json(newCollection);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// ลบคอลเล็กชันของผู้ใช้
const deleteCollection = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const collection = await Collection.findOne({ _id: id, user_id });
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found or not authorized to delete' });
        }

        await Collection.deleteOne({ _id: id });
        return res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// ดึงหนังสือในคอลเล็กชันที่กำหนด
const getBooksFromCollection = async (req, res) => {
    const { id } = req.params;

    try {
        const collection = await Collection.findById(id)
        if (!collection) return res.status(404).json({ message: 'Collection not found' });

        const books = await Book.find({ _id: { $in: collection.books } }).populate('genres', 'name').populate('authors', 'name');
        if (books.length === 0) {
            return res.status(200).json({ message: 'No books in this collection' });
        }

        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// เพิ่มหนังสือในคอลเล็กชัน
const addBookToCollection = async (req, res) => {
    const { id } = req.params;
    const { book_id } = req.body;
    const user_id = req.user.id;

    try {
        const collection = await Collection.findOne({ _id: id, user_id });
        if (!collection) return res.status(404).json({ message: 'Collection not found or not authorized' });

        // ตรวจสอบว่า `book_id` มีอยู่ในฐานข้อมูลหรือไม่
        const bookExists = await Book.exists({ _id: book_id });
        if (!bookExists) return res.status(404).json({ message: 'Book not found' });

        // ใช้ `$addToSet` เพื่อเพิ่มหนังสือและป้องกันการซ้ำซ้อน
        await Collection.updateOne(
            { _id: id, user_id },
            { $addToSet: { books: book_id } }
        );

        const updatedCollection = await Collection.findById(id).populate('books', 'title');
        return res.status(201).json(updatedCollection);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// ลบหนังสือออกจากคอลเล็กชัน
const removeBookFromCollection = async (req, res) => {
    const { id, bookId } = req.params;
    const user_id = req.user.id;

    try {
        const collection = await Collection.findOne({ _id: id, user_id });
        if (!collection) return res.status(404).json({ message: 'Collection not found or not authorized' });

        // ใช้ `$pull` เพื่อลบหนังสือที่กำหนดออกจากคอลเล็กชัน
        await Collection.updateOne(
            { _id: id, user_id },
            { $pull: { books: bookId } }
        );

        const updatedCollection = await Collection.findById(id);
        return res.status(200).json(updatedCollection);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getCollections,
    createCollection,
    deleteCollection,
    getBooksFromCollection,
    addBookToCollection,
    removeBookFromCollection,
};
