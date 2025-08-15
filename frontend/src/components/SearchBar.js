import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Users } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ onSearch, darkMode }) => {
  const [searchData, setSearchData] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    gender: ''
  });
  // Fetch city list from backend
  const [cityList, setCityList] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Fetch city list from backend
    fetch('https://easy-pg-finder.onrender.com/api/pg/cities')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data.cities)) {
          setCityList(data.data.cities);
        }
      })
      .catch(err => {
        setCityList([]);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
    // Show city suggestions for location input
    if (name === 'location') {
      if (value.length > 0) {
        const filtered = cityList.filter(city =>
          city && city.toLowerCase().startsWith(value.toLowerCase())
        );
        setCitySuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setCitySuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  // Handle selecting a city suggestion
  const handleSuggestionClick = (city) => {
    setSearchData(prev => ({ ...prev, location: city }));
    setCitySuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleReset = () => {
    setSearchData({
      location: '',
      minPrice: '',
      maxPrice: '',
      gender: ''
    });
    onSearch({});
  };

  return (
    <div className={`search-bar ${darkMode ? 'dark' : ''}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-inputs">
          {/* Location */}
          <div className="search-input-group" style={{ position: 'relative' }}>
            <MapPin size={20} className="input-icon" />
            <input
              type="text"
              name="location"
              placeholder="Enter location..."
              value={searchData.location}
              onChange={handleInputChange}
              className="search-input"
              autoComplete="off"
              onFocus={() => {
                if (searchData.location.length > 0 && citySuggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {/* City Suggestions Dropdown */}
            {showSuggestions && citySuggestions.length > 0 && (
              <ul className="city-suggestions-dropdown">
                {citySuggestions.map(city => (
                  <li
                    key={city}
                    onMouseDown={() => handleSuggestionClick(city)}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Price Range */}
          <div className="search-input-group">
            <DollarSign size={20} className="input-icon" />
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={searchData.minPrice}
              onChange={handleInputChange}
              className="search-input"
              min="0"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={searchData.maxPrice}
              onChange={handleInputChange}
              className="search-input"
              min="0"
            />
          </div>

          {/* Gender */}
          <div className="search-input-group">
            <Users size={20} className="input-icon" />
            <select
              name="gender"
              value={searchData.gender}
              onChange={handleInputChange}
              className="search-input"
            >
              <option value="">All Genders</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
            </select>
          </div>

          {/* Search Button */}
          <button type="submit" className="search-btn">
            <Search size={20} />
            <span>Search</span>
          </button>

          {/* Reset Button */}
          <button type="button" onClick={handleReset} className="reset-btn">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 