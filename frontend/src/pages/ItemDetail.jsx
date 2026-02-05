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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">

      <button
        onClick={() => navigate('/')}
        className="text-gray-500 hover:text-primary-600 flex items-center gap-2 mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Back to Feed
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-hard flex flex-col lg:flex-row"
      >

        <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-8 lg:border-r border-gray-100">
          <img
            src={`http://localhost:8000${item.image_url}`}
            alt={item.title}
            className="w-full h-auto max-h-[500px] object-contain rounded-2xl shadow-sm mix-blend-multiply"
          />
        </div>

        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-white">

          <div className="flex justify-between items-start mb-6">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase ${item.category === 'Lost'
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-green-50 text-green-600 border border-green-100'
              }`}>
              {item.category}
            </span>
            <span className="text-gray-500 text-sm flex items-center gap-1.5 font-medium bg-gray-50 px-3 py-1 rounded-full">
              <Calendar size={14} /> {item.date_lost}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 leading-tight">
            {item.title}
          </h1>

          <div className="flex items-start gap-3 mb-8">
            <div className="mt-1">
              <MapPin size={20} className="text-primary-500" />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</span>
              <span className="text-lg font-medium text-gray-800">{item.location}</span>
            </div>
          </div>

          <div className="mb-10">
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</span>
            <p className="text-gray-600 leading-relaxed text-lg">
              {item.description}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-gray-100">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              Posted by
            </h3>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-10 h-10 rounded-full flex items-center justify-center text-gray-500">
                  <User size={20} />
                </div>
                <span className="text-gray-900 font-bold">{item.owner_id}</span>
              </div>

              {user?.email !== item.owner_id && (
                <button
                  onClick={() => navigate(`/chat/${item.owner_id}`)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle size={18} /> Chat with Owner
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