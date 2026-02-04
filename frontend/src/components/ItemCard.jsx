import { Link } from 'react-router-dom';
import { MapPin, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import api from '../services/api';

const ItemCard = ({ item, onDelete }) => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';

  const imageUrl = item.image_url 
    ? `http://localhost:8000${item.image_url}` 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  const handleDeleteClick = async (e) => {
    e.preventDefault(); 

    if (window.confirm("Admin Action: Delete this post?")) {
      try {
        await api.delete(`/items/${item._id}`);

        if (onDelete) {
          onDelete(item._id);
        } else {
          window.location.reload(); 
        }

      } catch (err) {
        alert("Failed to delete");
        console.log(err);
      }
    }
  };

  return (
    <div className="relative group">
      
      <Link 
        to={`/items/${item._id}`} 
        className="block bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 h-full flex flex-col"
      >
        
        <div className="h-48 overflow-hidden bg-slate-900 relative">
          <img 
            src={imageUrl}
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
              item.category === 'Lost' 
                ? 'bg-red-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {item.category}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <MapPin size={16} className="text-blue-400" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs mt-auto pt-3 border-t border-slate-700/50">
            <Calendar size={14} />
            <span>{item.date_lost}</span>
          </div>
        </div>

      </Link>

      {isAdmin && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 left-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 z-20 transition-transform hover:scale-110"
          title="Admin Delete"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default ItemCard;
