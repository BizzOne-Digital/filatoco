import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';
import toast from 'react-hot-toast';
import api from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password reset. Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Reset Password | FilatoCo" path="/reset-password" noindex />
      <div className="mx-auto max-w-md px-5 py-16 md:px-8">
        <h1 className="section-heading text-center">Set a New Password</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input type="password" required minLength={8} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-beige bg-offwhite px-4 py-3 text-sm" />
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Saving...' : 'Reset Password'}</button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
