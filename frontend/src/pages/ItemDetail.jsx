import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapPin, Calendar, ArrowLeft, Mail, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { motion } from 'framer-motion';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/items/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-400">Loading details...</div>;
  if (!item) return <div className="flex justify-center items-center min-h-screen text-gray-400">Item not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen transition-colors duration-300">

      <button
        onClick={() => navigate('/')}
        className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-2 mb-8 transition-colors font-bold text-sm"
      >
        <ArrowLeft size={16} /> Back to Feed
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-heavy dark:glass-dark rounded-[2.5rem] overflow-hidden shadow-hard flex flex-col lg:flex-row border border-white/60 dark:border-gray-700/50 relative"
      >
        
        {/* Subtle glow behind the image */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/20 dark:bg-primary-900/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full lg:w-1/2 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-center p-8 lg:p-12 lg:border-r border-gray-200 dark:border-gray-800 relative z-10 backdrop-blur-sm">
          <img
            src={`http://localhost:8000${item.image_url}`}
            alt={item.title}
            className="w-full h-auto max-h-[500px] object-contain rounded-3xl shadow-lg mix-blend-multiply dark:mix-blend-normal bg-white dark:bg-gray-800 p-2"
          />
        </div>

        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col relative z-10">

          <div className="flex justify-between items-start mb-8">
            <span className={`px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-sm ${item.category === 'Lost'
                ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              }`}>
              {item.category}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2 font-bold bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md">
              <Calendar size={16} className="text-primary-500" /> {item.date_lost}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-heading font-black text-gray-900 dark:text-white mb-6 leading-tight">
            {item.title}
          </h1>

          <div className="flex items-start gap-4 mb-10 bg-white/40 dark:bg-gray-800/40 p-5 rounded-3xl border border-white/50 dark:border-gray-700/50">
            <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-2xl flex-shrink-0">
              <MapPin size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <span className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Found Location</span>
              <span className="text-base font-bold text-gray-800 dark:text-gray-200">{item.location}</span>
            </div>
          </div>

          <div className="mb-12 flex-grow">
            <span className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Description</span>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-medium">
              {item.description}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-6">
              Posted by
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full sm:w-auto bg-white/40 dark:bg-gray-800/40 p-2 pr-6 rounded-full border border-white/50 dark:border-gray-700/50">
                <div className="bg-gradient-to-br from-primary-400 to-primary-600 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md">
                  <User size={24} />
                </div>
                <span className="text-gray-900 dark:text-white font-semibold text-sm truncate max-w-[150px]">{item.owner_id}</span>
              </div>

              {user?.email !== item.owner_id && (
                <button
                  onClick={() => navigate(`/chat/${item.owner_id}`)}
                  className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-glow flex-shrink-0 text-sm"
                >
                  <MessageCircle size={20} /> Contact Owner
                </button>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ItemDetail;