import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Heart, Minus, Plus } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import { productSchema, breadcrumbSchema } from '../utils/structuredData';

const STYLE_LABELS = { 'shoulder-bag': 'Shoulder Bag', handbag: 'Handbag', crossbody: 'Crossbody Bag', tote: 'Tote', clutch: 'Clutch' };

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('details');
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    setActiveImage(0);
    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);
        setRelated(data.related);
      })
      .catch(() => navigate('/shop'));
  }, [slug, navigate]);

  if (!product) return <div className="flex min-h-[50vh] items-center justify-center text-brown/50">Loading...</div>;

  const images = product.images?.length ? product.images : [{ url: '/placeholder-bag.svg' }];
  const styleLabel = STYLE_LABELS[product.productType] || 'Bag';
  const fallbackTitle = `${product.name} — Handmade ${product.category?.name || ''} ${styleLabel} | FilatoCo`.replace(/\s+/g, ' ');
  const fallbackDescription = `${product.name}: a handmade ${styleLabel.toLowerCase()} from FilatoCo's ${product.category?.name || 'handmade'} collection. ${product.shortDescription || ''}`.trim();

  return (
    <>
      <Seo
        title={product.seoTitle || fallbackTitle}
        description={product.seoDescription || product.shortDescription || fallbackDescription}
        path={`/product/${product.slug}`}
        image={images[0]?.url}
        type="product"
        jsonLd={[
          productSchema(product),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/shop' },
            ...(product.category ? [{ name: product.category.name, path: `/shop?category=${product.category._id}` }] : []),
            { name: product.name, path: `/product/${product.slug}` },
          ]),
        ]}
      />
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="aspect-square overflow-hidden rounded-xl2 bg-beige">
              <img src={images[activeImage]?.url} alt={`${product.name} — handmade ${styleLabel.toLowerCase()} by FilatoCo`} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${activeImage === i ? 'border-terracotta' : 'border-transparent'}`}>
                    <img src={img.url} alt={`${product.name} view ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-terracotta">{product.category?.name}</p>
            <h1 className="mt-2 font-serif text-3xl text-brown md:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xl text-terracotta">${product.price.toFixed(2)}</span>
              {product.comparePrice > product.price && <span className="text-brown/40 line-through">${product.comparePrice.toFixed(2)}</span>}
            </div>
            <p className="mt-5 text-brown/70">{product.description}</p>

            <dl className="mt-5 space-y-1 text-sm text-brown/70">
              {product.materials?.length > 0 && <div><dt className="inline font-medium">Material: </dt><dd className="inline">{product.materials.join(', ')}</dd></div>}
              {product.colors?.length > 0 && <div><dt className="inline font-medium">Color: </dt><dd className="inline">{product.colors.join(', ')}</dd></div>}
              {product.dimensions && <div><dt className="inline font-medium">Dimensions: </dt><dd className="inline">{product.dimensions}</dd></div>}
              <div><dt className="inline font-medium">Availability: </dt><dd className="inline">{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</dd></div>
              {product.madeType === 'custom-made' && <div className="font-medium text-terracotta">Custom Made — crafted to order</div>}
            </dl>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-full border border-beige px-4 py-2">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus size={16} /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}><Plus size={16} /></button>
              </div>
              <button onClick={() => toggle(product._id)} className="rounded-full border border-beige p-3" aria-label="Wishlist">
                <Heart size={18} fill={isWishlisted(product._id) ? '#B86F4A' : 'none'} color={isWishlisted(product._id) ? '#B86F4A' : 'currentColor'} />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => addItem(product, quantity)} disabled={product.stock < 1} className="btn-primary flex-1 disabled:opacity-40">Add to Cart</button>
              <button
                onClick={() => {
                  addItem(product, quantity);
                  navigate('/checkout');
                }}
                disabled={product.stock < 1}
                className="btn-secondary flex-1 disabled:opacity-40"
              >
                Buy Now
              </button>
            </div>
            <p className="mt-4 text-xs text-brown/50">Handmade to order — ships within 5–10 business days. See shipping &amp; returns for details.</p>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex gap-6 border-b border-beige">
            {['details', 'care', 'shipping'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`pb-3 text-sm font-medium capitalize ${tab === t ? 'border-b-2 border-terracotta text-brown' : 'text-brown/50'}`}>
                {t === 'care' ? 'Care Instructions' : t === 'shipping' ? 'Shipping & Returns' : 'Product Details'}
              </button>
            ))}
          </div>
          <div className="py-6 text-sm text-brown/70">
            {tab === 'details' && <p>{product.description}</p>}
            {tab === 'care' && <p>Hand wash cold with mild soap and lay flat to dry. Avoid direct sunlight and store in a dust bag. See our full <Link to="/care-instructions" className="text-terracotta underline">Care Instructions</Link>.</p>}
            {tab === 'shipping' && <p>Handmade items ship within 5–10 business days. See our <Link to="/shipping-returns" className="text-terracotta underline">Shipping &amp; Returns</Link> policy.</p>}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="section-heading text-center">You May Also Like</h2>
            <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
