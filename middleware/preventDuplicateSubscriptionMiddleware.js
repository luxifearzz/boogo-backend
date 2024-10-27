// middleware/preventDuplicateSubscriptionMiddleware.js
const Subscription = require('../models/Subscription');

const preventDuplicateSubscriptionMiddleware = async (req, res, next) => {
    const user_id = req.user.id;

    try {
        // ค้นหาข้อมูล subscription ของผู้ใช้
        const subscription = await Subscription.findOne({ user_id });

        // ตรวจสอบว่าไม่มี subscription ที่ยังไม่หมดอายุอยู่และ isActive เป็น true
        if (subscription && subscription.isActive && subscription.endDate > Date.now()) {
            return res.status(403).json({ message: 'You already have an active subscription' });
        }

        // หากไม่มี subscription หรือ subscription หมดอายุแล้ว หรือ isActive เป็น false ให้ไปยังขั้นตอนถัดไป
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = preventDuplicateSubscriptionMiddleware;