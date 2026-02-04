import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Loader, AlertCircle, User } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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
      alert("Registration Successful! Please Login.");
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <UserPlus className="text-purple-500" /> Sign Up
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-purple-500 outline-none"
                placeholder="johndoe123"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-purple-500 outline-none"
                placeholder="student@college.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-purple-500 outline-none"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-purple-500 outline-none"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;