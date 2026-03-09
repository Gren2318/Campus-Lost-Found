import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Loader, AlertCircle, User, ArrowLeft, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import AnimatedDoodle from '../components/AnimatedDoodle';

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
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Right Side: Creative Branding (Reversed for Register) */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-700 dark:to-primary-900 p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
        <div className="absolute inset-0 pattern-bg opacity-10"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob pointer-events-none"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex justify-end"
        >
          <Link to="/" className="text-3xl font-heading font-black text-white flex items-center gap-2">
            CampusConnect
            <Sparkles size={28} className="text-yellow-300" />
          </Link>
        </motion.div>

        <div className="relative z-10 flex flex-col items-end text-right">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="relative"
          >
            <AnimatedDoodle type="arrow" className="absolute -top-16 -right-10 w-24 h-24 text-yellow-300 opacity-80" strokeWidth={3} />
            <h1 className="text-5xl lg:text-7xl font-heading font-black text-white leading-tight mb-6 mt-10">
              Join the<br/><span className="text-primary-100">community.</span>
            </h1>
            
            <p className="text-primary-50 text-lg lg:text-xl max-w-md font-medium ml-auto">
              Create an account to report missing items or help fellow students find what they lost.
            </p>
          </motion.div>
        </div>

        <div className="flex items-center justify-end gap-4 relative z-10">
           <p className="text-sm font-bold text-primary-100">A safer, connected campus</p>
           <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
             <UserPlus className="text-white" />
           </div>
        </div>
      </div>

      {/* Left Side: Glassmorphic Form text-left */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto max-h-screen">
        <div className="absolute inset-0 bg-white dark:bg-gray-900 pointer-events-none opacity-50"></div>
        
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full max-w-md relative z-10 py-10"
        >
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors font-bold text-sm">
              <ArrowLeft size={16} className="mr-1" /> Back to Home
            </Link>
            <h2 className="text-4xl font-heading font-black text-gray-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Get started in seconds.</p>
          </div>

          <div className="glass-soft dark:glass-dark rounded-3xl p-8 shadow-hard border border-white/60 dark:border-gray-700/50">
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-bold justify-center"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1.5 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 pl-12 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm"
                    placeholder="johndoe123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1.5 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 pl-12 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm"
                    placeholder="student@college.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1.5 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 pl-12 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1.5 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 pl-12 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ y: -2, shadow: '0 20px 25px -5px rgba(14, 165, 233, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-glow text-lg mt-8"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : 'Sign Up'}
              </motion.button>
            </form>
          </div>

          <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-black hover:underline transition-colors">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;