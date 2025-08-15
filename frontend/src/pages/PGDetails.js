import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { 
  MapPin, 
  DollarSign, 
  Users, 
  Wifi, 
  Snowflake, 
  Star, 
  Heart, 
  Phone, 
  Mail, 
  ArrowLeft,
  CheckCircle,
  Clock,
  Building2
} from 'lucide-react';
import './PGDetails.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://easy-pg-finder.onrender.com/api';

const PGDetails = ({ darkMode }) => {
  const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchPG = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/pg/${id}`);
        if (!res.ok) throw new Error('PG not found');
        const data = await res.json();
        if (res.ok && data.data?.pgListing) {
          setPg(data.data.pgListing);
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchPG();
  }, [id]);

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleContact = () => {
    alert('Contact functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className={`details-loading ${darkMode ? 'dark' : ''}`}>
        <div className="loading-spinner"></div>
        <p>Loading PG details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`details-error ${darkMode ? 'dark' : ''}`}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/listings" className="back-btn">
          <ArrowLeft size={20} />
          Back to Listings
        </Link>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className={`details-error ${darkMode ? 'dark' : ''}`}>
        <h2>PG not found</h2>
        <p>The PG accommodation you're looking for doesn't exist.</p>
        <Link to="/listings" className="back-btn">
          <ArrowLeft size={20} />
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className={`pg-details ${darkMode ? 'dark' : ''}`}>
      <div className="container">
        {/* Back Button */}
        <Link to="/listings" className="back-link">
          <ArrowLeft size={20} />
          Back to Listings
        </Link>

        {/* Header */}
        <div className="details-header">
          <div className="header-content">
            <h1 className="pg-name">{pg.name}</h1>
            <div className="header-meta">
              <div className="location-info">
                <MapPin size={20} />
                <span>{pg.location.address}, {pg.location.city}, {pg.location.state}</span>
              </div>
              <div className="rating-info">
                <Star size={20} fill="currentColor" />
                <span>{pg.rating?.average || 0}</span>
                <span className="review-count">({pg.rating?.count || 0} reviews)</span>
              </div>
            </div>
            <div className="header-actions">
              <button 
                onClick={handleSave}
                className={`save-btn ${saved ? 'saved' : ''}`}
              >
                <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <button onClick={handleContact} className="contact-btn">
                <Phone size={20} />
                Contact Owner
              </button>
            </div>
          </div>
        </div>

        <div className="details-content">
          {/* Images Section */}
          <div className="images-section">
            <div className="main-image">
              <img src={pg.images[selectedImage]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80'} alt={pg.name} />
              <div className="image-overlay">
                <button 
                  onClick={handleSave}
                  className={`save-btn-overlay ${saved ? 'saved' : ''}`}
                >
                  <Heart size={24} fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
            <div className="image-thumbnails">
              {pg.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80'} alt={`${pg.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="details-grid">
            {/* Main Content */}
            <div className="main-content">
              {/* Description */}
              <section className="description-section">
                <h2>Description</h2>
                <p>{pg.description}</p>
              </section>

              {/* Amenities */}
              <section className="amenities-section">
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {pg.amenities.map(amenity => (
                    <div key={amenity} className="amenity-item">
                      {(amenity === 'WiFi' || amenity === 'Wi-Fi') && <Wifi size={20} />}
                      {amenity === 'AC' && <Snowflake size={20} />}
                      {amenity !== 'WiFi' && amenity !== 'Wi-Fi' && amenity !== 'AC' && <CheckCircle size={20} />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Room Types */}
              <section className="room-types-section">
                <h2>Room Types & Pricing</h2>
                <div className="room-types-grid">
                  {pg.roomTypes.map(room => (
                    <div key={room.type} className="room-type-card">
                      <h3>{room.type}</h3>
                      <div className="room-price">
                        <span className="price">₹{room.price}</span>
                        <span className="period">/month</span>
                      </div>
                      <div className="room-availability">
                        <Clock size={16} />
                        <span>{room.available} rooms available</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Rules */}
              <section className="rules-section">
                <h2>House Rules</h2>
                <ul className="rules-list">
                  {pg.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Price Card */}
              <div className="price-card">
                <h3>Pricing Details</h3>
                <div className="price-details">
                  <div className="price-item">
                    <span>Monthly Rent</span>
                    <span className="price">₹{pg.price.monthly}</span>
                  </div>
                  <div className="price-item">
                    <span>Security Deposit</span>
                    <span className="price">₹{pg.price.deposit}</span>
                  </div>
                  {pg.price.maintenance && (
                    <div className="price-item">
                      <span>Maintenance</span>
                      <span className="price">₹{pg.price.maintenance}</span>
                    </div>
                  )}
                  <div className="price-total">
                    <span>Total (First Month)</span>
                    <span className="total-price">₹{pg.price.monthly + pg.price.deposit + (pg.price.maintenance || 0)}</span>
                  </div>
                </div>
                <button onClick={handleContact} className="book-now-btn">
                  Book Now
                </button>
              </div>

              {/* Contact Card */}
              <div className="contact-card">
                <h3>Contact Information</h3>
                <div className="contact-details">
                  <div className="contact-item">
                    <Building2 size={20} />
                    <div>
                      <span className="label">Owner</span>
                      <span className="value">{pg.owner?.name || 'Owner'}</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Phone size={20} />
                    <div>
                      <span className="label">Phone</span>
                      <span className="value">{pg.contactInfo.phone}</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <Mail size={20} />
                    <div>
                      <span className="label">Email</span>
                      <span className="value">{pg.contactInfo.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="quick-info-card">
                <h3>Quick Info</h3>
                <div className="quick-info">
                  <div className="info-item">
                    <Users size={20} />
                    <div>
                      <span className="label">Gender</span>
                      <span className="value">{pg.gender === 'boys' ? 'Boys' : pg.gender === 'girls' ? 'Girls' : 'Unisex'}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <Star size={20} />
                    <div>
                      <span className="label">Rating</span>
                      <span className="value">{pg.rating?.average || 0}/5 ({pg.rating?.count || 0} reviews)</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <CheckCircle size={20} />
                    <div>
                      <span className="label">Status</span>
                      <span className={`value ${pg.isAvailable ? 'available' : 'unavailable'}`}>
                        {pg.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGDetails; 