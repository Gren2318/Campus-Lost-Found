import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapPin, Calendar, ArrowLeft, Mail, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/useAuth'; 

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

  if (loading) return <div className="text-white text-center p-20">Loading details...</div>;
  if (!item) return <div className="text-white text-center p-20">Item not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      
      <button 
        onClick={() => navigate('/')}
        className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Feed
      </button>

      <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/2 bg-black/40 flex items-center justify-center p-4">
          <img 
            src={`http://localhost:8000${item.image_url}`} 
            alt={item.title} 
            className="w-full h-auto max-h-[400px] md:max-h-[600px] object-contain rounded-lg"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              item.category === 'Lost'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-green-500/20 text-green-400'
            }`}>
              {item.category}
            </span>
            <span className="text-slate-500 text-sm flex items-center gap-1">
              <Calendar size={14} /> {item.date_lost}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
            {item.title}
          </h1>

          <p className="text-slate-300 mb-8 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center gap-2 text-slate-400 mb-8 p-3 bg-slate-900/50 rounded-lg">
            <MapPin size={20} className="text-blue-500" />
            <span>{item.location}</span>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium mb-3 flex items-center gap-2">
              <User size={16} /> Posted by
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{item.owner_id}</span>
              
              {user?.email !== item.owner_id && (
                <button 
                  onClick={() => navigate(`/chat/${item.owner_id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                  <MessageCircle size={18} /> Chat with Owner
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ItemDetail;