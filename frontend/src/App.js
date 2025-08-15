import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PGListings from './pages/PGListings';
import PGDetails from './pages/PGDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OwnerDashboard from './pages/OwnerDashboard';
import Profile from './pages/Profile';
import AddPG from './pages/AddPG';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://easy-pg-finder.onrender.com/api/auth';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData.data.user || userData.user || userData);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Add refreshUser function
  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData.data.user || userData.user || userData);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const login = (userData) => {
    setUser(userData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          user={user}
          logout={logout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/listings" element={<PGListings darkMode={darkMode} />} />
            <Route path="/pg/:id" element={<PGDetails darkMode={darkMode} />} />
            <Route path="/login" element={<Login darkMode={darkMode} onLogin={login} />} />
            <Route path="/register" element={<Register darkMode={darkMode} />} />
            <Route path="/forgot-password" element={<ForgotPassword darkMode={darkMode} />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard darkMode={darkMode} user={user}  />} />
            <Route path="/profile" element={<Profile darkMode={darkMode} user={user} logout={logout} refreshUser={refreshUser} />} />
            <Route path="/add-pg" element={<AddPG darkMode={darkMode} />} />
          </Routes>
        </main>
        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}

export default App;
