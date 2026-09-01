import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import api from '../../services/api';
import { filterOversizedFiles, MAX_IMAGE_MB } from '../../utils/validateImage';

// Style options within a category (category itself = Crocheted or Tapestry, managed separately).
const productTypes = ['shoulder-bag', 'handbag', 'crossbody', 'tote', 'clutch'];

const emptyForm = {
  name: '', sku: '', description: '', shortDescription: '', price: '', comparePrice: '',
  category: '', subcategory: '', materials: '', colors: '', dimensions: '', stock: 1,
  productType: 'shoulder-bag', madeType: 'ready-made', isFeatured: false, isNewArrival: false,
  status: 'published', seoTitle: '', seoDescription: '',
};

const ProductForm = ({ product, onClose, onSaved }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        ...emptyForm,
        ...product,
        category: product.category?._id || product.category || '',
        materials: (product.materials || []).join(', '),
        colors: (product.colors || []).join(', '),
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(emptyForm).forEach(([k]) => {
        const v = form[k];
        if (k === 'materials' || k === 'colors') {
          v.split(',').map((s) => s.trim()).filter(Boolean).forEach((item) => fd.append(k, item));
        } else if (v !== undefined && v !== null) {
          fd.append(k, v);
        }
      });
      files.forEach((f) => fd.append('images', f));

      if (product) {
        await api.put(`/products/${product._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl2 bg-offwhite p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-brown">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Product Name" value={form.name} onChange={set('name')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="SKU" value={form.sku} onChange={set('sku')} className="rounded-lg border border-beige px-4 py-2 text-sm" />
            <input type="number" min="0" required placeholder="Stock" value={form.stock} onChange={set('stock')} className="rounded-lg border border-beige px-4 py-2 text-sm" />
          </div>
          <textarea required placeholder="Description" value={form.description} onChange={set('description')} rows={3} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input placeholder="Short Description" value={form.shortDescription} onChange={set('shortDescription')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" step="0.01" min="0" required placeholder="Price" value={form.price} onChange={set('price')} className="rounded-lg border border-beige px-4 py-2 text-sm" />
            <input type="number" step="0.01" min="0" placeholder="Compare Price" value={form.comparePrice} onChange={set('comparePrice')} className="rounded-lg border border-beige px-4 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select required value={form.category} onChange={set('category')} className="rounded-lg border border-beige px-4 py-2 text-sm">
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={form.productType} onChange={set('productType')} className="rounded-lg border border-beige px-4 py-2 text-sm">
              {productTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <input placeholder="Materials (comma separated)" value={form.materials} onChange={set('materials')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input placeholder="Colors (comma separated)" value={form.colors} onChange={set('colors')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input placeholder="Dimensions" value={form.dimensions} onChange={set('dimensions')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />

          <div className="grid grid-cols-2 gap-3">
            <select value={form.madeType} onChange={set('madeType')} className="rounded-lg border border-beige px-4 py-2 text-sm">
              <option value="ready-made">Ready Made</option>
              <option value="custom-made">Custom Made</option>
            </select>
            <select value={form.status} onChange={set('status')} className="rounded-lg border border-beige px-4 py-2 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex gap-6 text-sm text-brown">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNewArrival} onChange={set('isNewArrival')} /> New Arrival</label>
          </div>

          <input placeholder="SEO Title" value={form.seoTitle} onChange={set('seoTitle')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input placeholder="SEO Description" value={form.seoDescription} onChange={set('seoDescription')} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />

          <div>
            <label className="mb-1 block text-sm text-brown/70">Product Images — max {MAX_IMAGE_MB}MB each</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(filterOversizedFiles(Array.from(e.target.files), toast))}
              className="w-full text-sm"
            />
            {product?.images?.length > 0 && (
              <div className="mt-2 flex gap-2">
                {product.images.map((img) => <img key={img.publicId} src={img.url} alt="" className="h-12 w-12 rounded object-cover" />)}
              </div>
            )}
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Product'}</button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
