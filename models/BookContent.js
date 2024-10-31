const mongoose = require('mongoose');

const bookContentSchema = new mongoose.Schema({
    book_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    chapter_number: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
});

module.exports = mongoose.model('BookContent', bookContentSchema);
