import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Plus, Edit2, X } from 'lucide-react';
import api from '../../services/api';

const emptyForm = { name: '', description: '' };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/categories').then(({ data }) => setCategories(data.categories));
  useEffect(() => { load(); }, []);

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, description: c.description || '' });
    setFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      if (file) fd.append('image', file);

      if (editingId) {
        await api.put(`/categories/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated');
      } else {
        await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created');
      }
      cancelEdit();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    toast.success('Category deleted');
    if (editingId === id) cancelEdit();
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Categories</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-3 rounded-xl2 bg-offwhite p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-brown">{editingId ? 'Edit Category' : 'Add Category'}</h2>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="text-brown/50 hover:text-terracotta" aria-label="Cancel edit">
                <X size={16} />
              </button>
            )}
          </div>
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-beige px-3 py-2 text-sm" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-beige px-3 py-2 text-sm" />
          {editingId && categories.find((c) => c._id === editingId)?.image?.url && (
            <img src={categories.find((c) => c._id === editingId).image.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          )}
          <div>
            <label className="mb-1 block text-xs text-brown/60">{editingId ? 'Replace image (optional)' : 'Image'}</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {editingId ? <Edit2 size={16} /> : <Plus size={16} />} {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
          </button>
        </form>

        <div className="md:col-span-2">
          <ul className="space-y-3">
            {categories.map((c) => (
              <li key={c._id} className={`flex items-center justify-between rounded-xl2 p-4 shadow-soft ${editingId === c._id ? 'bg-beige' : 'bg-offwhite'}`}>
                <div className="flex items-center gap-3">
                  {c.image?.url && <img src={c.image.url} alt="" className="h-10 w-10 rounded object-cover" />}
                  <span>{c.name}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(c)} className="text-brown hover:text-terracotta" aria-label="Edit category"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(c._id)} className="text-brown hover:text-red-600" aria-label="Delete category"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
            {categories.length === 0 && <p className="text-brown/40">No categories yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Categories;
