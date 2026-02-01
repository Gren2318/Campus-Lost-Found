import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LogOut, PlusCircle, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth(); // Get user state

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            CampusConnect
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            
            {user ? (
              // ✅ SHOW THIS IF LOGGED IN
              <>
                <Link to="/post" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-lg shadow-blue-500/20">
                  <PlusCircle size={18} />
                  <span>Post Item</span>
                </Link>
                
                <div className="flex items-center gap-2 text-slate-300 ml-2">
                  <User size={18} />
                  <span className="hidden md:inline text-sm">{user.email?.split('@')[0]}</span>
                </div>

                <button 
                  onClick={logout} 
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              // ✅ SHOW THIS IF LOGGED OUT
              <Link to="/login" className="text-slate-300 hover:text-white font-medium px-4 py-2 hover:bg-slate-700 rounded-lg transition-all">
                Login
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;