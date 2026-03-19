import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/ToastContext';
import { Send, ArrowLeft, User, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatPage = () => {
  const { email } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await api.get(`/messages/${email}`);
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load chat", error);
      }
    };

    fetchChat();
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);

  }, [email, refreshKey]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post('/messages/', {
        receiver_id: email,
        content: newMessage
      });
      setNewMessage('');
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      showToast("Failed to send message", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-screen pt-16 flex flex-col bg-black">

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-900 p-4 flex items-center gap-4 border-b border-gray-800 shadow-sm z-10 shrink-0"
      >
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-primary-400 transition-colors p-2 hover:bg-gray-800 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 rounded-full text-white shadow-lg shadow-primary-500/20">
          <User size={20} />
        </div>
        <div>
          <h2 className="text-white font-bold text-base leading-tight">{email.split('@')[0]}</h2>
          <p className="text-amber-500 text-xs flex items-center gap-1 font-medium bg-amber-50 px-2 py-0.5 rounded-full w-fit mt-0.5">
            <ShieldAlert size={10} />
            Admin Monitors Chats
          </p>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
        {loading ? (
          <div className="text-center text-gray-500 mt-10">Loading encrypted chat...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p className="font-medium text-base text-gray-400 mb-1">No messages yet.</p>
            <p className="text-sm text-gray-500">Say &quot;Hi&quot; to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user.email;
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] px-5 py-3 rounded-3xl shadow-sm text-sm leading-relaxed ${isMe
                  ? 'bg-primary-600 text-white rounded-br-none shadow-primary-500/20'
                  : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                  }`}>
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1.5 text-right font-medium opacity-80 ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-800 shrink-0">
        <form
          onSubmit={handleSend}
          className="flex gap-3 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 px-5 py-3 rounded-2xl focus:bg-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium placeholder:text-gray-500 text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary-600 hover:bg-primary-700 text-white p-3.5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send size={22} />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatPage;