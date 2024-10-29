// models/SubscriptionPlan.js
const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
    planType: { type: String, required: true },
    details: [{ type: String, required: true }],
    duration: { type: Number, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
