// controllers/bookController.js
const Book = require('../models/Book');
const Author = require('../models/Author');
const Genre = require('../models/Genre');
const BookContent = require('../models/BookContent');
const ReadingProgress = require('../models/ReadingProgress');

// ดึงข้อมูลหนังสือทั้งหมด พร้อมชื่อผู้แต่ง
const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('authors', 'name').populate('genres', 'name');
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ดึงรายละเอียดหนังสือตาม ID พร้อมชื่อผู้แต่ง
const getBookDetailsById = async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId).populate('authors', 'name').populate('genres', 'name');
        if (!book) return res.status(404).json({ message: 'Book id not found' });

        return res.json(book);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// เพิ่มหนังสือใหม่และอัปเดตข้อมูลผู้แต่งและประเภทหนังสือ
const createBook = async (req, res) => {
    const reqBook = req.body;
    const book = new Book(reqBook);

    try {
        const newBook = await book.save();

        // ถ้ามีผู้แต่งในข้อมูลหนังสือ ให้เพิ่ม bookId ไปที่ booksWritten ของผู้แต่ง
        if (reqBook.authors && Array.isArray(reqBook.authors)) {
            await Author.updateMany(
                { _id: { $in: reqBook.authors } },
                { $addToSet: { booksWritten: newBook._id } }
            );
        }

        // ถ้ามีประเภทหนังสือ ให้เพิ่ม bookId ไปที่ books ของประเภทหนังสือ
        if (reqBook.genres && Array.isArray(reqBook.genres)) {
            await Genre.updateMany(
                { _id: { $in: reqBook.genres } },
                { $addToSet: { books: newBook._id } }
            );
        }

        return res.status(201).json(newBook);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// อัปเดตข้อมูลหนังสือตาม bookId และจัดการการเปลี่ยนแปลงในประเภทหนังสือ
const updateBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        const updatedData = req.body;

        // หา genres ก่อนอัปเดตข้อมูลหนังสือ
        const oldBook = await Book.findById(bookId);
        if (!oldBook) return res.status(404).json({ message: 'Book not found' });

        const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, { new: true });

        if (updatedData.genres) {
            const oldGenres = oldBook.genres.filter(genre => !updatedData.genres.includes(genre.toString()));
            if (oldGenres.length > 0) {
                await Genre.updateMany(
                    { _id: { $in: oldGenres } },
                    { $pull: { books: bookId } }
                );
            }

            const newGenres = updatedData.genres.filter(genre => !oldBook.genres.includes(genre.toString()));
            if (newGenres.length > 0) {
                await Genre.updateMany(
                    { _id: { $in: newGenres } },
                    { $addToSet: { books: bookId } }
                );
            }
        }

        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error });
    }
};

// ลบหนังสือและอัปเดตข้อมูลผู้แต่งและประเภทหนังสือ
const deleteBook = async (req, res) => {
    const { bookId } = req.params;

    try {
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });

        if (deletedBook.authors && Array.isArray(deletedBook.authors)) {
            await Author.updateMany(
                { _id: { $in: deletedBook.authors } },
                { $pull: { booksWritten: bookId } }
            );
        }

        if (deletedBook.genres && Array.isArray(deletedBook.genres)) {
            await Genre.updateMany(
                { _id: { $in: deletedBook.genres } },
                { $pull: { books: bookId } }
            );
        }

        res.json(deletedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createBookContent = async (req, res) => {
    const { bookId } = req.params;
    const { chapter_number, title, content } = req.body;

    try {
        const oldContent = await BookContent.findOne({ book_id: bookId, chapter_number });
        if (oldContent) {
            return res.status(409).json({ message: 'Chapter already exists. Use PATCH to update.' });
        }

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const bookContent = new BookContent({ book_id: bookId, chapter_number, title, content });
        const newBookContent = await bookContent.save();

        await Book.updateOne(
            { _id: bookId },
            { $push: { chapters: { chapter_number, title } } }
        );

        return res.json(newBookContent);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const getBookContent = async (req, res) => {
    const { bookId, chapterNo } = req.params;
    const user_id = req.user.id;

    try {
        const selectedBook = await Book.findById(bookId);
        if (!selectedBook) return res.status(404).json({ message: 'Book not found' });

        let readingProgress = await ReadingProgress.findOne({ user_id, book_id: bookId });

        if (chapterNo) {
            const selectedBookContent = await BookContent.findOne({ book_id: bookId, chapter_number: chapterNo });
            if (!selectedBookContent) return res.status(404).json({ message: 'Chapter not found' });

            if (readingProgress) {
                readingProgress.chapter_id = chapterNo;
                readingProgress.lastReadDate = Date.now();
            } else {
                readingProgress = new ReadingProgress({ user_id, book_id: bookId, chapter_id: chapterNo, lastReadDate: Date.now() });
            }
            await readingProgress.save();
            return res.json(selectedBookContent);
        }

        const latestChapterNo = readingProgress?.chapter_id || 1;
        const latestReadChapter = await BookContent.findOne({ book_id: bookId, chapter_number: latestChapterNo });
        if (!latestReadChapter) return res.status(404).json({ message: 'No chapters found in this book.' });

        readingProgress ? readingProgress.lastReadDate = Date.now() : await ReadingProgress.create({ user_id, book_id: bookId, chapter_id: 1, lastReadDate: Date.now() });
        await readingProgress?.save();

        return res.json(latestReadChapter);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

const updateBookContent = async (req, res) => {
    const { bookId, chapterNo } = req.params;
    const { title, content } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const oldContent = await BookContent.findOne({ book_id: bookId, chapter_number: chapterNo });
        if (!oldContent) return res.status(404).json({ message: 'Chapter not found.' });

        oldContent.title = title;
        oldContent.content = content;

        await Book.updateOne(
            { _id: bookId, "chapters.chapter_number": chapterNo },
            { $set: { "chapters.$.title": title } }
        );

        const newContent = await oldContent.save();
        return res.json(newContent);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

const deleteBookContent = async (req, res) => {
    const { bookId, chapterNo } = req.params;

    try {
        // ค้นหาหนังสือที่ต้องการ
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // ค้นหาบทใน BookContent ที่ต้องการลบ
        const oldContent = await BookContent.findOne({ book_id: bookId, chapter_number: chapterNo });
        if (!oldContent) return res.status(404).json({ message: 'Chapter not found.' });

        // ลบเนื้อหาบท
        await BookContent.deleteOne({ _id: oldContent._id });

        // อัปเดตหนังสือเพื่อลบบทจาก chapters
        await Book.updateOne(
            { _id: bookId },
            { $pull: { chapters: { chapter_number: chapterNo } } } // ลบ chapter จาก chapters array
        );

        return res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getBooks,
    getBookDetailsById,
    createBook,
    updateBookById,
    deleteBook,
    createBookContent,
    getBookContent,
    updateBookContent,
    deleteBookContent,
};
