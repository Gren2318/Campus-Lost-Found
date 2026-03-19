import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { MessageCircle, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get('/messages/conversations');
        setConversations(response.data);
      } catch (error) {
        console.error("Failed to load inbox", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary-900/40 p-2.5 rounded-xl text-primary-400">
            <MessageCircle size={28} />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white">My Messages</h1>
        </div>

        <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-hard">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading chats...</div>
          ) : conversations.length === 0 ? (
            <div className="p-16 text-center text-gray-400 flex flex-col items-center">
              <div className="bg-gray-800 p-4 rounded-full mb-4">
                <MessageCircle size={32} className="text-gray-600" />
              </div>
              <p className="mb-1 text-base font-medium text-gray-300">No messages yet</p>
              <p className="text-sm text-gray-500">When someone contacts you about an item, they will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {conversations.map((email) => (
                <Link
                  key={email}
                  to={`/chat/${email}`}
                  className="flex items-center gap-4 p-5 hover:bg-gray-800/60 transition-colors group"
                >
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                    {email.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white font-bold text-base group-hover:text-primary-400 transition-colors">{email.split('@')[0]}</h3>
                    <p className="text-gray-500 text-xs font-medium">Click to view conversation</p>
                  </div>

                  <div className="text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all">
                    <ArrowRight size={20} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Inbox;