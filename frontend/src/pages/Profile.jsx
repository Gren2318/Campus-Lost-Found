import { useEffect, useState } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/useAuth';
import { User, LogOut, Trash2 } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const response = await api.get('/items/user/me');
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching my items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-slate-800 rounded-2xl p-8 mb-10 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="text-slate-400">{user?.email}</p>
          </div>
        </div>

        <button 
          onClick={logout}
          className="flex items-center gap-2 px-6 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all border border-red-500/50"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">
        My Posted Items ({items.length})
      </h2>

      {loading ? (
        <div className="text-white text-center p-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? (
            items.map(item => (
              <div key={item._id} className="relative group">
                
                <ItemCard item={item} />

                <button
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleDelete(item._id);
                  }}
                  className="absolute top-2 left-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700 z-10"
                  title="Delete Post"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
              <p className="text-slate-400 mb-4">You haven't posted any items yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
