import { useEffect, useState } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { Search, Filter } from 'lucide-react';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔍 Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All', 'Lost', 'Found'

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items/');
        // Sort items: Newest first
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

  // 🧠 Filter Logic
  const filteredItems = items.filter(item => {
    // 1. Check Category
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    
    // 2. Check Search Text (Case insensitive)
    const text = searchTerm.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(text) || 
                          item.description.toLowerCase().includes(text) ||
                          item.location.toLowerCase().includes(text);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campus Feed</h1>
          <p className="text-slate-400">Real-time lost and found updates</p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search keys, backpack, library..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-10 pr-4 text-white focus:border-purple-500 outline-none shadow-lg"
          />
        </div>
      </div>

      {/* 🏷️ Category Toggles */}
      <div className="flex gap-4 mb-8">
        {['All', 'Lost', 'Found'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              categoryFilter === cat 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="text-white text-center py-20 animate-pulse">Loading recent items...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700 mt-4">
              <Filter className="mx-auto text-slate-500 mb-4" size={48} />
              <p className="text-slate-400 text-lg">No items match your search.</p>
              <button 
                onClick={() => {setSearchTerm(''); setCategoryFilter('All');}}
                className="text-purple-400 hover:text-purple-300 mt-2 font-medium"
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