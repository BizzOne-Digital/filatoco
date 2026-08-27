import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Contact from '../models/Contact.js';
import CustomRequest from '../models/CustomRequest.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      customers,
      contactMessages,
      customRequests,
      newsletterSubscribers,
      recentOrders,
      recentMessages,
      lowStockProducts,
      revenueAgg,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'processing'] } }),
      Order.countDocuments({ status: 'delivered' }),
      User.countDocuments({ role: 'customer' }),
      Contact.countDocuments(),
      CustomRequest.countDocuments(),
      NewsletterSubscriber.countDocuments({ isActive: true }),
      Order.find().sort('-createdAt').limit(5),
      Contact.find().sort('-createdAt').limit(5),
      Product.find({ stock: { $lte: 2 } }).limit(10),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);

    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue: revenueAgg[0]?.total || 0,
      customers,
      contactMessages,
      customRequests,
      newsletterSubscribers,
      recentOrders,
      recentMessages,
      lowStockProducts,
    });
  } catch (err) {
    next(err);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort('-createdAt');
    res.json({ customers });
  } catch (err) {
    next(err);
  }
};
