// controllers/bookController.js
const Book = require("../models/Book");
const Author = require("../models/Author");
const Genre = require("../models/Genre");
const BookContent = require("../models/BookContent");
const ReadingProgress = require("../models/ReadingProgress");

const randomTenBooks = async (req, res) => {
    try {
        const books = await Book.aggregate([{ $sample: { size: 10 } }])
        return res.json(books)
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }
};

// ดึงข้อมูลหนังสือทั้งหมด พร้อมชื่อผู้แต่ง
const getBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .populate("authors", "name")
            .populate("genres", "name");
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ดึงรายละเอียดหนังสือตาม ID พร้อมชื่อผู้แต่ง
const getBookDetailsById = async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId)
            .populate("authors", "name")
            .populate("genres", "name");
        if (!book)
            return res.status(404).json({ message: "Book id not found" });

        return res.json(book);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getBookChapters = async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res
                .status(404)
                .json({ message: "Can't find book with that id" });
        }

        return res.json(book.chapters.sort((a, b) => a.chapter_number - b.chapter_number));
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

const updateBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        const updatedData = req.body;

        // หา book เก่าเพื่อตรวจสอบ authors และ genres ก่อนการอัปเดต
        const oldBook = await Book.findById(bookId);
        if (!oldBook)
            return res.status(404).json({ message: "Book not found" });

        // อัปเดตข้อมูลหนังสือในฐานข้อมูล
        const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, {
            new: true,
        });

        // จัดการการเปลี่ยนแปลงใน authors
        if (updatedData.authors && Array.isArray(updatedData.authors)) {
            // ลบ bookId ออกจาก booksWritten ของผู้แต่งที่ถูกลบ
            const oldAuthors = oldBook.authors.filter(
                (author) => !updatedData.authors.includes(author.toString())
            );
            if (oldAuthors.length > 0) {
                await Author.updateMany(
                    { _id: { $in: oldAuthors } },
                    { $pull: { booksWritten: bookId } }
                );
            }

            // เพิ่ม bookId ใน booksWritten ของผู้แต่งใหม่ที่ถูกเพิ่ม
            const newAuthors = updatedData.authors.filter(
                (author) => !oldBook.authors.includes(author.toString())
            );
            if (newAuthors.length > 0) {
                await Author.updateMany(
                    { _id: { $in: newAuthors } },
                    { $addToSet: { booksWritten: bookId } }
                );
            }
        }

        // จัดการการเปลี่ยนแปลงใน genres
        if (updatedData.genres && Array.isArray(updatedData.genres)) {
            // ลบ bookId ออกจาก books ของประเภทหนังสือที่ถูกลบ
            const oldGenres = oldBook.genres.filter(
                (genre) => !updatedData.genres.includes(genre.toString())
            );
            if (oldGenres.length > 0) {
                await Genre.updateMany(
                    { _id: { $in: oldGenres } },
                    { $pull: { books: bookId } }
                );
            }

            // เพิ่ม bookId ใน books ของประเภทหนังสือใหม่ที่ถูกเพิ่ม
            const newGenres = updatedData.genres.filter(
                (genre) => !oldBook.genres.includes(genre.toString())
            );
            if (newGenres.length > 0) {
                await Genre.updateMany(
                    { _id: { $in: newGenres } },
                    { $addToSet: { books: bookId } }
                );
            }
        }

        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "Error updating book", error });
    }
};

// ลบหนังสือและอัปเดตข้อมูลผู้แต่งและประเภทหนังสือ
const deleteBook = async (req, res) => {
    const { bookId } = req.params;

    try {
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook)
            return res.status(404).json({ message: "Book not found" });

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

        deleteBookContentByBookId(bookId);

        res.json(deletedBook);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addGenresToBook = async (req, res) => {
    const { bookId } = req.params;
    const { genres } = req.body; // array of genre IDs

    try {
        // ตรวจสอบว่า genres เป็น array และไม่ว่างเปล่า
        if (!Array.isArray(genres) || genres.length === 0) {
            return res
                .status(400)
                .json({ message: "Please provide an array of genre IDs" });
        }

        // ตรวจสอบว่าทุก genre ID มีอยู่จริงในฐานข้อมูล
        const validGenres = await Genre.find({ _id: { $in: genres } }, "_id");
        const validGenreIds = validGenres.map((genre) => genre._id.toString());

        if (validGenreIds.length !== genres.length) {
            return res
                .status(400)
                .json({ message: "Some genre IDs are invalid" });
        }

        // อัปเดตฟิลด์ genres ใน Book โดยเพิ่ม genres
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { $addToSet: { genres: { $each: validGenreIds } } }, // ใช้ $addToSet เพื่อหลีกเลี่ยงค่าซ้ำ
            { new: true } // ส่งคืนเอกสารที่อัปเดตแล้ว
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        // อัปเดตฟิลด์ books ใน Genre โดยเพิ่ม bookId
        await Genre.updateMany(
            { _id: { $in: validGenreIds } },
            { $addToSet: { books: bookId } } // ใช้ $addToSet เพื่อหลีกเลี่ยงค่าซ้ำ
        );

        return res.json(updatedBook);
    } catch (err) {
        return res
            .status(500)
            .json({
                message: "Error adding genres to book",
                error: err.message,
            });
    }
};

const deleteBookContentByBookId = async (bookId) => {
    try {
        const result = await BookContent.deleteMany({ book_id: bookId });
        return result;
    } catch (err) {
        return err;
    }
};

const createBookContent = async (req, res) => {
    const { bookId } = req.params;
    const { chapter_number, title, content } = req.body;

    try {
        const oldContent = await BookContent.findOne({
            book_id: bookId,
            chapter_number,
        });
        if (oldContent) {
            return res
                .status(409)
                .json({
                    message: "Chapter already exists. Use PATCH to update.",
                });
        }

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        const bookContent = new BookContent({
            book_id: bookId,
            chapter_number,
            title,
            content,
        });
        const newBookContent = await bookContent.save();

        await Book.updateOne(
            { _id: bookId },
            { $push: { chapters: { chapter_number, title } } }
        );

        return res.status(201).json(newBookContent);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const getBookContent = async (req, res) => {
    const { bookId, chapterNo } = req.params;
    const user_id = req.user.id;

    try {
        const selectedBook = await Book.findById(bookId);
        if (!selectedBook)
            return res.status(404).json({ message: "Book not found" });

        let readingProgress = await ReadingProgress.findOne({
            user_id,
            book_id: bookId,
        });

        if (chapterNo) {
            const selectedBookContent = await BookContent.findOne({
                book_id: bookId,
                chapter_number: chapterNo,
            });
            if (!selectedBookContent)
                return res.status(404).json({ message: "Chapter not found" });

            if (readingProgress) {
                readingProgress.chapter_id = chapterNo;
                readingProgress.lastReadDate = Date.now();
            } else {
                readingProgress = new ReadingProgress({
                    user_id,
                    book_id: bookId,
                    chapter_id: chapterNo,
                    lastReadDate: Date.now(),
                });
            }
            await readingProgress.save();
            return res.json(selectedBookContent);
        }

        const latestChapterNo = readingProgress?.chapter_id || 1;
        const latestReadChapter = await BookContent.findOne({
            book_id: bookId,
            chapter_number: latestChapterNo,
        });
        if (!latestReadChapter)
            return res
                .status(404)
                .json({ message: "No chapters found in this book." });

        readingProgress
            ? (readingProgress.lastReadDate = Date.now())
            : await ReadingProgress.create({
                  user_id,
                  book_id: bookId,
                  chapter_id: 1,
                  lastReadDate: Date.now(),
              });
        await readingProgress?.save();

        return res.json(latestReadChapter);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const updateBookContent = async (req, res) => {
    const { bookId, chapterNo } = req.params;
    const { title, content } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        const oldContent = await BookContent.findOne({
            book_id: bookId,
            chapter_number: chapterNo,
        });
        if (!oldContent)
            return res.status(404).json({ message: "Chapter not found." });

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
};

const deleteBookContent = async (req, res) => {
    const { bookId, chapterNo } = req.params;

    try {
        // ค้นหาหนังสือที่ต้องการ
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        // ค้นหาบทใน BookContent ที่ต้องการลบ
        const oldContent = await BookContent.findOne({
            book_id: bookId,
            chapter_number: chapterNo,
        });
        if (!oldContent)
            return res.status(404).json({ message: "Chapter not found." });

        // ลบเนื้อหาบท
        await BookContent.deleteOne({ _id: oldContent._id });

        // อัปเดตหนังสือเพื่อลบบทจาก chapters
        await Book.updateOne(
            { _id: bookId },
            { $pull: { chapters: { chapter_number: chapterNo } } } // ลบ chapter จาก chapters array
        );

        return res
            .status(200)
            .json({ message: "Chapter deleted successfully" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports = {
    randomTenBooks,
    getBooks,
    getBookDetailsById,
    getBookChapters,
    createBook,
    updateBookById,
    deleteBook,
    addGenresToBook,
    createBookContent,
    getBookContent,
    updateBookContent,
    deleteBookContent,
};
