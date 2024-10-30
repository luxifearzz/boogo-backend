// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// กำหนดการตั้งค่า CORS
app.use(cors()); // อนุญาตให้ทุกแหล่งที่มาเข้าถึง API ได้

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Import routes
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const authorRoutes = require('./routes/authorRoutes');
const genreRoutes = require('./routes/genreRoutes');
const searchRoutes = require('./routes/searchRoutes')
const deleteRoutes = require('./routes/deleteRoutes')

// Use routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/authors', authorRoutes)
app.use('/api/genres', genreRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/delete', deleteRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
