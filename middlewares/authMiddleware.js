const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Blacklist = require('../models/Blacklist')

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    // ตรวจสอบ Token
    const blacklisted = await Blacklist.findOne({ token });
    if (blacklisted) {
        return res.status(403).json({ message: 'Token has been blacklisted' });
    }

    try {
        // ตรวจสอบความถูกต้องของ Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ค้นหาผู้ใช้ในฐานข้อมูล
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // เก็บข้อมูลผู้ใช้ใน req
        req.user = { id: user._id, role: user.role };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
