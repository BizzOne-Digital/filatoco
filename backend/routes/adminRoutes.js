import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getDashboardStats, getCustomers } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/dashboard', getDashboardStats);
router.get('/customers', getCustomers);

export default router;
