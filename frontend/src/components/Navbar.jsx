import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  LogOut,
  PlusCircle,
  User,
  Home,
  MessageCircle,
  ShieldAlert,
  Menu,
  X,
  Map
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import AnimatedDoodle from './AnimatedDoodle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setIsOpen(false);

  // Desktop Sidebar
  if (!isMobile) {
    return (
      <motion.nav 
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="fixed left-0 top-0 h-screen w-20 hover:w-64 glass z-50 border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col justify-between py-8 transition-all duration-300 group overflow-hidden"
      >
        <div className="flex flex-col items-center group-hover:items-start px-2 group-hover:px-6 w-full space-y-8">
          
          <Link to="/" className="flex items-center gap-4 w-full justify-center group-hover:justify-start">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl text-white shadow-glow shrink-0">
              <Map size={24} />
            </div>
            <span className="text-xl font-heading font-black text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Campus<span className="text-primary-500">Connect</span>
            </span>
          </Link>

          <div className="flex flex-col gap-4 w-full">
            <NavItem to="/" icon={<Home size={22} />} label="Home Feed" active={isActive('/')} />
            {user && (
              <>
                <NavItem to="/post" icon={<PlusCircle size={22} />} label="Post Item" active={isActive('/post')} isPrimary />
                <NavItem to="/inbox" icon={<MessageCircle size={22} />} label="Messages" active={isActive('/inbox')} badge />
                <NavItem to="/profile" icon={<User size={22} />} label="Profile" active={isActive('/profile')} />
                {user.role === 'admin' && (
                  <NavItem to="/admin/logs" icon={<ShieldAlert size={22} />} label="Security Logs" active={isActive('/admin/logs')} isDanger />
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center group-hover:items-start px-2 w-full space-y-4 group-hover:px-6">
          <div className="flex items-center gap-4 w-full justify-center group-hover:justify-start p-3">
             <ThemeToggle />
             <span className="font-bold text-sm text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Theme</span>
          </div>

          {user ? (
            <button onClick={logout} className="flex items-center gap-4 w-full p-3 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all justify-center group-hover:justify-start">
              <LogOut size={22} className="shrink-0" />
              <span className="font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Logout</span>
            </button>
          ) : (
             <Link to="/login" className="flex items-center gap-4 w-full p-3 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-all justify-center group-hover:justify-start">
              <User size={22} className="shrink-0" />
              <span className="font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Login</span>
            </Link>
          )}
        </div>
      </motion.nav>
    );
  }

  // Mobile Bottom Dock + Top Bar
  return (
    <>
      <nav className="fixed top-0 w-full z-40 glass border-b border-gray-200/50 dark:border-gray-800/50 px-4 h-16 flex items-center justify-between md:hidden">
        <Link to="/" className="text-xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Map className="text-primary-500" size={24} /> CampusConnect
        </Link>
        <ThemeToggle />
      </nav>

      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 glass rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-2 flex justify-around items-center shadow-hard md:hidden"
      >
        <MobileNavItem to="/" icon={<Home size={24} />} active={isActive('/')} />
        
        {user ? (
          <>
            <MobileNavItem to="/inbox" icon={<MessageCircle size={24} />} active={isActive('/inbox')} badge />
            <Link to="/post" className="bg-primary-600 text-white p-4 rounded-full -mt-8 shadow-glow border-4 border-white dark:border-gray-900 hover:scale-105 transition-transform">
              <PlusCircle size={24} />
            </Link>
            <MobileNavItem to="/profile" icon={<User size={24} />} active={isActive('/profile')} />
            {user.role === 'admin' ? (
               <MobileNavItem to="/admin/logs" icon={<ShieldAlert size={24} />} active={isActive('/admin/logs')} isDanger />
            ) : (
                <button onClick={logout} className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={24} />
                </button>
            )}
          </>
        ) : (
          <Link to="/login" className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 p-3 rounded-2xl font-bold flex items-center gap-2">
            <User size={20} /> Login
          </Link>
        )}
      </motion.nav>
    </>
  );
};

const NavItem = ({ to, icon, label, active, badge, isPrimary, isDanger }) => {
  let baseClass = "flex items-center gap-4 w-full p-3 rounded-2xl transition-all justify-center group-hover:justify-start ";
  
  if (isPrimary) {
    baseClass += "bg-primary-600 text-white shadow-md hover:shadow-glow hover:-translate-y-0.5";
  } else if (isDanger) {
    baseClass += active ? "bg-red-50 text-red-600 dark:bg-red-900/20" : "text-gray-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20";
  } else {
    baseClass += active ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-primary-500 dark:text-gray-400 dark:hover:bg-gray-800/50";
  }

  return (
    <Link to={to} className={baseClass}>
      <div className="relative shrink-0">
        {icon}
        {badge && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>}
      </div>
      <span className={`text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${active && !isPrimary && !isDanger ? 'font-black text-primary-600 dark:text-primary-400' : 'font-medium'}`}>
        {label}
      </span>
    </Link>
  );
};

const MobileNavItem = ({ to, icon, active, badge, isDanger }) => {
  let colorClass = active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300';
  if (isDanger) colorClass = active ? 'text-red-500' : 'text-red-300 hover:text-red-500';

  return (
    <Link to={to} className={`p-3 relative transition-colors ${colorClass}`}>
      {icon}
      {badge && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>}
      {active && (
        <motion.div layoutId="mobileNavIndicator" className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isDanger ? 'bg-red-500' : 'bg-primary-600 dark:bg-primary-400'}`} />
      )}
    </Link>
  );
};

export default Navbar;