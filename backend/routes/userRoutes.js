import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  toggleWishlist,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', toggleWishlist);

export default router;
