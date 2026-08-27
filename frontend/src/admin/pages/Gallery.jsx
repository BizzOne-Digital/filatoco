import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Plus } from 'lucide-react';
import api from '../../services/api';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [caption, setCaption] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/gallery').then(({ data }) => setItems(data.items));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select an image');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('caption', caption);
      fd.append('link', link);
      fd.append('image', file);
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image added');
      setCaption(''); setLink(''); setFile(null);
      load();
    } catch {
      toast.error('Could not add image');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    await api.delete(`/gallery/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Instagram Gallery</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap items-end gap-3 rounded-xl2 bg-offwhite p-5 shadow-soft">
        <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
        <input placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} className="rounded-lg border border-beige px-3 py-2 text-sm" />
        <input placeholder="Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} className="rounded-lg border border-beige px-3 py-2 text-sm" />
        <button type="submit" disabled={saving} className="btn-primary"><Plus size={16} /> {saving ? 'Adding...' : 'Add'}</button>
      </form>

      <div className="mt-6 grid grid-cols-3 gap-4 md:grid-cols-6">
        {items.map((g) => (
          <div key={g._id} className="group relative aspect-square overflow-hidden rounded-lg">
            <img src={g.image?.url} alt="" className="h-full w-full object-cover" />
            <button onClick={() => handleDelete(g._id)} className="absolute right-1 top-1 rounded-full bg-brown/80 p-1 text-cream opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-brown/40">No gallery images yet.</p>}
      </div>
    </div>
  );
};

export default Gallery;
