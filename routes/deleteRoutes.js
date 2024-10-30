// deleteRoutes.js

const express = require('express');
const router = express.Router();
const {
    deleteAuthor,
    deleteBlacklist,
    deleteBook,
    deleteBookContent,
    deleteCollection,
    deleteGenre,
    deletePaymentHistory,
    deleteReadingProgress,
    deleteReview,
    deleteSubscription,
    deleteSubscriptionPlan,
    deleteUser,
} = require('../controllers/deleteController');

// Import middlewares for authentication and authorization
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Define routes with delete controllers
router.delete('/authors', authMiddleware, adminMiddleware, deleteAuthor);
router.delete('/blacklist', authMiddleware, adminMiddleware, deleteBlacklist);
router.delete('/books', authMiddleware, adminMiddleware, deleteBook);
router.delete('/bookcontents', authMiddleware, adminMiddleware, deleteBookContent);
router.delete('/collections', authMiddleware, adminMiddleware, deleteCollection);
router.delete('/genres', authMiddleware, adminMiddleware, deleteGenre);
router.delete('/paymenthistories', authMiddleware, adminMiddleware, deletePaymentHistory);
router.delete('/readingprogress', authMiddleware, adminMiddleware, deleteReadingProgress);
router.delete('/reviews', authMiddleware, adminMiddleware, deleteReview);
router.delete('/subscriptions', authMiddleware, adminMiddleware, deleteSubscription);
router.delete('/subscriptionplans', authMiddleware, adminMiddleware, deleteSubscriptionPlan);
router.delete('/users', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
