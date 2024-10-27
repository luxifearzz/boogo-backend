const Review = require('../models/Review');
const Book = require('../models/Book');

// สร้างรีวิวใหม่และอัปเดตคะแนนเฉลี่ยของหนังสือ
const createReview = async (req, res) => {
    const { book_id, rating, comment } = req.body;
    const user_id = req.user.id;

    try {
        // ตรวจสอบว่าผู้ใช้เคยรีวิวหนังสือเล่มนี้แล้วหรือไม่
        const existingReview = await Review.findOne({ book_id, user_id });
        if (existingReview) {
            return res.status(409).json({ message: 'You have already reviewed this book' });
        }

        // หา Book ที่ตรงกับ book_id เพื่ออัปเดตคะแนนเฉลี่ย
        const book = await Book.findById(book_id).populate('ratings');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // สร้างรีวิวใหม่
        const review = new Review({
            user_id,
            book_id,
            rating,
            comment
        });

        // รวมคะแนนทั้งหมดและคำนวณค่าเฉลี่ย
        const totalReviews = book.ratings.length + 1;
        const totalRatingSum = book.averageRating * book.ratings.length + rating;
        const newAverageRating = totalRatingSum / totalReviews;

        // อัปเดตค่า averageRating ใน Book พร้อมกับบันทึกรีวิวใหม่
        book.averageRating = newAverageRating;
        
        await Promise.all([review.save(), book.save()]);
        
        return res.status(201).json(review);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// ดึงรีวิวทั้งหมดสำหรับหนังสือ
const getReviewsByBook = async (req, res) => {
    const { book_id } = req.params;

    try {
        const reviews = await Review.find({ book_id }).sort({ createdAt: -1 }); // เรียงตามวันที่รีวิวล่าสุดก่อน
        res.status(200).json(reviews);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    createReview,
    getReviewsByBook
};
