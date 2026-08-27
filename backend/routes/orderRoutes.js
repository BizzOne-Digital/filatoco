import express from 'express';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { createOrder, getMyOrders, getOrderByNumber, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/admin', protect, adminOnly, getAllOrders);
router.get('/:orderNumber', optionalAuth, getOrderByNumber);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
