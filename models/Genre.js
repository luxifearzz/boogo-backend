// models/Genre.js
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageURL: { type: String, required: true },
    description: { type: String, required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] // ระบุ ref เป็น 'Book'
});

// สร้างโมเดล Genre
const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
