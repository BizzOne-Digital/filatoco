import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Copy } from 'lucide-react';
import api from '../../services/api';
import ProductForm from '../components/ProductForm';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/products', { params: { limit: 100 } }).then(({ data }) => setProducts(data.products));

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

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-brown">Products</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Product</button>
      </div>

      {showForm && (
        <ProductForm
          product={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}

      <div className="mt-6 overflow-x-auto rounded-xl2 bg-offwhite shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-beige text-left text-brown/50">
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-beige">
                <td className="flex items-center gap-3 p-4">
                  <img src={p.images?.[0]?.url} alt="" className="h-10 w-10 rounded object-cover bg-beige" />
                  {p.name}
                </td>
                <td className="p-4">${p.price.toFixed(2)}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 capitalize">{p.status}</td>
                <td className="p-4">{p.isFeatured ? 'Yes' : 'No'}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-brown hover:text-terracotta"><Edit2 size={16} /></button>
                    <button onClick={() => handleDuplicate(p._id)} className="text-brown hover:text-terracotta"><Copy size={16} /></button>
                    <button onClick={() => handleDelete(p._id)} className="text-brown hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-brown/40">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
