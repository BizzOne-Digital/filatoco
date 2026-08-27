import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  { url: String, publicId: String },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    sku: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: String,
    materials: [String],
    colors: [String],
    dimensions: String,
    stock: { type: Number, default: 1, min: 0 },
    productType: { type: String, enum: ['crochet', 'tapestry', 'sewn', 'shoulder-bag', 'tote', 'crossbody', 'top-handle'], required: true },
    madeType: { type: String, enum: ['ready-made', 'custom-made'], default: 'ready-made' },
    images: [imageSchema],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

productSchema.pre('validate', function (next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(2, 7);
  }
  next();
});

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
