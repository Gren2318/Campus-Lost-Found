import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import { Send, ArrowLeft, User, ShieldAlert } from 'lucide-react';

const ChatPage = () => {
  const { email } = useParams();
  const { user } = useAuth();
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
      alert("Failed to send message");
      console.log(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
      
      <div className="bg-slate-800 p-4 rounded-t-2xl flex items-center gap-4 border-b border-slate-700">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
          <ArrowLeft />
        </button>
        <div className="bg-purple-600 p-2 rounded-full text-white">
          <User size={20} />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Chat with {email.split('@')[0]}</h2>
          <p className="text-slate-400 text-xs flex items-center gap-1">
            <ShieldAlert size={12} className="text-yellow-500" /> 
            Keep sensitive info safe. Admin monitors chats.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 overflow-y-auto p-4 space-y-4 border-x border-slate-700 custom-scrollbar">
        {loading ? (
          <div className="text-center text-slate-500 mt-10">Loading encrypted chat...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            <p>No messages yet.</p>
            <p className="text-sm">Say "Hi" to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user.email;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-700 text-slate-200 rounded-bl-none'
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="bg-slate-800 p-4 rounded-b-2xl border-t border-slate-700 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:border-blue-500 outline-none"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;