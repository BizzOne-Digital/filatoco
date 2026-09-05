import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { SearchIcon } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    api.get('/products', { params: { search: q } }).then(({ data }) => setProducts(data.products)).finally(() => setLoading(false));
  }, [q]);

  return (
    <>
      <Seo title="Search | FilatoCo" path="/search" noindex />
      <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <h1 className="sr-only">Search FilatoCo Products</h1>
        <div className="relative mx-auto max-w-lg">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/40" size={18} />
          <input
            autoFocus
            defaultValue={q}
            onKeyDown={(e) => e.key === 'Enter' && setSearchParams({ q: e.target.value })}
            placeholder="Search handmade bags..."
            className="w-full rounded-full border border-beige bg-offwhite py-3 pl-11 pr-4 text-sm"
          />
        </div>
        {loading && <p className="mt-10 text-center text-brown/50">Searching...</p>}
        {!loading && q && products.length === 0 && <p className="mt-10 text-center text-brown/50">No results for "{q}".</p>}
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </>
  );
};

export default Search;
