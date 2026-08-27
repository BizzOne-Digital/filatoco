import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect, adminOnly } from '../middleware/auth.js';
import { subscribe, getSubscribers, unsubscribe } from '../controllers/newsletterController.js';

const router = express.Router();
const subscribeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 });

router.post('/subscribe', subscribeLimiter, subscribe);
router.get('/', protect, adminOnly, getSubscribers);
router.put('/unsubscribe/:email', unsubscribe);

export default router;
