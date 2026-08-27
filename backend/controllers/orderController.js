import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendMail, templates } from '../services/emailService.js';

const generateOrderNumber = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FC-${ts}-${rand}`;
};

export const createOrder = async (req, res, next) => {
  try {
    const { items, customer, shippingAddress, notes } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Order must contain at least one item' });
    if (!customer?.email) return res.status(400).json({ message: 'Customer email is required' });

    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    let subtotal = 0;
    const orderItems = items.map((i) => {
      const product = products.find((p) => p._id.toString() === i.product);
      if (!product) throw Object.assign(new Error('Invalid product in order'), { statusCode: 400 });
      const quantity = Math.max(1, Number(i.quantity) || 1);
      subtotal += product.price * quantity;
      return {
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url,
        price: product.price,
        quantity,
      };
    });

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user?._id,
      items: orderItems,
      customer,
      shippingAddress,
      notes,
      subtotal,
      total: subtotal,
      paymentStatus: 'pending',
      status: 'pending',
    });

    sendMail({ to: customer.email, subject: `Order Confirmation #${order.orderNumber}`, html: templates.orderConfirmation(order) }).catch(() => {});
    sendMail({ to: process.env.ADMIN_EMAIL, subject: `New Order #${order.orderNumber}`, html: templates.orderConfirmation(order) }).catch(() => {});

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderByNumber = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user?.role !== 'admin' && order.user?.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));
    const [orders, total] = await Promise.all([
      Order.find(filter).sort('-createdAt').skip((pageNum - 1) * limitNum).limit(limitNum),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    if (status) {
      sendMail({ to: order.customer.email, subject: `Order #${order.orderNumber} Update`, html: templates.orderStatusUpdate(order) }).catch(() => {});
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};
