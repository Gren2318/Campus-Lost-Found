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
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary-600 p-2 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <Link
            to="/"
            className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            CampusConnect
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin/logs"
                    className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all duration-300 ${isActive('/admin/logs')
                        ? 'bg-red-50 text-red-600 border-red-200 shadow-sm'
                        : 'bg-transparent text-gray-500 border-transparent hover:bg-red-50 hover:text-red-500'
                      }`}
                  >
                    <ShieldAlert size={16} />
                    <span className="text-xs font-bold uppercase tracking-wide">Logs</span>
                  </Link>
                )}

                <Link to="/" className={`p-2 rounded-full transition-all duration-300 ${isActive('/') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-primary-500 hover:bg-gray-50'}`}>
                  <Home size={22} />
                </Link>

                <Link to="/inbox" className={`p-2 rounded-full transition-all duration-300 relative ${isActive('/inbox') ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-gray-400 hover:text-primary-500 hover:bg-gray-50'}`}>
                  <MessageCircle size={22} />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                </Link>

                <Link to="/post" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-600/40 hover:-translate-y-0.5 active:translate-y-0">
                  <PlusCircle size={18} />
                  <span>Post Item</span>
                </Link>

                <Link to="/profile" className={`flex items-center gap-3 pl-1 pr-3 py-1 rounded-full transition-all border ${isActive('/profile') ? 'border-primary-100 bg-primary-50/50' : 'border-transparent hover:bg-gray-50'}`}>
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-1.5 rounded-full text-primary-700">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 leading-none">{user.username || user.email?.split('@')[0]}</span>
                    {user.role === 'admin' && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                        <ShieldCheck size={10} /> ADMIN
                      </span>
                    )}
                  </div>
                </Link>

                <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium px-5 py-2 hover:bg-primary-50 rounded-full transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">

              {user ? (
                <>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                    <div className="bg-primary-100 p-2.5 rounded-full text-primary-600">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold">{user.username || user.email?.split('@')[0]}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
                          <ShieldCheck size={10} /> ADMINISTRATOR
                        </span>
                      )}
                    </div>
                  </div>

                  <Link to="/" onClick={closeMenu} className="flex items-center gap-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-xl transition-colors font-medium">
                    <Home size={20} /> Home Feed
                  </Link>

                  <Link to="/inbox" onClick={closeMenu} className="flex items-center gap-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-xl transition-colors justify-between font-medium">
                    <div className="flex items-center gap-3"><MessageCircle size={20} /> Messages</div>
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">New</span>
                  </Link>

                  <Link to="/post" onClick={closeMenu} className="flex items-center gap-3 text-primary-600 bg-primary-50 hover:bg-primary-100 px-4 py-3 rounded-xl transition-colors font-bold">
                    <PlusCircle size={20} /> Post Lost Item
                  </Link>

                  <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-xl transition-colors font-medium">
                    <User size={20} /> My Profile
                  </Link>

                  {user.role === 'admin' && (
                    <Link to="/admin/logs" onClick={closeMenu} className="flex items-center gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors border border-red-100 font-medium">
                      <ShieldAlert size={20} /> Security Logs
                    </Link>
                  )}

                  <div className="border-t border-gray-100 my-2"></div>

                  <button onClick={() => { logout(); closeMenu(); }} className="w-full flex items-center gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors font-medium">
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/login" onClick={closeMenu} className="block w-full text-center text-gray-600 hover:bg-gray-100 py-3 rounded-xl font-bold transition-colors">
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all">
                    Sign Up
                  </Link>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;