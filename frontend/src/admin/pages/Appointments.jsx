import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const load = () => api.get('/appointments').then(({ data }) => setAppointments(data.appointments));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    toast.success('Status updated');
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Appointments</h1>
      <div className="mt-6 space-y-4">
        {appointments.map((a) => (
          <div key={a._id} className="flex items-center justify-between rounded-xl2 bg-offwhite p-5 shadow-soft">
            <div>
              <p className="font-medium text-brown">{a.name} — {a.email}</p>
              <p className="text-sm text-brown/60">{a.phone} {a.preferredDate ? `· ${new Date(a.preferredDate).toLocaleDateString()}` : ''}</p>
              <p className="mt-1 text-sm text-brown/70">{a.message}</p>
            </div>
            <select value={a.status} onChange={(e) => updateStatus(a._id, e.target.value)} className="rounded-lg border border-beige px-2 py-1 text-xs capitalize">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {appointments.length === 0 && <p className="text-brown/40">No appointment requests yet.</p>}
      </div>
    </div>
  );
};

export default Appointments;
