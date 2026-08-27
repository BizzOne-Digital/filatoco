import { useEffect, useState } from 'react';
import api from '../../services/api';

const StatCard = ({ label, value }) => (
  <div className="rounded-xl2 bg-offwhite p-5 shadow-soft">
    <p className="text-xs uppercase tracking-wider text-brown/50">{label}</p>
    <p className="mt-2 font-serif text-3xl text-brown">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <p className="text-brown/50">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} />
        <StatCard label="Completed Orders" value={stats.completedOrders} />
        <StatCard label="Revenue" value={`$${stats.revenue.toFixed(2)}`} />
        <StatCard label="Customers" value={stats.customers} />
        <StatCard label="Contact Messages" value={stats.contactMessages} />
        <StatCard label="Custom Requests" value={stats.customRequests} />
        <StatCard label="Newsletter Subscribers" value={stats.newsletterSubscribers} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl2 bg-offwhite p-5 shadow-soft">
          <h2 className="font-serif text-lg text-brown">Recent Orders</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.recentOrders.map((o) => (
              <li key={o._id} className="flex justify-between border-b border-beige pb-2">
                <span>#{o.orderNumber}</span>
                <span className="capitalize text-terracotta">{o.status}</span>
              </li>
            ))}
            {stats.recentOrders.length === 0 && <p className="text-brown/40">No orders yet.</p>}
          </ul>
        </div>
        <div className="rounded-xl2 bg-offwhite p-5 shadow-soft">
          <h2 className="font-serif text-lg text-brown">Recent Messages</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.recentMessages.map((m) => (
              <li key={m._id} className="border-b border-beige pb-2">
                <p className="font-medium">{m.fullName}</p>
                <p className="text-brown/50">{m.subject || m.message.slice(0, 60)}</p>
              </li>
            ))}
            {stats.recentMessages.length === 0 && <p className="text-brown/40">No messages yet.</p>}
          </ul>
        </div>
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="mt-6 rounded-xl2 bg-offwhite p-5 shadow-soft">
          <h2 className="font-serif text-lg text-brown">Low Stock Products</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.lowStockProducts.map((p) => (
              <li key={p._id} className="flex justify-between border-b border-beige pb-2">
                <span>{p.name}</span>
                <span className="text-terracotta">{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
