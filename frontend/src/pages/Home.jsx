import { useEffect, useState } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import AnimatedDoodle from '../components/AnimatedDoodle';

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
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen pattern-bg">
      
      {/* Background Blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 relative z-10"
      >
        <div className="relative">
          <AnimatedDoodle type="star" className="-top-8 -left-8 w-16 h-16 text-yellow-400" strokeWidth={4} />
          <h1 className="text-5xl font-heading font-black text-gray-900 mb-2 tracking-tight">
            Campus <span className="text-primary-600">Feed</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium">Real-time lost and found updates</p>
          <AnimatedDoodle type="underline" className="-bottom-6 left-0 w-48 h-12 text-primary-400" strokeWidth={5} />
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 group-focus-within:text-primary-600 transition-colors z-20" size={20} />
          <input
            type="text"
            placeholder="Search keys, backpack, library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-soft rounded-3xl py-4 pl-12 pr-4 text-gray-900 focus:glass-heavy focus:border-primary-400 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all font-medium placeholder:text-gray-400 z-10 relative"
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
            className={`px-6 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${categoryFilter === cat
              ? 'bg-primary-600 text-white shadow-glow hover:shadow-glow-hover border border-primary-500'
              : 'glass-soft text-gray-600 hover:glass border border-white/60 hover:text-primary-600'
              }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <RefreshCw className="animate-spin mb-4 text-primary-500" size={32} />
          <p>Loading recent items...</p>
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10"
          >
            {filteredItems.map(item => (
              <ItemCard
                key={item._id}
                item={item}
                onDeleteAction={handleDelete}
              />
            ))}
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mt-4">
              <div className="bg-gray-50 p-4 rounded-full mb-6">
                <Filter className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No items match your search</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Try adjusting your search terms or changing the category filter.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                className="text-primary-600 hover:text-primary-700 font-bold hover:underline"
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