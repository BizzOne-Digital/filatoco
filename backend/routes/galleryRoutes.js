import express from 'express';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', optionalAuth, getGallery);
router.post('/', protect, adminOnly, upload.single('image'), createGalleryItem);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

export default router;
