import { useEffect, useState } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/ToastContext';
import { User, LogOut, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';

const Profile = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const handleDelete = (itemId) => {
    setItemToDelete(itemId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await api.delete(`/items/${itemToDelete}`);
      setItems(items.filter(item => item._id !== itemToDelete));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete item:", error);
      showToast("Failed to delete item.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-heavy dark:glass-dark rounded-[2.5rem] p-8 md:p-12 mb-12 border border-white/60 dark:border-gray-700/50 shadow-hard flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/10 dark:bg-primary-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-glow flex-shrink-0">
            <User size={40} />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl lg:text-3xl font-heading font-black text-gray-900 dark:text-white mb-1 tracking-tight">My Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-300 rounded-2xl transition-all border border-red-200 dark:border-red-800 font-bold shadow-sm text-sm relative z-10 w-full md:w-auto justify-center"
        >
          <LogOut size={20} /> Logout
        </button>
      </motion.div>

      <div className="flex items-center gap-4 mb-10 pl-2">
        <div className="h-10 w-2 bg-primary-500 rounded-full"></div>
        <h2 className="text-xl font-heading font-black text-gray-900 dark:text-white tracking-tight">
          My Posted Items <span className="text-gray-400 dark:text-gray-500 font-medium ml-2 text-base">({items.length})</span>
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-400 dark:text-gray-500 font-bold text-lg animate-pulse">Loading...</div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8 relative z-10">
          {items.length > 0 ? (
            items.map(item => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item._id}
                className="relative group h-full break-inside-avoid"
              >

                <ItemCard item={item} />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(item._id);
                  }}
                  className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-md text-white border border-red-400/50 p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 hover:scale-110 z-20"
                  title="Delete Post"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-32 glass-soft dark:glass-dark rounded-[3rem] border-2 border-dashed border-gray-300 dark:border-gray-700 relative overflow-hidden">
               <div className="absolute inset-0 pattern-bg opacity-5 pointer-events-none"></div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full inline-block mb-6 relative z-10 shadow-inner max-w-max mx-auto">
                <User size={48} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xl font-bold relative z-10">You haven't posted any items yet.</p>
              <p className="text-gray-400 dark:text-gray-500 text-base mt-2 relative z-10 font-medium">Items you report lost or found will appear here.</p>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this post?"
      />
    </div>
  );
};

export default Profile;
