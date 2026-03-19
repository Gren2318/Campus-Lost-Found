import { useEffect, useState } from 'react';
import api from '../services/api';
import { ShieldAlert, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

const AdminChatLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/messages/admin/all');
        setLogs(response.data);
      } catch (error) {
        showToast("Access Denied: Admins Only", "error");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10"
      >
        <div className="bg-red-50 p-4 rounded-2xl text-red-600 shadow-lg shadow-red-500/10 border border-red-100">
          <ShieldAlert size={36} />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-1">Security Logs</h1>
          <p className="text-gray-500 font-medium">Monitoring all campus conversations for safety.</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Loading logs...</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="hidden md:block bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-hard">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-6">Time</th>
                  <th className="p-6">Sender</th>
                  <th className="p-6">Receiver</th>
                  <th className="p-6">Message Content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="p-6 whitespace-nowrap text-sm text-gray-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-300" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-6 font-bold text-primary-600">{log.sender_id}</td>
                    <td className="p-6 font-bold text-purple-600">{log.receiver_id}</td>
                    <td className="p-6 w-1/2">
                      <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-700 border border-gray-200">
                        {log.content}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="md:hidden space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-soft">

                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4 border-b border-gray-50 pb-3">
                  <Clock size={14} />
                  {new Date(log.timestamp).toLocaleString()}
                </div>

                <div className="flex items-center justify-between mb-4 text-sm bg-gray-50 p-3 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">From</span>
                    <span className="text-primary-600 font-bold truncate max-w-[120px]">{log.sender_id.split('@')[0]}</span>
                  </div>

                  <ArrowRight size={18} className="text-gray-300" />

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">To</span>
                    <span className="text-purple-600 font-bold truncate max-w-[120px]">{log.receiver_id.split('@')[0]}</span>
                  </div>
                </div>

                <div className="bg-yellow-50/50 p-4 rounded-2xl border border-yellow-100/50 relative">
                  <MessageSquare size={14} className="absolute top-4 left-3 text-yellow-400" />
                  <p className="pl-6 text-sm text-gray-700 break-words leading-relaxed font-medium">
                    {log.content}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminChatLog;