import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const tabs = ['Overview', 'Orders', 'Addresses', 'Change Password'];

const MyAccount = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [addrForm, setAddrForm] = useState({ label: '', firstName: '', lastName: '', phone: '', address: '', city: '', province: '', postalCode: '', country: 'Canada' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    if (tab === 'Orders') api.get('/orders/my-orders').then(({ data }) => setOrders(data.orders));
  }, [tab]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users/addresses', addrForm);
      setAddresses(data.addresses);
      toast.success('Address added');
    } catch {
      toast.error('Could not add address');
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
    <>
      <Helmet><title>My Account | FilatoCo</title></Helmet>
      <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <h1 className="section-heading">My Account</h1>
        <div className="mt-8 flex flex-wrap gap-3">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2 text-sm ${tab === t ? 'bg-sage text-cream' : 'border border-beige text-brown'}`}>{t}</button>
          ))}
          <button onClick={handleLogout} className="ml-auto rounded-full border border-terracotta px-5 py-2 text-sm text-terracotta">Logout</button>
        </div>

        <div className="mt-8">
          {tab === 'Overview' && (
            <div className="rounded-xl2 bg-offwhite p-6 shadow-soft">
              <p className="text-brown">Welcome back, {user?.firstName}!</p>
              <p className="mt-2 text-sm text-brown/60">{user?.email}</p>
            </div>
          )}

          {tab === 'Orders' && (
            <div className="space-y-4">
              {orders.length === 0 && <p className="text-brown/50">No orders yet.</p>}
              {orders.map((o) => (
                <div key={o._id} className="rounded-xl2 bg-offwhite p-5 shadow-soft">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-brown">#{o.orderNumber}</span>
                    <span className="capitalize text-terracotta">{o.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-brown/60">{new Date(o.createdAt).toLocaleDateString()} · ${o.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'Addresses' && (
            <div className="grid gap-8 md:grid-cols-2">
              <ul className="space-y-3">
                {addresses.map((a) => (
                  <li key={a._id} className="rounded-xl2 bg-offwhite p-4 text-sm shadow-soft">
                    <p className="font-medium">{a.label}</p>
                    <p>{a.address}, {a.city}, {a.province} {a.postalCode}</p>
                  </li>
                ))}
              </ul>
              <form onSubmit={addAddress} className="space-y-3">
                <input placeholder="Label (Home, Work)" value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-2 text-sm" />
                <input placeholder="Address" required value={addrForm.address} onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-2 text-sm" />
                <div className="grid grid-cols-3 gap-2">
                  <input placeholder="City" required value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="rounded-lg border border-beige bg-offwhite px-3 py-2 text-sm" />
                  <input placeholder="Province" required value={addrForm.province} onChange={(e) => setAddrForm({ ...addrForm, province: e.target.value })} className="rounded-lg border border-beige bg-offwhite px-3 py-2 text-sm" />
                  <input placeholder="Postal" required value={addrForm.postalCode} onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })} className="rounded-lg border border-beige bg-offwhite px-3 py-2 text-sm" />
                </div>
                <button type="submit" className="btn-primary w-full">Add Address</button>
              </form>
            </div>
          )}

          {tab === 'Change Password' && (
            <form onSubmit={changePassword} className="max-w-sm space-y-3">
              <input type="password" required placeholder="Current password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-2 text-sm" />
              <input type="password" required minLength={8} placeholder="New password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-2 text-sm" />
              <button type="submit" className="btn-primary w-full">Update Password</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default MyAccount;
