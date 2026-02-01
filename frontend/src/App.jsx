import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// 👇 CHANGE 1: Import Provider from the Context file
import { AuthProvider } from './context/AuthContext'; 

// 👇 CHANGE 2: Import Hook from the new Hook file
import { useAuth } from './context/useAuth'; 

import Login from './pages/Login';
import PostItem from './pages/PostItem';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const RootRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div></div>;
  return user ? <Home /> : <Landing />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/post" 
              element={
                <ProtectedRoute>
                  <PostItem />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;