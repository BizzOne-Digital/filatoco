import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const productTypes = [
  { value: '', label: 'All Styles' },
  { value: 'shoulder-bag', label: 'Shoulder Bag' },
  { value: 'handbag', label: 'Handbag' },
  { value: 'crossbody', label: 'Crossbody' },
  { value: 'tote', label: 'Tote' },
  { value: 'clutch', label: 'Clutch' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { productType: routeProductType } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const productType = routeProductType || searchParams.get('productType') || '';
  const category = searchParams.get('category') || '';
  const madeType = searchParams.get('madeType') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: { productType, category, madeType, sort, search, minPrice, maxPrice, page, limit: 12 } })
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, [productType, category, madeType, sort, search, minPrice, maxPrice, page]);

  const activeCategory = category ? categories.find((c) => c._id === category) : null;

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <>
      <Helmet><title>Shop | FilatoCo</title></Helmet>
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <h1 className="section-heading text-center">Shop the Collection</h1>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <input
            defaultValue={search}
            onKeyDown={(e) => e.key === 'Enter' && updateParam('search', e.target.value)}
            placeholder="Search products..."
            className="rounded-full border border-beige bg-offwhite px-4 py-2 text-sm"
          />
          <select value={category} onChange={(e) => updateParam('category', e.target.value)} className="rounded-full border border-beige bg-offwhite px-4 py-2 text-sm">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={productType} onChange={(e) => updateParam('productType', e.target.value)} className="rounded-full border border-beige bg-offwhite px-4 py-2 text-sm">
            {productTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={madeType} onChange={(e) => updateParam('madeType', e.target.value)} className="rounded-full border border-beige bg-offwhite px-4 py-2 text-sm">
            <option value="">Ready & Custom</option>
            <option value="ready-made">Ready Made</option>
            <option value="custom-made">Custom Made</option>
          </select>
          <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="rounded-full border border-beige bg-offwhite px-4 py-2 text-sm">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="featured">Featured</option>
          </select>
          <input type="number" placeholder="Min $" defaultValue={minPrice} onBlur={(e) => updateParam('minPrice', e.target.value)} className="w-20 rounded-full border border-beige bg-offwhite px-3 py-2 text-sm" />
          <input type="number" placeholder="Max $" defaultValue={maxPrice} onBlur={(e) => updateParam('maxPrice', e.target.value)} className="w-20 rounded-full border border-beige bg-offwhite px-3 py-2 text-sm" />
        </div>

        {activeCategory && (
          <div className="mt-8 overflow-hidden rounded-xl2 bg-offwhite shadow-soft">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {activeCategory.image?.url && (
                <img src={activeCategory.image.url} alt={activeCategory.name} className="h-40 w-full object-cover sm:h-36 sm:w-56" />
              )}
              <div className="px-5 py-4 sm:py-0">
                <h2 className="font-serif text-xl text-brown">{activeCategory.name}</h2>
                {activeCategory.description && <p className="mt-1 text-sm text-brown/70">{activeCategory.description}</p>}
              </div>
            </div>
            {activeCategory.name === 'Tapestry' && (
              <div className="grid grid-cols-2 gap-3 border-t border-beige p-3 sm:grid-cols-4">
                {[
                  { src: '/material-fabric-1.jpg', label: 'Folded Fabric Detail' },
                  { src: '/material-fabric-2.jpg', label: 'Rolled Fabric Bolts' },
                  { src: '/material-brocade.jpg', label: 'Brocade Pattern Detail' },
                  { src: '/material-spools-1.jpg', label: 'Ribbon & Twine' },
                ].map((item) => (
                  <div key={item.src}>
                    <img src={item.src} alt={item.label} className="aspect-square w-full rounded-lg object-cover" />
                    <p className="mt-1.5 text-center text-xs text-brown/60">{item.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <p className="mt-16 text-center text-brown/50">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="mt-16 text-center text-brown/50">No products found. Try adjusting your filters.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {pages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => updateParam('page', n)}
                className={`h-9 w-9 rounded-full text-sm ${page === n ? 'bg-brown text-cream' : 'border border-beige text-brown'}`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
