import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Copy, Star, Sparkles, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from 'lucide-react';
import api from '../../services/api';
import ProductForm from '../components/ProductForm';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reordering, setReordering] = useState(false);

  const load = () => api.get('/products', { params: { limit: 100, sort: 'manual' } }).then(({ data }) => setProducts(data.products));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted');
    load();
  };

  const handleDuplicate = async (id) => {
    await api.post(`/products/${id}/duplicate`);
    toast.success('Product duplicated');
    load();
  };

  const saveOrder = async (reordered) => {
    setProducts(reordered);
    setReordering(true);
    try {
      // One atomic request instead of one-per-product — a transient hiccup on
      // any single request used to fail the whole reorder with no clear reason.
      await api.put('/products/reorder', {
        order: reordered.map((p, i) => ({ id: p._id, sortOrder: i })),
      });
    } catch (err) {
      toast.error(err.response?.status === 401 ? 'Your session expired — please log in again.' : 'Could not save new order');
      load();
    } finally {
      setReordering(false);
    }
  };

  const move = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= products.length) return;
    const reordered = [...products];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    saveOrder(reordered);
  };

  const moveToEnd = (index, toStart) => {
    const reordered = [...products];
    const [item] = reordered.splice(index, 1);
    if (toStart) reordered.unshift(item);
    else reordered.push(item);
    saveOrder(reordered);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-brown">Products</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Product</button>
      </div>
      <p className="mt-2 text-xs text-brown/70">
        Rank products with the arrows — this order controls Featured Order on the Shop page and the homepage.
        Use the double-arrows to jump straight to the top or bottom.
      </p>

      {showForm && (
        <ProductForm
          product={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}

      {products.length === 0 ? (
        <p className="mt-10 text-center text-brown/40">No products yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <div key={p._id} className="overflow-hidden rounded-xl2 bg-offwhite shadow-soft">
              <div className="relative aspect-[4/5] bg-beige">
                <img src={p.images?.[0]?.url} alt={p.name} className="h-full w-full object-cover" />
                <span
                  className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    p.status === 'published' ? 'bg-sage/80 text-brown' : 'bg-taupe/80 text-brown'
                  }`}
                >
                  {p.status}
                </span>
                <div className="absolute right-2 top-2 flex gap-1">
                  {p.isFeatured && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-offwhite/90 text-terracotta" title="Featured">
                      <Star size={12} fill="currentColor" />
                    </span>
                  )}
                  {p.isNewArrival && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-offwhite/90 text-terracotta" title="New Arrival">
                      <Sparkles size={12} />
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <button
                    onClick={() => moveToEnd(i, true)}
                    disabled={i === 0 || reordering}
                    aria-label="Move to top of ranking"
                    title="Move to top"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-offwhite/90 text-brown disabled:opacity-30"
                  >
                    <ChevronsUp size={12} />
                  </button>
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0 || reordering}
                    aria-label="Move up in ranking"
                    title="Move up"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-offwhite/90 text-brown disabled:opacity-30"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === products.length - 1 || reordering}
                    aria-label="Move down in ranking"
                    title="Move down"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-offwhite/90 text-brown disabled:opacity-30"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    onClick={() => moveToEnd(i, false)}
                    disabled={i === products.length - 1 || reordering}
                    aria-label="Move to bottom of ranking"
                    title="Move to bottom"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-offwhite/90 text-brown disabled:opacity-30"
                  >
                    <ChevronsDown size={12} />
                  </button>
                </div>
              </div>

              <div className="p-3 text-center">
                <h3 className="truncate font-serif text-base text-brown" title={p.name}>{p.name}</h3>
                <div className="mt-1 flex items-center justify-center gap-2 text-sm">
                  <span className="text-terracotta">${p.price.toFixed(2)}</span>
                  <span className="text-brown/40">&bull;</span>
                  <span className={p.stock > 0 ? 'text-brown/80' : 'text-red-500'}>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</span>
                </div>

                <div className="mt-3 flex justify-center gap-4 border-t border-beige pt-3">
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-brown hover:text-terracotta" aria-label="Edit"><Edit2 size={16} /></button>
                  <button onClick={() => handleDuplicate(p._id)} className="text-brown hover:text-terracotta" aria-label="Duplicate"><Copy size={16} /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-brown hover:text-red-600" aria-label="Delete"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
