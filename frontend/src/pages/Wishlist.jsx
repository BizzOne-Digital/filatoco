import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    Promise.all(ids.map((id) => api.get(`/products/${id}`).catch(() => null))).then((results) => {
      setProducts(results.filter(Boolean).map((r) => r.data.product));
    });
  }, [ids]);

  return (
    <>
      <Seo title="Your Wishlist | FilatoCo" path="/wishlist" noindex />
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <h1 className="section-heading text-center">Your Wishlist</h1>
        {products.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-brown/50">Your wishlist is empty.</p>
            <Link to="/shop" className="btn-primary mt-6 inline-flex">Browse Products</Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
