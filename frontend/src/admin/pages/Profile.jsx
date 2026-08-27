import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Profile = () => {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const updateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      await refresh();
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/change-password', pwForm);
      toast.success('Password updated');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update password');
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Admin Profile</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <form onSubmit={updateProfile} className="space-y-3 rounded-xl2 bg-offwhite p-6 shadow-soft">
          <h2 className="font-medium text-brown">Profile Details</h2>
          <input placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save'}</button>
        </form>

        <form onSubmit={changePassword} className="space-y-3 rounded-xl2 bg-offwhite p-6 shadow-soft">
          <h2 className="font-medium text-brown">Change Password</h2>
          <input type="password" required placeholder="Current password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <input type="password" required minLength={8} placeholder="New password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="w-full rounded-lg border border-beige px-4 py-2 text-sm" />
          <button type="submit" className="btn-primary w-full">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
