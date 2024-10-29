// controllers/searchController.js
const Book = require('../models/Book');

const searchBooks = async (req, res) => {
    const { query } = req.params;

    try {
        // ค้นหาหนังสือที่มี title หรือ keywords ที่คล้ายกับคำค้นหา
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // ค้นหา title ที่คล้ายกับคำค้นหา (ไม่คำนึงถึงตัวพิมพ์เล็กพิมพ์ใหญ่)
                { keywords: { $regex: query, $options: 'i' } } // ค้นหา keywords ที่คล้ายกับคำค้นหา (ไม่คำนึงถึงตัวพิมพ์เล็กพิมพ์ใหญ่)
            ]
        });

        return res.json(books);
    } catch (error) {
        return res.status(500).json({ message: 'Error searching books', error: error.message });
    }
};

module.exports = {
    searchBooks
};
