import express from 'express';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';

const router = express.Router();

router.get('/', optionalAuth, getTestimonials);
router.post('/', protect, adminOnly, upload.single('image'), createTestimonial);
router.put('/:id', protect, adminOnly, upload.single('image'), updateTestimonial);
router.delete('/:id', protect, adminOnly, deleteTestimonial);

export default router;
