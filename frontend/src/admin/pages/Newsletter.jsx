import { useEffect, useState } from 'react';
import api from '../../services/api';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    api.get('/newsletter').then(({ data }) => setSubscribers(data.subscribers));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Newsletter Subscribers ({subscribers.length})</h1>
      <div className="mt-6 overflow-x-auto rounded-xl2 bg-offwhite shadow-soft">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-beige text-left text-brown/50"><th className="p-4">Email</th><th className="p-4">Status</th><th className="p-4">Subscribed</th></tr></thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s._id} className="border-b border-beige">
                <td className="p-4">{s.email}</td>
                <td className="p-4">{s.isActive ? 'Active' : 'Unsubscribed'}</td>
                <td className="p-4">{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {subscribers.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-brown/40">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Newsletter;
