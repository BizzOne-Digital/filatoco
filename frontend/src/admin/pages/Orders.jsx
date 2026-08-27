import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const statuses = ['pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  const load = () => api.get('/orders/admin', { params: { status: filter, limit: 100 } }).then(({ data }) => setOrders(data.orders));
  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    toast.success('Order status updated');
    load();
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

      <div className="mt-6 overflow-x-auto rounded-xl2 bg-offwhite shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-beige text-left text-brown/50">
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
              <tr key={o._id} className="border-b border-beige">
                <td className="p-4">{o.orderNumber}</td>
                <td className="p-4">{o.customer.firstName} {o.customer.lastName}<br /><span className="text-xs text-brown/50">{o.customer.email}</span></td>
                <td className="p-4">${o.total.toFixed(2)}</td>
                <td className="p-4 capitalize">{o.paymentStatus}</td>
                <td className="p-4">
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
    </div>
  );
};

export default Orders;
