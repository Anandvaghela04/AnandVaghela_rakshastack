import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, DollarSign, Users } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import PGCard from '../components/PGCard';
import initScrollOptimizations from '../utils/scrollOptimizer';
import './Home.css';

const Home = ({ darkMode }) => {
  const [featuredPGs, setFeaturedPGs] = useState([]);
  const [savedPGs, setSavedPGs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize scroll optimizations for smooth scrolling
    initScrollOptimizations();
    
    const fetchFeaturedPGs = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/pg');
    const data = await res.json();

    if (res.ok && data.success) {
      if (Array.isArray(data.data?.pgListings)) {
        setFeaturedPGs(data.data.pgListings);
      } else {
        console.error('Unexpected response format:', data);
        setFeaturedPGs([]);
      }
    } else {
      console.error('API Error:', data);
    }
  } catch (error) {
    console.error('Error fetching PGs:', error);
  } finally {
    setLoading(false);
  }
};


    fetchFeaturedPGs();
  }, []);

  const handleSearch = (searchData) => {
    const params = new URLSearchParams();
    if (searchData.location) params.append('city', searchData.location);
    if (searchData.minPrice) params.append('minPrice', searchData.minPrice);
    if (searchData.maxPrice) params.append('maxPrice', searchData.maxPrice);
    if (searchData.gender) params.append('gender', searchData.gender);
    window.location.href = `/listings?${params.toString()}`;
  };

  const handleSavePG = (pgId) => {
    setSavedPGs(prev =>
      prev.includes(pgId)
        ? prev.filter(id => id !== pgId)
        : [...prev, pgId]
    );
  };

  return (
    <div className={`home ${darkMode ? 'dark' : ''}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect PG
            <span className="hero-subtitle">Accommodation</span>
          </h1>
          <p className="hero-description">
            Discover comfortable, affordable, and verified PG accommodations across India. 
            From students to professionals, we have the perfect place for everyone.
          </p>

          <div className="hero-search">
            <SearchBar onSearch={handleSearch} darkMode={darkMode} />
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">PG Listings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Cities</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured PGs Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured PG Accommodations</h2>
            <p className="section-subtitle">
              Handpicked premium PG accommodations for your comfort
            </p>
            <Link to="/listings" className="view-all-btn">
              View All PGs
              <ArrowRight size={20} />
            </Link>
          </div>

          {loading ? (
            <p>Loading PGs...</p>
          ) : featuredPGs.length > 0 ? (
            <div className="featured-grid">
              {featuredPGs.slice(0, 3).map(pg => (
                <PGCard
                  key={pg._id}
                  pg={pg}
                  darkMode={darkMode}
                  onSave={handleSavePG}
                  isSaved={savedPGs.includes(pg._id)}
                />
              ))}
            </div>
          ) : (
            <p>No PG accommodations found.</p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose PG Finder?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Star size={32} />
              </div>
              <h3>Verified Listings</h3>
              <p>All PG accommodations are verified and quality-checked for your safety.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <MapPin size={32} />
              </div>
              <h3>Prime Locations</h3>
              <p>Find PGs in prime locations near colleges, offices, and transport hubs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <DollarSign size={32} />
              </div>
              <h3>Best Prices</h3>
              <p>Compare prices and find the best deals for your budget requirements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Gender-Specific</h3>
              <p>Filter by gender preferences to find the most suitable accommodation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
