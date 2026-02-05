import { useEffect, useState } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">

      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">Campus Feed</h1>
          <p className="text-gray-500 text-lg">Real-time lost and found updates</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search keys, backpack, library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-gray-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Lost', 'Found'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${categoryFilter === cat
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 scale-105'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <RefreshCw className="animate-spin mb-4 text-primary-500" size={32} />
          <p>Loading recent items...</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map(item => (
              <ItemCard key={item._id} item={item} />
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
    </div>
  );
};

export default Home;