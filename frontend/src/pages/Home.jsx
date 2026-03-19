import { useEffect, useState } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import { GlowingEffect } from '../components/ui/glowing-effect';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items/');
        const sortedItems = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setItems(sortedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

    const text = searchTerm.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text) ||
      item.location.toLowerCase().includes(text);

    return matchesCategory && matchesSearch;
    
  });

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
      showToast("Item deleted successfully", "success");
    } catch (error) {
      console.error("Failed to delete item:", error);
      showToast("Failed to delete item.", "error");
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen bg-black">
      
      {/* Background Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 relative z-10"
      >
        <div className="relative">
          <h1 className="text-5xl font-heading font-black text-white mb-2 tracking-tight">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300">Feed</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium">Real-time lost and found updates</p>
        </div>

        <div className="relative w-full md:w-[450px] group shrink-0">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors z-20" size={24} />
          <input
            type="text"
            placeholder="Search keys, backpack, library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900/50 backdrop-blur-xl rounded-2xl py-3 pl-14 pr-6 text-white focus:bg-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-medium placeholder:text-gray-500 shadow-[0_0_30px_rgba(14,165,233,0.05)] text-sm border border-gray-800 z-10 relative"
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide relative z-10 px-2"
      >
        {['All', 'Lost', 'Found'].map((cat) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap text-sm border ${categoryFilter === cat
              ? 'bg-primary-600 text-white border-primary-500 shadow-[0_0_15px_rgba(14,165,233,0.4)]'
              : 'bg-gray-900/50 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
              }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-gray-500">
          <RefreshCw className="animate-spin mb-4 text-primary-500" size={32} />
          <p>Loading recent items...</p>
        </div>
      ) : (
        <>
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
          >
            {filteredItems.map(item => (
              <li key={item._id} className="relative min-h-[24rem] list-none rounded-3xl">
                <GlowingEffect blur={0} borderWidth={2} spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
                <ItemCard
                  item={item}
                  onDeleteAction={handleDelete}
                />
              </li>
            ))}
          </motion.ul>

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800 backdrop-blur-sm shadow-sm mt-4">
              <div className="bg-gray-900 p-4 rounded-full mb-6 border border-gray-800 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                <Filter className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No items match your search</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Try adjusting your search terms or changing the category filter.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                className="text-primary-500 hover:text-primary-400 font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
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

export default Home;