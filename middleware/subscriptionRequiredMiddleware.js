// middleware/subscriptionRequiredMiddleware.js
const Subscription = require('../models/Subscription')

const subscriptionRequiredMiddleware = async (req, res, next) => {
    const user_id = req.user.id;

    try {
        // ค้นหาการสมัครสมาชิกที่มีสถานะ isActive เป็น true
        const activeSubscription = await Subscription.findOne({ user_id, isActive: true });

        if (!activeSubscription) {
            return res.status(403).json({ message: 'You must have an active subscription to access this resource.' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: 'Error checking subscription status.' });
    }
}

module.exports = subscriptionRequiredMiddleware;