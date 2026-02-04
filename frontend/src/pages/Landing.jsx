import { Link } from 'react-router-dom';
import { Search, Shield, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          CampusConnect
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl">
          The smartest way to find what you lost. <br/>
          AI-powered lost & found for your campus community.
        </p>
        
        <div className="flex gap-4">
          <Link 
            to="/login" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/30"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full font-bold text-lg transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 px-6 pb-20 max-w-6xl mx-auto">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <Search className="w-10 h-10 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">AI-Powered Search</h3>
          <p className="text-slate-400">Upload a photo and let our AI describe and categorize your items automatically.</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <Shield className="w-10 h-10 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
          <p className="text-slate-400">Verified campus students only. Safe interactions within your community.</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <Users className="w-10 h-10 text-green-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Community Driven</h3>
          <p className="text-slate-400">Help your peers recover their belongings. Earn trust points.</p>
        </div>
      </div>

    </div>
  );
};

export default Landing;