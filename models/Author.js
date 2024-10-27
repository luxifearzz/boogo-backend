// models/Author.js
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    biography: {
        type: String,
        required: true,
    },
    profile_picture: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
    },
    nationality: {
        type: String,
        required: true,
    },
    booksWritten: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
