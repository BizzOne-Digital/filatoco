import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Pricing = () => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/products', { params: { limit: 8, sort: 'featured' } }).then(({ data }) => setProducts(data.products));
    api.get('/settings').then(({ data }) => setSettings(data.settings));
  }, []);

  return (
    <>
      <Helmet><title>Pricing | FilatoCo</title></Helmet>
      <div className="mx-auto max-w-5xl px-5 py-16 text-center md:px-8">
        <h1 className="section-heading">Pricing</h1>
        <p className="mx-auto mt-4 max-w-xl text-brown/70">
          Handmade bags generally range from <strong>${settings?.priceRangeMin || 40} – ${settings?.priceRangeMax || 120}</strong>.
          Final pricing depends on design, materials, size, complexity and customization.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/shop" className="btn-primary">Explore Collection</Link>
          <Link to="/custom-request" className="btn-secondary">Request Custom Bag</Link>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-5 text-left md:grid-cols-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </>
  );
};

export default Pricing;
