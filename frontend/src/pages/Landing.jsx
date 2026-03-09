import { Link } from 'react-router-dom';
import { Search, Shield, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-900/20 flex flex-col pt-16 transition-colors duration-300">

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">

        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-40 animate-blob pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl"
        >
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-heading font-black mb-8 text-gray-900 dark:text-white tracking-tight leading-[1.1]">
            Lost something on <br className="hidden md:block"/><span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500 dark:from-primary-400 dark:to-purple-400 px-2">Campus?</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-3xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            The smartest way to reconnect with your belongings. <br className="hidden md:block" />
            AI-powered lost & found for your campus community.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/login"
              className="px-10 py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-black text-xl transition-all shadow-glow w-full sm:w-auto flex items-center justify-center gap-3 hover:-translate-y-1"
            >
              Get Started <ArrowRight size={24} />
            </Link>
            <Link
              to="/register"
              className="px-10 py-5 glass-soft dark:glass-dark text-gray-800 dark:text-gray-200 border border-white/60 dark:border-gray-700/50 rounded-full font-black text-xl transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-hard w-full sm:w-auto hover:-translate-y-1"
            >
              Create Account
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="grid md:grid-cols-3 gap-8 px-6 pb-24 max-w-7xl mx-auto relative z-10"
      >
        <div className="glass-heavy dark:glass-dark p-10 rounded-[2.5rem] border border-white/60 dark:border-gray-700/50 shadow-soft hover:shadow-hard transition-all group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
          <div className="bg-blue-100 dark:bg-blue-900/40 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm relative z-10">
            <Search className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white relative z-10">AI-Powered Search</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-medium relative z-10">Upload a photo and let our AI describe and categorize your items automatically. No more manual searching.</p>
        </div>

        <div className="glass-heavy dark:glass-dark p-10 rounded-[2.5rem] border border-white/60 dark:border-gray-700/50 shadow-soft hover:shadow-hard transition-all group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
          <div className="bg-purple-100 dark:bg-purple-900/40 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm relative z-10">
            <Shield className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white relative z-10">Secure Platform</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-medium relative z-10">Verified campus students only. Safe interactions within your community ensuring your items find the right owner.</p>
        </div>

        <div className="glass-heavy dark:glass-dark p-10 rounded-[2.5rem] border border-white/60 dark:border-gray-700/50 shadow-soft hover:shadow-hard transition-all group overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
          <div className="bg-emerald-100 dark:bg-emerald-900/40 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm relative z-10">
            <Users className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white relative z-10">Community Driven</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-medium relative z-10">Help your peers recover their belongings. Earn trust points and build a safer campus environment together.</p>
        </div>
      </motion.div>

    </div>
  );
};

export default Landing;