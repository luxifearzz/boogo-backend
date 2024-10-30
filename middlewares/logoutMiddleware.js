// middlewares/logoutMiddleware.js
const jwt = require('jsonwebtoken');

const logoutMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    // ตรวจสอบว่าไม่มี token จึงจะให้เข้าถึงได้
    if (!token) {
        return next(); // ไปต่อได้หากไม่มีโทเค็น (ยังไม่ได้ login)
    }

    // หากมี token ตรวจสอบความถูกต้อง
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return next(); // หาก token ไม่ถูกต้อง ให้ไปต่อได้
        }

        // กรณี token ถูกต้อง แจ้งว่าผู้ใช้ยังอยู่ในระบบ
        return res.status(403).json({ message: 'Already logged in' });
    });
};

module.exports = logoutMiddleware;
