import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const statuses = ['new', 'contacted', 'quoted', 'in-progress', 'completed', 'declined'];

const CustomRequests = () => {
  const [requests, setRequests] = useState([]);

  const load = () => api.get('/custom-requests').then(({ data }) => setRequests(data.requests));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/custom-requests/${id}/status`, { status });
    toast.success('Status updated');
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Custom Bag Requests</h1>
      <div className="mt-6 space-y-4">
        {requests.map((r) => (
          <div key={r._id} className="flex gap-4 rounded-xl2 bg-offwhite p-5 shadow-soft">
            {r.referenceImage?.url && <img src={r.referenceImage.url} alt="" className="h-20 w-20 rounded-lg object-cover" />}
            <div className="flex-1">
              <p className="font-medium text-brown">{r.name} — {r.email}</p>
              <p className="text-sm text-brown/60">{r.bagType} · {r.size} · {r.colors} · {r.budgetRange}</p>
              <p className="mt-1 text-sm text-brown/70">{r.description}</p>
            </div>
            <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="h-fit rounded-lg border border-beige px-2 py-1 text-xs capitalize">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {requests.length === 0 && <p className="text-brown/40">No custom requests yet.</p>}
      </div>
    </div>
  );
};

export default CustomRequests;
