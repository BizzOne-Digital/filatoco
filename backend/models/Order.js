import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [orderItemSchema],
    customer: {
      firstName: String,
      lastName: String,
      email: { type: String, required: true },
      phone: String,
    },
    shippingAddress: {
      address: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
    },
    notes: String,
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paymentProvider: { type: String, default: 'manual' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
