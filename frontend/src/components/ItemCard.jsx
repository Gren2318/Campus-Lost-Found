import { Link } from 'react-router-dom';
import { MapPin, Calendar, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 }
  }
};

const ItemCard = ({ item, onDelete, onDeleteAction }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const isAdmin = user?.role === 'admin';

  const imageUrl = item.image_url
    ? `http://localhost:8000${item.image_url}`
    : 'https://via.placeholder.com/400x300?text=No+Image';

  const handleDeleteClick = async (e) => {
    e.preventDefault();

    if (onDeleteAction) {
      onDeleteAction(item._id);
      return;
    }

    if (window.confirm("Admin Action: Delete this post?")) {
      try {
        await api.delete(`/items/${item._id}`);

        if (onDelete) {
          onDelete(item._id);
        } else {
          window.location.reload();
        }

      } catch (err) {
        showToast("Failed to delete", "error");
        console.log(err);
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="relative h-full rounded-[inherit] bg-gray-950 p-2 overflow-hidden flex flex-col group/card"
    >
      <Link
        to={`/items/${item._id}`}
        className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden relative z-10 transition-colors group-hover/card:border-gray-700"
      >
        <div className="relative p-2 rounded-xl">
          <div className="overflow-hidden rounded-xl bg-black">
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-auto min-h-[180px] object-cover transition-transform duration-700 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100"
            />
          </div>

          <div className="absolute top-4 right-4 z-10">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md uppercase tracking-wider ${item.category === 'Lost'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
              {item.category}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-heading font-black text-white mb-2 line-clamp-2 group-hover/card:text-primary-400 transition-colors leading-tight">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4 font-medium">
            <MapPin size={16} className="text-primary-500 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wide">
              <Calendar size={14} />
              <span>{item.date_lost}</span>
            </div>
            <ArrowRight size={16} className="text-gray-600 group-hover/card:text-primary-500 group-hover/card:translate-x-1 transition-all" />
          </div>
        </div>

      </Link>

      {isAdmin && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-4 left-4 bg-red-500/20 text-red-400 border border-red-500/30 p-2 text-sm rounded-full shadow-lg hover:bg-red-600 hover:text-white z-20 transition-all hover:scale-110"
          title="Admin Delete"
        >
          <Trash2 size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default ItemCard;
