import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Phone, Mail, Instagram, Facebook } from 'lucide-react';
import api from '../services/api';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    subject: type === 'custom' ? 'Custom Bag Request' : type === 'appointment' ? 'Appointment Request' : '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We will get back to you soon.');
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <>
      <Helmet><title>Contact Us | FilatoCo</title></Helmet>
      <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <h1 className="section-heading text-center">Let's Connect</h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-brown/60">Personal appointments available — let's create something beautiful together.</p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="space-y-4 text-brown/70">
            <p className="flex items-center gap-3"><Phone size={18} className="text-terracotta" /> 905 5165462</p>
            <p className="flex items-center gap-3"><Mail size={18} className="text-terracotta" /> mirellascarcelli@gmail.com</p>
            <p className="flex items-center gap-3"><Instagram size={18} className="text-terracotta" /> @filatoco</p>
            <p className="flex items-center gap-3"><Facebook size={18} className="text-terracotta" /> Mirella Scarcelli</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Full Name" value={form.fullName} onChange={set('fullName')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <input type="email" required placeholder="Email" value={form.email} onChange={set('email')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <input placeholder="Phone" value={form.phone} onChange={set('phone')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <input placeholder="Subject" value={form.subject} onChange={set('subject')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <textarea required rows={4} placeholder="Message" value={form.message} onChange={set('message')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
