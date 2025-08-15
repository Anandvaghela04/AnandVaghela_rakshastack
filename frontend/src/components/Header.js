import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Building2, LogIn, Moon, Sun, User } from 'lucide-react';
import './Header.css';

const Header = ({ darkMode, toggleDarkMode, user, logout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${darkMode ? 'dark' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <Building2 size={32} />
          <span>PG Finder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <Link to="/" className="nav-link">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/listings" className="nav-link">
            <Building2 size={20} />
            <span>PGs</span>
          </Link>
          
          {user ? (
            <Link to="/profile" className="nav-link user-profile-link">
              <User size={20} />
              <span>{user.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="nav-link">
              <LogIn size={20} />
              <span>Login</span>
            </Link>
          )}
          
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''} ${darkMode ? 'dark' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/listings" className="nav-link" onClick={closeMenu}>
            <Building2 size={20} />
            <span>PGs</span>
          </Link>
          
          {user ? (
            <Link to="/profile" className="nav-link user-profile-link" onClick={closeMenu}>
              <User size={20} />
              <span>{user.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="nav-link" onClick={closeMenu}>
              <LogIn size={20} />
              <span>Login</span>
            </Link>
          )}
          
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header; 