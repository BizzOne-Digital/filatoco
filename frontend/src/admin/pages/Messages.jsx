import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../services/api';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const load = () => api.get('/contact').then(({ data }) => setMessages(data.contacts));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api.put(`/contact/${id}/read`);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/contact/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-brown">Contact Messages</h1>
      <div className="mt-6 space-y-3">
        {messages.map((m) => (
          <div key={m._id} onClick={() => !m.isRead && markRead(m._id)} className={`flex items-start justify-between rounded-xl2 p-4 shadow-soft ${m.isRead ? 'bg-offwhite' : 'bg-beige'}`}>
            <div>
              <p className="font-medium text-brown">{m.fullName} — {m.email}</p>
              <p className="text-xs text-brown/50">{m.subject} · {new Date(m.createdAt).toLocaleString()}</p>
              <p className="mt-1 text-sm text-brown/70">{m.message}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(m._id); }} className="text-brown hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
        {messages.length === 0 && <p className="text-brown/40">No messages yet.</p>}
      </div>
    </div>
  );
};

export default Messages;
