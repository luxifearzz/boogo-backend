// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    publishedYear: {
        type: Number,
        required: true,
    },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true }],
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true }],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    chapters: [{
        chapter_number: { type: Number, required: true },
        title: { type: String, required: true },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    keywords: {
        type: [String], // คำสำคัญที่เกี่ยวข้องกับหนังสือ
    },
    readCount: {
        type: Number,
        default: 0, // จำนวนการอ่านหนังสือเริ่มต้นเป็น 0
    },
    averageRating: {
        type: Number,
        default: 0, // คะแนนเฉลี่ยเริ่มต้นเป็น 0
    },
    popularityScore: {
        type: Number,
        default: 0, // คะแนนความนิยมเริ่มต้นเป็น 0
    },
});

// สร้างโมเดล Book
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
