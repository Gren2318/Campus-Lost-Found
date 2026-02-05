import { useEffect, useState } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/ToastContext';
import { User, LogOut, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
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
      showToast("Failed to delete item.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 mb-12 border border-gray-100 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <User size={36} />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-1">My Profile</h1>
            <p className="text-gray-500 font-medium">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-full transition-all border border-red-100 font-bold"
        >
          <LogOut size={18} /> Logout
        </button>
      </motion.div>

      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1.5 bg-primary-500 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900">
          My Posted Items <span className="text-gray-400 font-normal ml-2">({items.length})</span>
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.length > 0 ? (
            items.map(item => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item._id}
                className="relative group h-full"
              >

                <ItemCard item={item} />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(item._id);
                  }}
                  className="absolute top-2 left-2 bg-white text-red-500 border border-red-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-50 hover:scale-110 z-10"
                  title="Delete Post"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
                <User size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 text-lg font-medium">You haven't posted any items yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
