import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedDoodle from '../components/AnimatedDoodle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      
      {/* Left Side: Creative Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-800 dark:to-primary-950 p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
        <div className="absolute inset-0 pattern-bg opacity-10"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <Link to="/" className="text-3xl font-heading font-black text-white flex items-center gap-2">
            <Sparkles size={28} className="text-yellow-300" />
            CampusConnect
          </Link>
        </motion.div>

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="relative"
          >
            <AnimatedDoodle type="star" className="absolute -top-10 -left-10 w-24 h-24 text-yellow-300 opacity-80" strokeWidth={3} />
            <h1 className="text-5xl lg:text-7xl font-heading font-black text-white leading-tight mb-6">
              Find what<br/><span className="text-primary-200">you lost.</span>
            </h1>
            <AnimatedDoodle type="underline" className="w-64 h-16 text-primary-300 -mt-10 mb-8" strokeWidth={5} />
            
            <p className="text-primary-100 text-lg lg:text-xl max-w-md font-medium">
              Join thousands of students keeping the campus connected. Drop a pin, snap a pic, and let the AI do the rest.
            </p>
          </motion.div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-600 bg-primary-200 flex items-center justify-center overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=bae6fd`} alt="avatar" />
                </div>
              ))}
           </div>
           <p className="text-sm font-bold text-primary-100">Trusted by your campus</p>
        </div>
      </div>

      {/* Right Side: Glassmorphic Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute inset-0 bg-white dark:bg-gray-900 pointer-events-none opacity-50"></div>
        
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-10 md:text-left">
            <h2 className="text-4xl font-heading font-black text-gray-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Login to report or find lost items.</p>
          </div>

          <div className="glass-soft dark:glass-dark rounded-3xl p-8 shadow-hard border border-white/60 dark:border-gray-700/50">
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-bold"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm"
                    placeholder="student@college.edu"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 font-medium shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ y: -2, shadow: '0 20px 25px -5px rgba(14, 165, 233, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-glow text-lg mt-2"
              >
                Sign In <ArrowRight size={20} />
              </motion.button>
            </form>
          </div>

          <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-black hover:underline inline-flex items-center gap-1 transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;