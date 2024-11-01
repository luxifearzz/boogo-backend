const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const subscriptionRequiredMiddleware = require("../middlewares/subscriptionRequiredMiddleware");
const {
    getBooks,
    getBookDetailsById,
    createBook,
    updateBookById,
    deleteBook,
    createBookContent,
    getBookContent,
    updateBookContent,
    deleteBookContent,
    addGenresToBook,
    getBookChapters,
    randomTenBooks,
    getReadingHistory,
} = require("../controllers/bookController");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books
 */

/**
 * @swagger
 * /books/top10:
 *   get:
 *     summary: Retrieve a list of 10 random books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of 10 books
 *       500:
 *         description: Server error
 */

router.get("/top10", randomTenBooks);

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Retrieve the reading history of the user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of books from the user's reading history
 *       401:
 *         description: Unauthorized, user needs to log in
 *       403:
 *         description: Forbidden, user needs an active subscription
 *       500:
 *         description: Server error
 */

router.get("/history", authMiddleware, subscriptionRequiredMiddleware, getReadingHistory)

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books with author names
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books with author details
 *       500:
 *         description: Server error
 */

router.get("/", getBooks);

/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     summary: Retrieve book details by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

router.get("/:bookId", getBookDetailsById);

/**
 * @swagger
 * /books/{bookId}/chapters:
 *   get:
 *     summary: Retrieve all chapters of a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: List of chapters
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

router.get("/:bookId/chapters", getBookChapters);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Book title
 *               description:
 *                 type: string
 *                 description: Brief description of the book
 *               publishedYear:
 *                 type: integer
 *                 description: Year the book was published
 *               coverImage:
 *                 type: string
 *                 description: URL for the book cover image
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of keywords to add to the book
 *             example:
 *               title: "Example Book Title"
 *               description: "A brief description of the book"
 *               publishedYear: 2023
 *               coverImage: "http://example.com/cover.jpg"
 *               keywords: ["new keyword", "latest", "money"]
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.post("/", authMiddleware, adminMiddleware, createBook);

/**
 * @swagger
 * /books/{bookId}:
 *   patch:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Book title
 *               description:
 *                 type: string
 *                 description: Brief description of the book
 *               publishedYear:
 *                 type: integer
 *                 description: Year the book was published
 *               coverImage:
 *                 type: string
 *                 description: URL for the book cover image
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of keywords to add to the book
 *             example:
 *               title: "Updated Book Title"
 *               description: "Updated description of the book"
 *               publishedYear: 2023
 *               coverImage: "http://example.com/updated-cover.jpg"
 *               keywords: ["new keyword", "update"]
 *     responses:
 *       200:
 *         description: Book updated
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

router.patch("/:bookId", authMiddleware, adminMiddleware, updateBookById);

/**
 * @swagger
 * /books/{bookId}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */

router.delete("/:bookId", authMiddleware, adminMiddleware, deleteBook);

/**
 * @swagger
 * /books/{bookId}/genres:
 *   post:
 *     summary: Add genres to a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of genres id to add to the book
 *             example:
 *               genres: ["1e21sdv32fb1f5", "21fd234ng2n15", "86hn435y4sd4r86a"]
 *     responses:
 *       200:
 *         description: Genres added to the book
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.post("/:bookId/genres", authMiddleware, adminMiddleware, addGenresToBook);

/**
 * @swagger
 * /books/{bookId}/contents:
 *   post:
 *     summary: Create new book content
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapter_number:
 *                 type: integer
 *                 description: Chapter number
 *               title:
 *                 type: string
 *                 description: Chapter title
 *               content:
 *                 type: string
 *                 description: Chapter content
 *             example:
 *               chapter_number: 1
 *               title: "This is the title of the first chapter."
 *               content: "This is the content of the first chapter."
 *     responses:
 *       201:
 *         description: Book content created
 *       409:
 *         description: Chapter already exists
 *       500:
 *         description: Server error
 */

router.post("/:bookId/contents", authMiddleware, adminMiddleware, createBookContent);

/**
 * @swagger
 * /books/{bookId}/contents:
 *   get:
 *     summary: Retrieve book content by chapter number
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Chapter content
 *       404:
 *         description: Chapter not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /books/{bookId}/contents/{chapterNo}:
 *   get:
 *     summary: Retrieve book content by chapter number
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *       - in: path
 *         name: chapterNo
 *         schema:
 *           type: integer
 *         description: Chapter number
 *     responses:
 *       200:
 *         description: Chapter content
 *       404:
 *         description: Chapter not found
 *       500:
 *         description: Server error
 */

router.get("/:bookId/contents/:chapterNo?", authMiddleware, subscriptionRequiredMiddleware, getBookContent);

/**
 * @swagger
 * /books/{bookId}/contents/{chapterNo}:
 *   patch:
 *     summary: Update book content by chapter number
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *       - in: path
 *         name: chapterNo
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chapter number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Update title for the chapter
 *               content:
 *                 type: string
 *                 description: Updated content for the chapter
 *             example:
 *               title: "This is the updated title for the chapter."
 *               content: "This is the updated content for the chapter."
 *     responses:
 *       200:
 *         description: Chapter updated
 *       404:
 *         description: Chapter not found
 *       500:
 *         description: Server error
 */

router.patch("/:bookId/contents/:chapterNo", authMiddleware, adminMiddleware, updateBookContent);

/**
 * @swagger
 * /books/{bookId}/contents/{chapterNo}:
 *   delete:
 *     summary: Delete book content by chapter number
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *       - in: path
 *         name: chapterNo
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chapter number
 *     responses:
 *       200:
 *         description: Chapter deleted
 *       404:
 *         description: Chapter not found
 *       500:
 *         description: Server error
 */

router.delete(":bookId/contents/:chapterNo", authMiddleware, adminMiddleware, deleteBookContent);

module.exports = router;
