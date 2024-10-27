const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
    try {
        const user_id = req.user.id;

        // ค้นหาผู้ใช้ในฐานข้อมูล
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ตรวจสอบบทบาทของผู้ใช้
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin role is required' });
        }

        // ผ่าน middleware ไปยัง endpoint ถัดไป
        next();
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = adminMiddleware;
