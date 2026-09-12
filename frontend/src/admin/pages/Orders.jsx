import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import api from '../../services/api';

const statuses = ['pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const load = () => api.get('/orders/admin', { params: { status: filter, limit: 100 } }).then(({ data }) => setOrders(data.orders));
  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    toast.success('Order status updated');
    load();
    setSelected((s) => (s && s._id === id ? { ...s, status } : s));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-brown">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-beige px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <p className="mt-2 text-xs text-brown/70">Click any row to view the items, shipping address and notes for that order.</p>

      <div className="mt-6 overflow-x-auto rounded-xl2 bg-offwhite shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-beige text-left text-brown/70">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} onClick={() => setSelected(o)} className="cursor-pointer border-b border-beige hover:bg-cream/60">
                <td className="p-4">{o.orderNumber}</td>
                <td className="p-4">{o.customer.firstName} {o.customer.lastName}<br /><span className="text-xs text-brown/70">{o.customer.email}</span></td>
                <td className="p-4">${o.total.toFixed(2)}</td>
                <td className="p-4 capitalize">{o.paymentStatus}</td>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="rounded-lg border border-beige px-2 py-1 text-xs capitalize">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-brown/40">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl2 bg-offwhite p-6 shadow-soft" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-xl text-brown">Order #{selected.orderNumber}</h2>
                <p className="text-xs text-brown/60">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-brown/60 hover:text-brown" aria-label="Close"><X size={20} /></button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <select value={selected.status} onChange={(e) => updateStatus(selected._id, e.target.value)} className="rounded-lg border border-beige px-3 py-1.5 text-sm capitalize">
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="rounded-full bg-beige px-3 py-1 text-xs capitalize text-brown">Payment: {selected.paymentStatus}</span>
            </div>

            <div className="mt-5">
              <h3 className="text-xs font-medium uppercase tracking-wide text-brown/60">Customer</h3>
              <p className="mt-1 text-sm text-brown">{selected.customer.firstName} {selected.customer.lastName}</p>
              <p className="text-sm text-brown/80">{selected.customer.email}</p>
              {selected.customer.phone && <p className="text-sm text-brown/80">{selected.customer.phone}</p>}
            </div>

            {selected.shippingAddress?.address && (
              <div className="mt-5">
                <h3 className="text-xs font-medium uppercase tracking-wide text-brown/60">Shipping Address</h3>
                <p className="mt-1 text-sm text-brown/80">
                  {selected.shippingAddress.address}, {selected.shippingAddress.city}, {selected.shippingAddress.province} {selected.shippingAddress.postalCode}, {selected.shippingAddress.country}
                </p>
              </div>
            )}

            <div className="mt-5">
              <h3 className="text-xs font-medium uppercase tracking-wide text-brown/60">Items</h3>
              <div className="mt-2 space-y-2">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-beige p-2">
                    {item.image && <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />}
                    <div className="flex-1">
                      <p className="text-sm text-brown">{item.name}</p>
                      <p className="text-xs text-brown/60">Qty {item.quantity} &times; ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-brown">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {selected.notes && (
              <div className="mt-5">
                <h3 className="text-xs font-medium uppercase tracking-wide text-brown/60">Customer Notes</h3>
                <p className="mt-1 text-sm text-brown/80">{selected.notes}</p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-beige pt-4">
              <span className="text-sm text-brown/70">Subtotal: ${selected.subtotal.toFixed(2)}</span>
              <span className="font-serif text-lg text-brown">Total: ${selected.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
