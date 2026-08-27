import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const HomepageContent = () => {
  const [form, setForm] = useState({ heroHeading: '', heroSubtext: '', aboutHeading: '', aboutText: '' });
  const [content, setContent] = useState(null);
  const [files, setFiles] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings/homepage').then(({ data }) => {
      setContent(data.content);
      setForm({
        heroHeading: data.content.heroHeading || '',
        heroSubtext: data.content.heroSubtext || '',
        aboutHeading: data.content.aboutHeading || '',
        aboutText: data.content.aboutText || '',
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      Object.entries(files).forEach(([k, f]) => f && fd.append(k, f));
      const { data } = await api.put('/settings/homepage', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setContent(data.content);
      toast.success('Homepage updated');
    } catch {
      toast.error('Could not update homepage');
    } finally {
      setSaving(false);
    }
  };

  if (!content) return <p className="text-brown/50">Loading...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Homepage Content</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4 rounded-xl2 bg-offwhite p-6 shadow-soft">
        <input placeholder="Hero Heading" value={form.heroHeading} onChange={(e) => setForm({ ...form, heroHeading: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
        <textarea placeholder="Hero Subtext" value={form.heroSubtext} onChange={(e) => setForm({ ...form, heroSubtext: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
        <div>
          <label className="mb-1 block text-sm text-brown/70">Hero Image {content.heroImage?.url && '(uploaded)'}</label>
          <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, heroImage: e.target.files[0] })} className="w-full text-sm" />
        </div>
        <input placeholder="About Heading" value={form.aboutHeading} onChange={(e) => setForm({ ...form, aboutHeading: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
        <div>
          <label className="mb-1 block text-sm text-brown/70">About / Founder Image {content.aboutImage?.url && '(uploaded)'}</label>
          <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, aboutImage: e.target.files[0] })} className="w-full text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-brown/70">Process / Studio Image {content.processImage?.url && '(uploaded)'}</label>
          <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, processImage: e.target.files[0] })} className="w-full text-sm" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Homepage Content'}</button>
      </form>
    </div>
  );
};

export default HomepageContent;
