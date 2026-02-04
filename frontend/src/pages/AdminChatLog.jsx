import { useEffect, useState } from 'react';
import api from '../services/api';
import { ShieldAlert, Clock, ArrowRight, MessageSquare } from 'lucide-react';

const AdminChatLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/messages/admin/all');
        setLogs(response.data);
      } catch (error) {
        alert("Access Denied: Admins Only");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
        <div className="bg-red-600 p-3 rounded-full text-white shadow-lg shadow-red-900/20">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Security Logs</h1>
          <p className="text-slate-400 text-sm md:text-base">Monitoring all campus conversations</p>
        </div>
      </div>

      {loading ? (
        <div className="text-white text-center py-10 animate-pulse">Loading logs...</div>
      ) : (
        <>
          <div className="hidden md:block bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 text-sm uppercase">
                <tr>
                  <th className="p-4">Time</th>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Receiver</th>
                  <th className="p-4">Message Content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-blue-400">{log.sender_id}</td>
                    <td className="p-4 text-purple-400">{log.receiver_id}</td>
                    <td className="p-4">
                      <div className="bg-slate-900/50 p-2 rounded text-sm font-mono text-slate-200 border border-slate-700/50">
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
              <div key={log.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 border-b border-slate-700 pb-2">
                  <Clock size={12} />
                  {new Date(log.timestamp).toLocaleString()}
                </div>

                <div className="flex items-center justify-between mb-3 text-sm">
                   <div className="flex flex-col">
                      <span className="text-xs text-slate-500 mb-1">From</span>
                      <span className="text-blue-400 font-medium truncate max-w-[120px]">{log.sender_id.split('@')[0]}</span>
                   </div>

                   <ArrowRight size={16} className="text-slate-600" />

                   <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500 mb-1">To</span>
                      <span className="text-purple-400 font-medium truncate max-w-[120px]">{log.receiver_id.split('@')[0]}</span>
                   </div>
                </div>

                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 relative">
                  <MessageSquare size={12} className="absolute top-3 left-2 text-slate-600" />
                  <p className="pl-5 text-sm text-slate-300 font-mono break-words">
                    {log.content}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminChatLog;