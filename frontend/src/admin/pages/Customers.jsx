import { useEffect, useState } from 'react';
import api from '../../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get('/admin/customers').then(({ data }) => setCustomers(data.customers));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Customers</h1>
      <div className="mt-6 overflow-x-auto rounded-xl2 bg-offwhite shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-beige text-left text-brown/50">
              <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b border-beige">
                <td className="p-4">{c.firstName} {c.lastName}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.phone || '—'}</td>
                <td className="p-4">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-brown/40">No customers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
