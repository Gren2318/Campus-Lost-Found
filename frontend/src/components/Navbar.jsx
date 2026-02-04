import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { 
  LogOut, 
  PlusCircle, 
  User, 
  Home, 
  MessageCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Menu, 
  X     
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <Link 
            to="/" 
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            CampusConnect
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/logs" 
                    className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all ${
                      isActive('/admin/logs') 
                        ? 'bg-red-600 text-white border-red-500' 
                        : 'bg-red-900/20 text-red-400 border-red-900/50 hover:bg-red-900/40'
                    }`}
                  >
                    <ShieldAlert size={14} />
                    <span className="text-xs font-bold uppercase tracking-wide">Logs</span>
                  </Link>
                )}

                <Link to="/" className={`p-2 rounded-full transition-colors ${isActive('/') ? 'text-white bg-slate-700' : 'text-slate-300 hover:text-white'}`}>
                  <Home size={22} />
                </Link>

                <Link to="/inbox" className={`p-2 rounded-full transition-colors relative ${isActive('/inbox') ? 'text-white bg-slate-700' : 'text-slate-300 hover:text-white'}`}>
                  <MessageCircle size={22} />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-slate-800 rounded-full animate-pulse"></span>
                </Link>

                <Link to="/post" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-lg shadow-blue-500/20">
                  <PlusCircle size={18} />
                  <span>Post Item</span>
                </Link>

                <Link to="/profile" className={`flex items-center gap-2 transition-colors ${isActive('/profile') ? 'text-white' : 'text-slate-300 hover:text-white'}`}>
                  <div className="bg-slate-700 p-1.5 rounded-full">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">{user.username || user.email?.split('@')[0]}</span>
                    {user.role === 'admin' && (
                        <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold mt-0.5">
                            <ShieldCheck size={10} /> ADMIN
                        </span>
                    )}
                  </div>
                </Link>

                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-full transition-all">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-slate-300 hover:text-white font-medium px-4 py-2 hover:bg-slate-700 rounded-lg transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-700 animate-fadeIn">
          <div className="px-4 pt-2 pb-6 space-y-2">
            
            {user ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-4 border border-slate-700">
                  <div className="bg-purple-600 p-2 rounded-full text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-white font-bold">{user.username || user.email?.split('@')[0]}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    {user.role === 'admin' && (
                       <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold mt-1">
                          <ShieldCheck size={10} /> ADMINISTRATOR
                       </span>
                    )}
                  </div>
                </div>

                <Link to="/" onClick={closeMenu} className="flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-3 rounded-lg transition-colors">
                  <Home size={20} /> Home Feed
                </Link>

                <Link to="/inbox" onClick={closeMenu} className="flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-3 rounded-lg transition-colors justify-between">
                  <div className="flex items-center gap-3"><MessageCircle size={20} /> Messages</div>
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                </Link>

                <Link to="/post" onClick={closeMenu} className="flex items-center gap-3 text-blue-400 hover:text-blue-300 hover:bg-slate-800 px-3 py-3 rounded-lg transition-colors font-bold">
                  <PlusCircle size={20} /> Post Lost Item
                </Link>

                <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-3 rounded-lg transition-colors">
                  <User size={20} /> My Profile
                </Link>

                {user.role === 'admin' && (
                  <Link to="/admin/logs" onClick={closeMenu} className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-3 rounded-lg transition-colors border border-red-900/30">
                    <ShieldAlert size={20} /> Security Logs
                  </Link>
                )}

                <div className="border-t border-slate-700 my-2"></div>

                <button onClick={() => { logout(); closeMenu(); }} className="w-full flex items-center gap-3 text-red-400 hover:text-white hover:bg-red-600 px-3 py-3 rounded-lg transition-colors">
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={closeMenu} className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold">
                  Login
                </Link>
                <Link to="/register" onClick={closeMenu} className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold">
                  Sign Up
                </Link>
              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;