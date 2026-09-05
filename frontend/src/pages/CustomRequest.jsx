import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Seo from '../components/Seo';
import { breadcrumbSchema } from '../utils/structuredData';

const initial = { name: '', email: '', phone: '', bagType: '', size: '', colors: '', materials: '', budgetRange: '', description: '' };

const CustomRequest = () => {
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('referenceImage', file);
      await api.post('/custom-requests', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Custom bag request submitted!');
      setForm(initial);
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Request a Custom Handmade Bag | FilatoCo"
        description="Commission a one-of-a-kind handmade bag from FilatoCo. Tell us your preferred style, size, colors and materials, and we'll bring your custom crochet or tapestry purse to life."
        path="/custom-request"
        jsonLd={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Custom Request', path: '/custom-request' }])}
      />
      <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
        <h1 className="section-heading text-center">Request a Custom Bag</h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-brown/60">
          Tell us about the bag you're dreaming of and we'll bring it to life, stitch by stitch.
        </p>
        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Name" value={form.name} onChange={set('name')} className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <input type="email" required placeholder="Email" value={form.email} onChange={set('email')} className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          </div>
          <input placeholder="Phone" value={form.phone} onChange={set('phone')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Preferred Bag Type" value={form.bagType} onChange={set('bagType')} className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <input placeholder="Preferred Size" value={form.size} onChange={set('size')} className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Preferred Colors" value={form.colors} onChange={set('colors')} className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <input placeholder="Material Preferences" value={form.materials} onChange={set('materials')} className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          </div>
          <input placeholder="Budget Range" value={form.budgetRange} onChange={set('budgetRange')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          <textarea required rows={4} placeholder="Describe your dream bag" value={form.description} onChange={set('description')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          <div>
            <label className="mb-1 block text-sm text-brown/70">Reference Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Submitting...' : 'Submit Request'}</button>
        </form>
      </div>
    </>
  );
};

export default CustomRequest;
