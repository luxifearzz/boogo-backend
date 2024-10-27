const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    chapter_id: { type: Number, required: true },
    lastReadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);
