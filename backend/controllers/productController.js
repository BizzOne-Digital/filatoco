import Product from '../models/Product.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      productType,
      madeType,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      featured,
      newArrival,
      status,
    } = req.query;

    const filter = {};
    if (!req.user || req.user.role !== 'admin') filter.status = 'published';
    else if (status) filter.status = status;

    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (productType) filter.productType = productType;
    if (madeType) filter.madeType = madeType;
    if (featured) filter.isFeatured = true;
    if (newArrival) filter.isNewArrival = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      newest: '-createdAt',
      'price-asc': 'price',
      'price-desc': '-price',
      featured: '-isFeatured',
    };
    const sortBy = sortMap[sort] || '-createdAt';

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Number(limit));

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortBy)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.slug);
    const product = isObjectId
      ? await Product.findById(req.params.slug).populate('category', 'name slug')
      : await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'published',
    }).limit(4);
    res.json({ product, related });
  } catch (err) {
    next(err);
  }
};

const ALLOWED_PRODUCT_FIELDS = [
  'name', 'sku', 'description', 'shortDescription', 'price', 'comparePrice',
  'category', 'subcategory', 'materials', 'colors', 'dimensions', 'stock',
  'productType', 'madeType', 'isFeatured', 'isNewArrival', 'status',
  'seoTitle', 'seoDescription',
];

const pickAllowedFields = (body) => {
  const picked = {};
  for (const key of ALLOWED_PRODUCT_FIELDS) {
    if (body[key] !== undefined) picked[key] = body[key];
  }
  // An empty SKU must stay unset (not ""), otherwise every product with a
  // blank SKU collides on the unique index — "" is a real indexed value,
  // sparse only skips fields that are entirely absent.
  if (typeof picked.sku === 'string' && picked.sku.trim() === '') {
    delete picked.sku;
  }
  return picked;
};

export const createProduct = async (req, res, next) => {
  try {
    const images = [];
    if (req.files?.length) {
      for (const file of req.files) {
        images.push(await uploadBufferToCloudinary(file.buffer, 'filatoco/products'));
      }
    }
    const product = await Product.create({ ...pickAllowedFields(req.body), images });
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.files?.length) {
      const newImages = [];
      for (const file of req.files) {
        newImages.push(await uploadBufferToCloudinary(file.buffer, 'filatoco/products'));
      }
      product.images.push(...newImages);
    }

    Object.assign(product, pickAllowedFields(req.body));
    await product.save();
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

export const deleteProductImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const img = product.images.find((i) => i.publicId === req.params.publicId);
    if (img) await deleteFromCloudinary(img.publicId);
    product.images = product.images.filter((i) => i.publicId !== req.params.publicId);
    await product.save();
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

export const duplicateProduct = async (req, res, next) => {
  try {
    const original = await Product.findById(req.params.id).lean();
    if (!original) return res.status(404).json({ message: 'Product not found' });
    delete original._id;
    delete original.slug;
    delete original.sku;
    original.name = `${original.name} (Copy)`;
    original.status = 'draft';
    const copy = await Product.create(original);
    res.status(201).json({ product: copy });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    for (const img of product.images) await deleteFromCloudinary(img.publicId);
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
