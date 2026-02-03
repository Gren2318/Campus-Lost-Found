import { MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  // Construct image URL (points to your local backend folder)
  const imageUrl = item.image_url 
    ? `http://localhost:8000${item.image_url}` 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <Link 
      to={`/items/${item._id}`} 
      className="block bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
    >
      <div className="h-48 overflow-hidden relative group">
        <img 
          src={imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full backdrop-blur-sm text-white ${item.category === 'Lost' ? 'bg-red-500/80' : 'bg-green-500/80'}`}>
          {item.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2 truncate">{item.title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between text-xs text-slate-500 mt-4 border-t border-slate-700 pt-3">
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-blue-500" />
            {item.location}
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-purple-500" />
            {item.date_lost}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;