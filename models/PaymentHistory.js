// models/PaymentHistory.js
const mongoose = require('mongoose');

const PaymentHistorySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    paymentDate: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    status: { type: String, required: true }
});

module.exports = mongoose.model('PaymentHistory', PaymentHistorySchema);