// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// กำหนดการตั้งค่า CORS
app.use(cors()); // อนุญาตให้ทุกแหล่งที่มาเข้าถึง API ได้

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Import routes
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const authorRoutes = require("./routes/authorRoutes");
const genreRoutes = require("./routes/genreRoutes");
const searchRoutes = require("./routes/searchRoutes");
const deleteRoutes = require("./routes/deleteRoutes");

// Use routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/delete", deleteRoutes);

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "BOOGO API Documentation",
        },
        servers: [
            {
                url: "http://localhost:5000/api",
            },
            {
                url: "https://boogo-backend-api.onrender.com/api",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./routes/*"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec)
})

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
