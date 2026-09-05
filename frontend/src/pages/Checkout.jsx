import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Seo from '../components/Seo';

const initial = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', province: '', postalCode: '', country: 'Canada', notes: '',
};

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...initial, email: user?.email || '', firstName: user?.firstName || '', lastName: user?.lastName || '' });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.productId, quantity: i.quantity })),
        customer: { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone },
        shippingAddress: {
          address: form.address, city: form.city, province: form.province, postalCode: form.postalCode, country: form.country,
        },
        notes: form.notes,
      });
      clearCart();
      navigate('/order-success', { state: { order: data.order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Checkout | FilatoCo" path="/checkout" noindex />
      <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <h1 className="section-heading">Checkout</h1>
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          <form onSubmit={handleSubmit} className="space-y-4 md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <input name="firstName" required value={form.firstName} onChange={handleChange} placeholder="First Name" className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
              <input name="lastName" required value={form.lastName} onChange={handleChange} placeholder="Last Name" className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="Email" className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            </div>
            <input name="address" required value={form.address} onChange={handleChange} placeholder="Address" className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <div className="grid grid-cols-3 gap-4">
              <input name="city" required value={form.city} onChange={handleChange} placeholder="City" className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
              <input name="province" required value={form.province} onChange={handleChange} placeholder="Province" className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
              <input name="postalCode" required value={form.postalCode} onChange={handleChange} placeholder="Postal Code" className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            </div>
            <input name="country" required value={form.country} onChange={handleChange} placeholder="Country" className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Order notes (optional)" rows={3} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />

            <div className="rounded-lg bg-beige/50 p-4 text-sm text-brown/70">
              Payment is collected securely after order review. Our team will contact you to confirm payment details for this handmade order.
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <div className="h-fit rounded-xl2 bg-offwhite p-6 shadow-soft">
            <h2 className="font-serif text-xl text-brown">Order Summary</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((i) => (
                <li key={i.productId} className="flex justify-between">
                  <span>{i.name} × {i.quantity}</span>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-beige pt-4 font-semibold text-brown">
              <span>Total</span><span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
