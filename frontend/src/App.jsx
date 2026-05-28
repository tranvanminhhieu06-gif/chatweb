import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MemphisBg from './components/MemphisBg';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background cố định toàn trang với hiệu ứng pháo hoa */}
      <MemphisBg />
      
      {/* Container chính đè lên trên background */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} 
            />
            <Route 
              path="/" 
              element={user ? <Dashboard currentUser={user} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
