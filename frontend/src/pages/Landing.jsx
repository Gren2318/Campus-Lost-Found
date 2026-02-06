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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex flex-col pt-16">

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">

        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl"
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-heading font-bold mb-6 text-gray-900 tracking-tight">
            Lost something on <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">Campus?</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The smartest way to reconnect with your belongings. <br className="hidden md:block" />
            AI-powered lost & found for your campus community.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-1 w-full sm:w-auto"
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
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-soft hover:shadow-medium transition-all group">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Search className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">AI-Powered Search</h3>
          <p className="text-gray-500 leading-relaxed">Upload a photo and let our AI describe and categorize your items automatically. No more manual searching.</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-soft hover:shadow-medium transition-all group">
          <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Secure Platform</h3>
          <p className="text-gray-500 leading-relaxed">Verified campus students only. Safe interactions within your community ensuring your items find the right owner.</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-soft hover:shadow-medium transition-all group">
          <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Community Driven</h3>
          <p className="text-gray-500 leading-relaxed">Help your peers recover their belongings. Earn trust points and build a safer campus environment together.</p>
        </div>
      </motion.div>

    </div>
  );
};

export default Landing;