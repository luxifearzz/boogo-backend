// routes/subscriptionRoutes.js

const express = require('express');
const router = express.Router();
const { createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan, getSubscriptionPlans, subscribe, unsubscribe, isSubscribed, isNotSubscribed } = require('../controllers/subscriptionController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const preventDuplicateSubscriptionMiddleware = require('../middlewares/preventDuplicateSubscriptionMiddleware');
const subscriptionRequiredMiddleware = require('../middlewares/subscriptionRequiredMiddleware');

/**
 * @swagger
 * /subscriptions/isSubscribed:
 *   get:
 *     summary: Check if user is already subscribed
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is subscribed
 *       401:
 *         description: Unauthorized access
 *       409:
 *         description: Duplicate subscription detected
 */
router.get('/isSubscribed', authMiddleware, subscriptionRequiredMiddleware, isSubscribed)

/**
 * @swagger
 * /subscriptions/isNotSubscribed:
 *   get:
 *     summary: Check if user is not subscribed
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is not subscribed
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Subscription is required
 */
router.get('/isNotSubscribed', authMiddleware, preventDuplicateSubscriptionMiddleware, isNotSubscribed)

/**
 * @swagger
 * /subscriptions/plans:
 *   post:
 *     summary: Create a new subscription plan
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planType:
 *                 type: string
 *               duration:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Successfully created subscription plan
 *       409:
 *         description: Subscription plan with this type already exists
 *       400:
 *         description: Invalid data provided
 */
router.post('/plans', authMiddleware, adminMiddleware, createSubscriptionPlan);

/**
 * @swagger
 * /subscriptions/plans/{planId}:
 *   patch:
 *     summary: Update an existing subscription plan
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planType:
 *                 type: string
 *               duration:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully updated subscription plan
 *       404:
 *         description: Subscription plan not found
 *       400:
 *         description: Invalid data provided
 */
router.patch('/plans/:planId', authMiddleware, adminMiddleware, updateSubscriptionPlan);

/**
 * @swagger
 * /subscriptions/plans/{planId}:
 *   delete:
 *     summary: Delete a subscription plan
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription plan deleted successfully
 *       404:
 *         description: Subscription plan not found
 */
router.delete('/plans/:planId', authMiddleware, adminMiddleware, deleteSubscriptionPlan);

/**
 * @swagger
 * /subscriptions/plans:
 *   get:
 *     summary: Retrieve all subscription plans
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: A list of subscription plans
 */
router.get('/plans', getSubscriptionPlans);

/**
 * @swagger
 * /subscriptions/{planId}:
 *   post:
 *     summary: Subscribe to a subscription plan
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_info:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *     responses:
 *       201:
 *         description: Successfully subscribed to the plan
 *       400:
 *         description: Missing plan ID or payment information
 *       404:
 *         description: Subscription plan not found
 *       409:
 *         description: User already has an active subscription
 */

router.post('/:planId', authMiddleware, preventDuplicateSubscriptionMiddleware, subscribe);

/**
 * @swagger
 * /subscriptions:
 *   delete:
 *     summary: Unsubscribe from the current subscription
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully unsubscribed
 *       404:
 *         description: No active subscription found
 */
router.delete('/', authMiddleware, unsubscribe);

module.exports = router;
