const Genre = require('../models/Genre');
const Book = require('../models/Book');

// ดึงข้อมูล Genre ทั้งหมด
const getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find().populate('books', 'title');
        res.json(genres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ดึงข้อมูล Genre โดยใช้ ID
const getGenreById = async (req, res) => {
    const { id } = req.params;

    try {
        const genre = await Genre.findById(id).populate('books', 'title');
        if (!genre) return res.status(404).json({ message: 'Genre not found' });

        res.json(genre);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// สร้าง Genre ใหม่
const createGenre = async (req, res) => {
    const { name, imageURL, description, books } = req.body;

    try {
        const existingGenre = await Genre.findOne({ name });
        if (existingGenre) {
            return res.status(409).json({ message: 'Genre with this name already exists' });
        }

        const genre = new Genre({
            name,
            imageURL,
            description,
            books: books || []
        });
        const newGenre = await genre.save();

        // เพิ่ม genre ให้กับหนังสือที่เกี่ยวข้องใน books array
        if (books && books.length > 0) {
            await Book.updateMany(
                { _id: { $in: books } },
                { $addToSet: { genres: newGenre._id } }
            );
        }

        res.status(201).json(newGenre);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// อัปเดต Genre
const updateGenreById = async (req, res) => {
    const { id } = req.params;
    const { name, imageURL, description, books } = req.body;

    try {
        const genre = await Genre.findById(id);
        if (!genre) return res.status(404).json({ message: 'Genre not found' });

        // อัปเดตข้อมูล genre
        genre.name = name || genre.name;
        genre.imageURL = imageURL || genre.imageURL;
        genre.description = description || genre.description;

        // อัปเดต books ใน genre โดยเปลี่ยนแปลงเฉพาะเมื่อตัวแปร books ถูกส่งมาใหม่
        if (books) {
            // ลบ genre ออกจากหนังสือที่ไม่เกี่ยวข้องแล้ว
            const removedBooks = genre.books.filter(book => !books.includes(book.toString()));
            await Book.updateMany(
                { _id: { $in: removedBooks } },
                { $pull: { genres: genre._id } }
            );

            // เพิ่ม genre ให้กับหนังสือใหม่ที่ถูกเพิ่ม
            const newBooks = books.filter(book => !genre.books.includes(book));
            await Book.updateMany(
                { _id: { $in: newBooks } },
                { $addToSet: { genres: genre._id } }
            );

            // ตั้งค่า books ใน genre ใหม่
            genre.books = books;
        }

        const updatedGenre = await genre.save();
        res.json(updatedGenre);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ลบ Genre
const deleteGenreById = async (req, res) => {
    const { id } = req.params;

    try {
        const genre = await Genre.findByIdAndDelete(id);
        if (!genre) return res.status(404).json({ message: 'Genre not found' });

        // ลบ genre ออกจากหนังสือที่เกี่ยวข้อง
        await Book.updateMany(
            { _id: { $in: genre.books } },
            { $pull: { genres: id } }
        );

        res.status(200).json({ message: 'Genre deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllGenres,
    getGenreById,
    createGenre,
    updateGenreById,
    deleteGenreById,
};
