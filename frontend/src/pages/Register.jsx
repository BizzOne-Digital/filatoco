import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/my-account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <>
      <Seo title="Create Account | FilatoCo" path="/register" noindex />
      <div className="mx-auto max-w-md px-5 py-16 md:px-8">
        <h1 className="section-heading text-center">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="First Name" value={form.firstName} onChange={set('firstName')} className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <input required placeholder="Last Name" value={form.lastName} onChange={set('lastName')} className="rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          </div>
          <input type="email" required placeholder="Email" value={form.email} onChange={set('email')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          <input placeholder="Phone" value={form.phone} onChange={set('phone')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          <input type="password" required minLength={8} placeholder="Password (min 8 characters)" value={form.password} onChange={set('password')} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-brown/60">
          Already have an account? <Link to="/login" className="text-terracotta">Sign in</Link>
        </p>
      </div>
    </>
  );
};

export default Register;
