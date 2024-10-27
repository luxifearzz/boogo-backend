const express = require('express');
const router = express.Router();

const { createSubscriptionPlan, getSubscriptionPlans, subscribe, unsubscribe } = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const preventDuplicateSubscriptionMiddleware = require('../middleware/preventDuplicateSubscriptionMiddleware')

router.post('/plans', authMiddleware, adminMiddleware, createSubscriptionPlan)

// GET for retrieve all subscription plans
router.get('/plans', getSubscriptionPlans);

// POST for subscribe
router.post('/:planId', authMiddleware, preventDuplicateSubscriptionMiddleware, subscribe);

router.delete('/', authMiddleware, unsubscribe)

module.exports = router;
