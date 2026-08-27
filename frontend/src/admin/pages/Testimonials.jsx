import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Plus } from 'lucide-react';
import api from '../../services/api';

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ customerName: '', review: '', rating: 5 });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/testimonials').then(({ data }) => setItems(data.testimonials));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);
      await api.post('/testimonials', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Testimonial added');
      setForm({ customerName: '', review: '', rating: 5 });
      setFile(null);
      load();
    } catch {
      toast.error('Could not add testimonial');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (t) => {
    await api.put(`/testimonials/${t._id}`, { isPublished: !t.isPublished });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    await api.delete(`/testimonials/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Testimonials</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-3 rounded-xl2 bg-offwhite p-5 shadow-soft">
          <h2 className="font-medium text-brown">Add Testimonial</h2>
          <input required placeholder="Customer Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full rounded-lg border border-beige px-3 py-2 text-sm" />
          <textarea required placeholder="Review" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="w-full rounded-lg border border-beige px-3 py-2 text-sm" />
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full rounded-lg border border-beige px-3 py-2 text-sm">
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
          </select>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm" />
          <button type="submit" disabled={saving} className="btn-primary w-full"><Plus size={16} /> {saving ? 'Saving...' : 'Add'}</button>
        </form>

        <div className="md:col-span-2 space-y-3">
          {items.map((t) => (
            <div key={t._id} className="flex items-center justify-between rounded-xl2 bg-offwhite p-4 shadow-soft">
              <div>
                <p className="font-medium text-brown">{t.customerName} ({t.rating}★)</p>
                <p className="text-sm text-brown/60">{t.review}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => togglePublish(t)} className={`rounded-full px-3 py-1 text-xs ${t.isPublished ? 'bg-sage text-cream' : 'border border-beige text-brown'}`}>
                  {t.isPublished ? 'Published' : 'Unpublished'}
                </button>
                <button onClick={() => handleDelete(t._id)} className="text-brown hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-brown/40">No testimonials yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
