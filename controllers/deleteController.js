// controllers/deleteController.js
const Author = require("../models/Author");
const Blacklist = require("../models/Blacklist");
const Book = require("../models/Book");
const BookContent = require("../models/BookContent");
const Collection = require("../models/Collection");
const Genre = require("../models/Genre");
const PaymentHistory = require("../models/PaymentHistory");
const ReadingProgress = require("../models/ReadingProgress");
const Review = require("../models/Review");
const Subscription = require("../models/Subscription");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const User = require("../models/User");

const deleteAuthor = async (req, res) => {
    try {
        await Author.deleteMany({});
        res.status(200).send("All authors deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting authors");
    }
};

const deleteBlacklist = async (req, res) => {
    try {
        await Blacklist.deleteMany({});
        res.status(200).send("All blacklist entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting blacklist entries");
    }
};

// Repeat for each model
const deleteBook = async (req, res) => {
    try {
        await Book.deleteMany({});
        res.status(200).send("All Book entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting Book entries");
    }
};
const deleteBookContent = async (req, res) => {
    try {
        await BookContent.deleteMany({});
        res.status(200).send("All BookContent entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting BookContent entries");
    }
};
const deleteCollection = async (req, res) => {
    try {
        await Collection.deleteMany({});
        res.status(200).send("All Collection entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting Collection entries");
    }
};
const deleteGenre = async (req, res) => {
    try {
        await Genre.deleteMany({});
        res.status(200).send("All Genre entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting Genre entries");
    }
};
const deletePaymentHistory = async (req, res) => {
    try {
        await PaymentHistory.deleteMany({});
        res.status(200).send("All PaymentHistory entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting PaymentHistory entries");
    }
};
const deleteReadingProgress = async (req, res) => {
    try {
        await ReadingProgress.deleteMany({});
        res.status(200).send("All ReadingProgress entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting ReadingProgress entries");
    }
};
const deleteReview = async (req, res) => {
    try {
        await Review.deleteMany({});
        res.status(200).send("All Review entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting Review entries");
    }
};
const deleteSubscription = async (req, res) => {
    try {
        await Subscription.deleteMany({});
        res.status(200).send("All Subscription entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting Subscription entries");
    }
};
const deleteSubscriptionPlan = async (req, res) => {
    try {
        await SubscriptionPlan.deleteMany({});
        res.status(200).send("All SubscriptionPlan entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting SubscriptionPlan entries");
    }
};
const deleteUser = async (req, res) => {
    try {
        await User.deleteMany({});
        res.status(200).send("All User entries deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting User entries");
    }
};

// Export all functions
module.exports = {
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
};
