import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Seo from '../components/Seo';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || '/my-account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Login | FilatoCo" path="/login" noindex />
      <div className="mx-auto max-w-md px-5 py-16 md:px-8">
        <h1 className="section-heading text-center">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          <input type="password" required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          <div className="text-right text-sm"><Link to="/forgot-password" className="text-terracotta">Forgot password?</Link></div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-brown/60">
          New to FilatoCo? <Link to="/register" className="text-terracotta">Create an account</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
