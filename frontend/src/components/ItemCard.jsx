import { Link } from 'react-router-dom';
import { MapPin, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="relative group h-full"
    >
      <Link
        to={`/items/${item._id}`}
        className="block glass-soft dark:glass-dark rounded-[2rem] overflow-hidden shadow-soft hover:shadow-medium border border-white/60 dark:border-gray-700/50 transition-all h-full flex flex-col group/card"
      >

        <div className="overflow-hidden bg-gray-100/50 dark:bg-gray-800/50 relative p-2 m-2 rounded-3xl">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-auto min-h-[160px] object-cover rounded-2xl shadow-sm transition-transform duration-700 group-hover/card:scale-105"
          />

          <div className="absolute top-4 right-4 z-10">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-lg backdrop-blur-md uppercase tracking-wider ${item.category === 'Lost'
              ? 'bg-red-500/90 text-white border border-red-400/50'
              : 'bg-emerald-500/90 text-white border border-emerald-400/50'
              }`}>
              {item.category}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-heading font-black text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover/card:text-primary-600 dark:group-hover/card:text-primary-400 transition-colors leading-tight">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4 font-medium">
            <MapPin size={18} className="text-primary-500 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs mt-auto pt-5 border-t border-gray-100 dark:border-gray-800 font-bold uppercase tracking-wide">
            <Calendar size={14} />
            <span>{item.date_lost}</span>
          </div>
        </div>

      </Link>

      {isAdmin && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 left-2 bg-red-50 text-red-600 border border-red-200 p-2 rounded-full shadow-lg hover:bg-red-600 hover:text-white z-20 transition-all hover:scale-110"
          title="Admin Delete"
        >
          <Trash2 size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default ItemCard;
