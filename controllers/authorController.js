// controllers/authorController.js
const mongoose = require('mongoose');
const Author = require('../models/Author');
const Book = require('../models/Book');

const getAuthors = async (req, res) => {
    try {
        // เลือกฟิลด์ที่ต้องการส่งกลับไป
        const authors = await Author.find().populate('booksWritten', 'title');
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAuthorById = async (req, res) => {
    const { authorId } = req.params;

    try {
        const author = await Author.findById(authorId).populate('booksWritten', 'title');
        if (!author) return res.status(404).json({ message: 'Author not found' });
        res.json(author);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createAuthor = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    
    try {
        const { name, biography, profile_picture, dateOfBirth, nationality, booksWritten = [] } = req.body;
        
        const oldAuthor = await Author.findOne({ name })
        if (oldAuthor) return res.status(409).json({ message: `Already has author at this name ${oldAuthor}` })

        const author = new Author({
            name,
            biography,
            profile_picture,
            dateOfBirth,
            nationality,
            booksWritten: []
        });

        if (Array.isArray(booksWritten)) {
            const existingBooks = await Book.find({ _id: { $in: booksWritten } }).select('_id');
            const validBookIds = existingBooks.map(book => book._id);
            author.booksWritten = validBookIds;

            await Book.updateMany(
                { _id: { $in: validBookIds } },
                { $addToSet: { authors: author._id } },
                { session }
            );
        }

        const newAuthor = await author.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(newAuthor);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: err.message });
    }
};

const updateAuthorById = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { authorId } = req.params;
        const { name, biography, profile_picture, dateOfBirth, nationality, booksWritten } = req.body;

        const author = await Author.findById(authorId).session(session);
        if (!author) return res.status(404).json({ message: 'Author not found' });

        author.name = name || author.name;
        author.biography = biography || author.biography;
        author.profile_picture = profile_picture || author.profile_picture;
        author.dateOfBirth = dateOfBirth || author.dateOfBirth;
        author.nationality = nationality || author.nationality;

        if (Array.isArray(booksWritten)) {
            const existingBooks = await Book.find({ _id: { $in: booksWritten } }).select('_id');
            const validBookIds = existingBooks.map(book => book._id);

            await Book.updateMany(
                { authors: authorId, _id: { $nin: validBookIds } },
                { $pull: { authors: authorId } },
                { session }
            );

            await Book.updateMany(
                { _id: { $in: validBookIds } },
                { $addToSet: { authors: authorId } },
                { session }
            );

            author.booksWritten = validBookIds;
        }

        const updatedAuthor = await author.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.json(updatedAuthor);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Error updating author', error });
    }
};

const deleteAuthorById = async (req, res) => {
    const { authorId } = req.params;

    try {
        const deletedAuthor = await Author.findByIdAndDelete(authorId);
        if (!deletedAuthor) return res.status(404).json({ message: 'Author not found' });

        await Book.updateMany(
            { authors: authorId },
            { $pull: { authors: authorId } }
        );

        res.json({ message: 'Author deleted successfully', deletedAuthor });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const addBookToAuthor = async (req, res) => {
    const { authorId } = req.params;
    const { books } = req.body;

    try {
        const author = await Author.findById(authorId);
        if (!author) return res.status(404).json({ message: 'Author not found' });

        await Book.updateMany(
            { _id: { $in: books } },
            { $addToSet: { authors: authorId } }
        );

        author.booksWritten = Array.from(new Set([...author.booksWritten, ...books]));
        await author.save();

        res.status(200).json({ message: 'Books added successfully', author });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const removeBookFromAuthor = async (req, res) => {
    const { authorId, bookId } = req.params;

    try {
        const author = await Author.findById(authorId);
        if (!author) return res.status(404).json({ message: 'Author not found' });

        if (!author.booksWritten.includes(bookId)) {
            return res.status(400).json({ message: 'Book not found in author\'s collection' });
        }

        await Book.updateOne(
            { _id: bookId },
            { $pull: { authors: authorId } }
        );

        author.booksWritten = author.booksWritten.filter(id => id.toString() !== bookId);
        await author.save();

        res.status(200).json({ message: 'Book removed successfully'});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthorById,
    deleteAuthorById,
    addBookToAuthor,
    removeBookFromAuthor
};
