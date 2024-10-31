// controllers/subscriptionControllers
const Subscription = require("../models/Subscription");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const PaymentHistory = require("../models/PaymentHistory");

const createSubscriptionPlan = async (req, res) => {
    const planData = req.body;

    const oldSubscriptionPlan = await SubscriptionPlan.findOne({ planType: planData.planType })
    if (oldSubscriptionPlan) {
        return res.status(409).json({ message: 'Already has subscription with this plan type' })
    }

    try {
        const subscriptionPlan = new SubscriptionPlan(planData);
        const newSubscriptionPlan = await subscriptionPlan.save();
        return res.status(201).json(newSubscriptionPlan);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const updateSubscriptionPlan = async (req, res) => {
    const { planId } = req.params;
    const planData = req.body;

    try {
        const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
            planId,
            planData,
            { new: true }
        );

        if (!updatedPlan) {
            return res
                .status(404)
                .json({ message: "Subscription plan not found" });
        }

        return res.json(updatedPlan);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const deleteSubscriptionPlan = async (req, res) => {
    const { planId } = req.params;

    try {
        const deletedPlan = await SubscriptionPlan.findByIdAndDelete(planId);

        if (!deletedPlan) {
            return res
                .status(404)
                .json({ message: "Subscription plan not found" });
        }

        return res.json({
            message: "Subscription plan deleted successfully",
            deletedPlan,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// ดึงข้อมูลแผนการสมัครสมาชิกทั้งหมด
const getSubscriptionPlans = async (req, res) => {
    try {
        const subscriptionPlans = await SubscriptionPlan.find();
        res.json(subscriptionPlans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// สมัครแผนการสมัครสมาชิก
const subscribe = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { planId } = req.params;
        const { payment_info } = req.body;

        // ตรวจสอบข้อมูลที่จำเป็น
        if (!planId || !payment_info || !payment_info.amount) {
            return res
                .status(400)
                .json({
                    message: "Plan ID and payment information are required",
                });
        }

        // ตรวจสอบแผนการสมัครสมาชิก
        const subscriptionPlan = await SubscriptionPlan.findById(planId);
        if (!subscriptionPlan) {
            return res
                .status(404)
                .json({ message: "Subscription plan not found" });
        }

        // กำหนดวันเริ่มต้นและวันสิ้นสุดของการสมัครสมาชิก
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + subscriptionPlan.duration);
        const isActive = true;

        // ค้นหา subscription เดิมหากมีอยู่
        let subscription = await Subscription.findOne({ user_id });
        if (subscription) {
            if (subscriptionPlan.planType === "1 week") {
                return res
                    .status(409)
                    .json({
                        message:
                            "You've been subscribed before, so you can't access free plan",
                    });
            }

            // อัปเดต subscription เดิม
            subscription.plan_id = planId;
            subscription.startDate = startDate;
            subscription.endDate = endDate;
            subscription.isActive = isActive;
        } else {
            // สร้าง subscription ใหม่
            subscription = new Subscription({
                user_id,
                plan_id: planId,
                startDate,
                endDate,
                isActive,
            });
        }

        // บันทึก subscription ก่อนเพื่อสร้าง `_id`
        await subscription.save();

        // บันทึกการชำระเงินในประวัติการชำระเงิน
        const paymentHistory = new PaymentHistory({
            user_id,
            subscription_id: subscription._id,
            paymentDate: new Date(),
            amount: payment_info.amount,
            status: "success",
        });
        await paymentHistory.save();

        return res.status(201).json(subscription);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// ยกเลิกการสมัครสมาชิก
const unsubscribe = async (req, res) => {
    const user_id = req.user.id;

    try {
        // ค้นหาและอัปเดตสถานะ subscription
        const subscription = await Subscription.findOneAndUpdate(
            { user_id, isActive: true },
            { isActive: false, endDate: new Date() }, // ตั้งค่าสิ้นสุดการสมัครสมาชิก
            { new: true }
        );

        if (!subscription) {
            return res
                .status(404)
                .json({ message: "Active subscription not found" });
        }

        return res
            .status(200)
            .json({ message: "Successfully unsubscribed", subscription });
    } catch (err) {
        return res.status(500).json({ message: "Error unsubscribing" });
    }
};

module.exports = {
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    getSubscriptionPlans,
    subscribe,
    unsubscribe,
};
