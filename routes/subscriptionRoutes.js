const express = require('express');
const router = express.Router();

const { createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan, getSubscriptionPlans, subscribe, unsubscribe } = require('../controllers/subscriptionController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const preventDuplicateSubscriptionMiddleware = require('../middlewares/preventDuplicateSubscriptionmiddleware')

router.post('/plans', authMiddleware, adminMiddleware, createSubscriptionPlan)

router.patch('/plans/:planId', authMiddleware, adminMiddleware, updateSubscriptionPlan)

router.delete('/plans/:planId', authMiddleware, adminMiddleware, deleteSubscriptionPlan)

// GET for retrieve all subscription plans
router.get('/plans', getSubscriptionPlans);

// POST for subscribe
router.post('/:planId', authMiddleware, preventDuplicateSubscriptionMiddleware, subscribe);

router.delete('/', authMiddleware, unsubscribe)

module.exports = router;
