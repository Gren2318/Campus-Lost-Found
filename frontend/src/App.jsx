import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/ui/navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Home from './pages/Home';
import PostItem from './pages/PostItem';
import ItemDetail from './pages/ItemDetail';
import Profile from './pages/Profile';
import ChatPage from './pages/ChatPage';
import Inbox from './pages/Inbox';
import AdminChatLog from './pages/AdminChatLog';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-white text-center p-20">Loading...</div>;
  return user ? children : <Navigate to="/landing" replace />;
};

const RootRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div></div>;
  return user ? <Home /> : <Landing />;
};

const ConditionalNavbar = () => {
  const { user } = useAuth();
  return user ? <Navbar /> : null;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-transparent font-sans flex text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
              <ConditionalNavbar />

              <div className="flex-1 md:ml-20 w-full mb-20 md:mb-0 transition-all duration-300 mt-16 md:mt-0">
                <Routes>

                  <Route path="/" element={<RootRoute />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route
                    path="/items/:id"
                    element={
                      <ProtectedRoute>
                        <ItemDetail />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/post"
                    element={
                      <ProtectedRoute>
                        <PostItem />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/chat/:email"
                    element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/inbox"
                    element={
                      <ProtectedRoute>
                        <Inbox />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/logs"
                    element={
                      <ProtectedRoute>
                        <AdminChatLog />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" />} />

                </Routes>
              </div>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;