import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Loader, AlertCircle, User, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      await register({ username, email, password });
      showToast("Registration Successful! Please Login.", "success");
      navigate('/login');
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          setError(detail[0].msg);
        } else {
          setError(detail);
        }
      } else {
        setError('Registration failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-hard w-full max-w-md border border-gray-100"
      >

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-primary-600 mb-6 transition-colors font-medium">
            <ArrowLeft size={16} className="mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl font-heading font-bold text-gray-900 flex items-center justify-center gap-3">
            <div className="bg-primary-50 p-2 rounded-xl text-primary-600">
              <UserPlus size={28} />
            </div>
            Sign Up
          </h1>
          <p className="text-gray-500 mt-2">Join your campus community today</p>
        </div>

        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-medium justify-center"
          >
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1.5">Username</label>
            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                placeholder="johndoe123"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                placeholder="student@college.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1.5">Confirm Password</label>
            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 hover:-translate-y-0.5 active:translate-y-0 mt-6"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold hover:underline">
            Login here
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Register;