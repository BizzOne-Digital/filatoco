import mongoose from 'mongoose';

const customRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    bagType: String,
    size: String,
    colors: String,
    materials: String,
    budgetRange: String,
    description: { type: String, required: true },
    referenceImage: {
      url: String,
      publicId: String,
    },
    status: { type: String, enum: ['new', 'contacted', 'quoted', 'in-progress', 'completed', 'declined'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('CustomRequest', customRequestSchema);
