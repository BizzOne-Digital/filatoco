import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect, adminOnly } from '../middleware/auth.js';
import { submitContact, getContacts, markContactRead, deleteContact } from '../controllers/contactController.js';

const router = express.Router();
const formLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 });

router.post('/', formLimiter, submitContact);
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, markContactRead);
router.delete('/:id', protect, adminOnly, deleteContact);

export default router;
