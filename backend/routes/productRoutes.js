import express from 'express';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  duplicateProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', optionalAuth, getProducts);
router.get('/:slug', optionalAuth, getProductBySlug);

router.post('/', protect, adminOnly, upload.array('images', 8), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 8), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.delete('/:id/images/:publicId', protect, adminOnly, deleteProductImage);
router.post('/:id/duplicate', protect, adminOnly, duplicateProduct);

export default router;
