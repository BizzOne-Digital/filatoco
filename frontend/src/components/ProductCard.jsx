import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { toggle, isWishlisted } = useWishlist();
  const image = product.images?.[0]?.url || '/placeholder-bag.svg';

  return (
    <Link to={`/product/${product.slug}`} className="group block overflow-hidden rounded-xl2 bg-offwhite shadow-soft transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-beige">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product._id);
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 rounded-full bg-offwhite/90 p-2 text-brown shadow-sm transition-colors hover:text-terracotta"
        >
          <Heart size={15} fill={isWishlisted(product._id) ? '#B86F4A' : 'none'} color={isWishlisted(product._id) ? '#B86F4A' : 'currentColor'} />
        </button>
      </div>
      <div className="px-4 py-4 text-center">
        <h3 className="font-serif text-base text-brown">{product.name}</h3>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="text-sm text-terracotta">${product.price?.toFixed(2)}</span>
          {product.comparePrice > product.price && (
            <span className="text-xs text-brown/40 line-through">${product.comparePrice.toFixed(2)}</span>
          )}
        </div>
        <svg viewBox="0 0 60 8" className="mx-auto mt-2 h-2 w-14 text-terracotta/40" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0 4 Q 10 0, 20 4 T 40 4 T 60 4" strokeDasharray="2 3" />
        </svg>
      </div>
    </Link>
  );
};

export default ProductCard;
