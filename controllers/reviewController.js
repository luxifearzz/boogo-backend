// controllers/reviewController.js
const Review = require("../models/Review");
const Book = require("../models/Book");

const createReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { bookId } = req.params;
    const user_id = req.user.id;

    try {
        // ตรวจสอบว่าผู้ใช้เคยรีวิวหนังสือเล่มนี้แล้วหรือไม่
        const existingReview = await Review.findOne({ bookId, user_id });
        if (existingReview) {
            return res
                .status(409)
                .json({ message: "You have already reviewed this book" });
        }

        // หา Book ที่ตรงกับ bookId เพื่ออัปเดตคะแนนเฉลี่ย
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // สร้างรีวิวใหม่
        const review = new Review({
            user_id,
            book_id: bookId,
            rating,
            comment,
        });

        // บันทึกรีวิวใหม่
        const savedReview = await review.save();

        // อัปเดตคะแนนเฉลี่ยของหนังสือ
        const totalReviews = book.ratings.length + 1;
        const totalRatingSum =
            book.averageRating * book.ratings.length + rating;
        const newAverageRating = totalRatingSum / totalReviews;

        // อัปเดตค่า averageRating ใน Book พร้อมกับเพิ่ม ObjectId ของ review ลงใน ratings
        book.averageRating = newAverageRating;
        book.ratings.push(savedReview._id); // เพิ่ม ObjectId ของ Review ลงใน ratings

        await book.save();

        return res.status(201).json(savedReview);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const getReviewsByBook = async (req, res) => {
    const { bookId } = req.params;

    try {
        // Match `book_id` in Review model
        const reviews = await Review.find({ book_id: bookId })
            .sort({ reviewDate: -1 })
            .populate("user_id", "name profile_picture");
        res.status(200).json(reviews);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteReviewsById = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return res.status(404).json({ message: "No review found" });
        }

        return res.json(deletedReview);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createReview,
    getReviewsByBook,
    deleteReviewsById,
};
