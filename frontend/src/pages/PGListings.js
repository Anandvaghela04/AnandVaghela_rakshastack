import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Loader } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import PGCard from '../components/PGCard';
import './PGListings.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://easy-pg-server.onrender.com/api';

const PGListings = ({ darkMode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pgListings, setPgListings] = useState([]);
  const [filteredPGs, setFilteredPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPGs, setSavedPGs] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    amenities: [],
    priceRange: '',
    gender: ''
  });
  // Client-side pagination (Load More)
  const [visibleCount, setVisibleCount] = useState(4);
  const LOAD_STEP = 4;

  // Fetch PG listings from backend
  useEffect(() => {
    const fetchPGs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query params
        const params = new URLSearchParams();
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-');
          params.append('minPrice', min);
          params.append('maxPrice', max);
        }
        if (filters.amenities.length > 0) {
          params.append('amenities', filters.amenities.join(','));
        }
        // Add search bar params from URL
        for (const [key, value] of searchParams.entries()) {
          if (value) params.set(key, value);
        }
        const res = await fetch(`${API_BASE_URL}/pg?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch PG listings');
        const data = await res.json();
        const listings = data.data?.pgListings || [];
        setPgListings(listings);
        setFilteredPGs(listings);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchPGs();
    // eslint-disable-next-line
  }, [searchParams]);

  // Apply filters locally when filters change
  useEffect(() => {
    let filtered = [...pgListings];
    
    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(pg => 
        filters.amenities.every(amenity => 
          pg.amenities && pg.amenities.includes(amenity)
        )
      );
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(pg => {
        const price = pg.price?.monthly || 0;
        return price >= min && price <= max;
      });
    }
    
    // Apply gender filter
    if (filters.gender) {
      filtered = filtered.filter(pg => pg.gender === filters.gender);
    }
    
    setFilteredPGs(filtered);
    // Reset visible items when filters change or source list updates
    setVisibleCount(4);
  }, [filters, pgListings]);

  // Reset visible items when URL search params change
  useEffect(() => {
    setVisibleCount(4);
  }, [searchParams]);

  const handleSearch = (searchData) => {
    // Update URL with search parameters
    const newSearchParams = new URLSearchParams();
    if (searchData.location) newSearchParams.set('city', searchData.location);
    if (searchData.minPrice) newSearchParams.set('minPrice', searchData.minPrice);
    if (searchData.maxPrice) newSearchParams.set('maxPrice', searchData.maxPrice);
    if (searchData.gender) newSearchParams.set('gender', searchData.gender);
    setSearchParams(newSearchParams);
  };

  const handleSavePG = (pgId) => {
    setSavedPGs(prev =>
      prev.includes(pgId)
        ? prev.filter(id => id !== pgId)
        : [...prev, pgId]
    );
  };

  const handleAmenityChange = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePriceRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange === range ? '' : range
    }));
  };

  const handleGenderChange = (gender) => {
    setFilters(prev => ({
      ...prev,
      gender: prev.gender === gender ? '' : gender
    }));
  };

  const clearFilters = () => {
    setFilters({
      amenities: [],
      priceRange: '',
      gender: ''
    });
  };

  if (loading) {
    return (
      <div className={`listings-loading ${darkMode ? 'dark' : ''}`}>
        <Loader size={48} className="loading-spinner" />
        <p>Loading PG listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`listings-loading ${darkMode ? 'dark' : ''}`}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className={`pg-listings ${darkMode ? 'dark' : ''}`}>
      <div className="container">
        {/* Header */}
        <div className="listings-header">
          <h1 className="listings-title">PG Accommodations</h1>
          <p className="listings-subtitle">
            Find your perfect PG accommodation from {pgListings.length} verified listings
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} darkMode={darkMode} />

        {/* Controls */}
        <div className="listings-controls">
          <div className="controls-left">
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filters
            </button>
            <span className="results-count">
              {filteredPGs.length} of {pgListings.length} results
            </span>
          </div>

          <div className="controls-right">
            <div className="view-mode-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="listings-content">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters">
                Clear All
              </button>
            </div>

            {/* Amenities Filter */}
            <div className="filter-section">
              <h4>Amenities</h4>
              <div className="filter-options">
                {['WiFi', 'AC', 'Food', 'Gym', 'Laundry', 'Security', 'Parking'].map(amenity => (
                  <label key={amenity} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="filter-options">
                {[
                  { label: 'Under ₹5,000', value: '0-5000' },
                  { label: '₹5,000 - ₹10,000', value: '5000-10000' },
                  { label: '₹10,000 - ₹15,000', value: '10000-15000' },
                  { label: 'Above ₹15,000', value: '15000-50000' }
                ].map(range => (
                  <label key={range.value} className="filter-option">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === range.value}
                      onChange={() => handlePriceRangeChange(range.value)}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="filter-section">
              <h4>Gender</h4>
              <div className="filter-options">
                {[
                  { label: 'Boys', value: 'boys' },
                  { label: 'Girls', value: 'girls' }
                ].map(gender => (
                  <label key={gender.value} className="filter-option">
                    <input
                      type="radio"
                      name="gender"
                      checked={filters.gender === gender.value}
                      onChange={() => handleGenderChange(gender.value)}
                    />
                    <span>{gender.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* PG Grid */}
          <div className={`pg-grid ${viewMode}`}>
            {filteredPGs.length > 0 ? (
              filteredPGs.slice(0, visibleCount).map(pg => (
                <PGCard
                  key={pg._id}
                  pg={pg}
                  darkMode={darkMode}
                  onSave={handleSavePG}
                  isSaved={savedPGs.includes(pg._id)}
                />
              ))
            ) : (
              <div className="no-results">
                <h3>No PG accommodations found</h3>
                <p>Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>

          {/* Load More */}
          {filteredPGs.length > visibleCount && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={() => setVisibleCount(prev => prev + LOAD_STEP)}
                type="button"
              >
                Load More
              </button>
              <div className="pagination-info">
                Showing {Math.min(visibleCount, filteredPGs.length)} of {filteredPGs.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PGListings; 