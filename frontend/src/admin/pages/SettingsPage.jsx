import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const SettingsPage = () => {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setForm(data.settings));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/settings', form);
      setForm(data.settings);
      toast.success('Settings updated');
    } catch {
      toast.error('Could not update settings');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <p className="text-brown/50">Loading...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Site Settings</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 rounded-xl2 bg-offwhite p-6 shadow-soft">
        <input placeholder="Site Name" value={form.siteName || ''} onChange={(e) => setForm({ ...form, siteName: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
        <input placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
        <input placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
        <input placeholder="Instagram handle" value={form.instagram || ''} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
        <input placeholder="Facebook" value={form.facebook || ''} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Min Price" value={form.priceRangeMin || ''} onChange={(e) => setForm({ ...form, priceRangeMin: e.target.value })} className="rounded-lg border border-beige px-4 py-2 text-sm" />
          <input type="number" placeholder="Max Price" value={form.priceRangeMax || ''} onChange={(e) => setForm({ ...form, priceRangeMax: e.target.value })} className="rounded-lg border border-beige px-4 py-2 text-sm" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Settings'}</button>
      </form>
    </div>
  );
};

export default SettingsPage;
