// models/Blacklist.js
const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true, index: true },
}, {
    timestamps: true, // ใช้ timestamps เพื่อเก็บ createdAt และ updatedAt
});

// เพิ่ม TTL index ที่จะลบเอกสารหลังจาก 1 ชั่วโมง
blacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('Blacklist', blacklistSchema);
