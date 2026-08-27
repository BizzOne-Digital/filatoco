import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password | FilatoCo</title></Helmet>
      <div className="mx-auto max-w-md px-5 py-16 md:px-8">
        <h1 className="section-heading text-center">Reset Your Password</h1>
        {sent ? (
          <p className="mt-8 text-center text-brown/70">If an account exists for that email, a reset link has been sent.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send Reset Link'}</button>
          </form>
        )}
      </div>
    </>
  );
};

export default ForgotPassword;
