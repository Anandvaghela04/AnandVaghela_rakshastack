import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Users, Wifi, Snowflake, Star, Heart } from 'lucide-react';
import './PGCard.css';

const PGCard = ({ pg, darkMode, onSave, isSaved }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const {
    _id,
    name = 'Unnamed PG',
    location = {},
    price = {},
    amenities = [],
    gender = 'unisex',
    images = [],
    rating,
    isAvailable = true
  } = pg || {};

  // Debug logging
  console.log('PGCard received pg:', pg);
  console.log('PGCard images:', images);

  // Handle different image data structures
  const getMainImage = () => {
    console.log('Getting main image from:', images);
    
    if (!images || images.length === 0) {
      console.log('No images found, using placeholder');
      return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80';
    }

    const firstImage = images[0];
    console.log('First image:', firstImage);
    
    // If image is a string (direct URL)
    if (typeof firstImage === 'string') {
      console.log('Image is string, using:', firstImage);
      return firstImage;
    }
    
    // If image is an object with url property
    if (firstImage && typeof firstImage === 'object' && firstImage.url) {
      console.log('Image is object with url, using:', firstImage.url);
      return firstImage.url;
    }
    
    // If image is an object with different structure, try common properties
    if (firstImage && typeof firstImage === 'object') {
      const possibleUrl = firstImage.url || firstImage.src || firstImage.image || firstImage.link;
      console.log('Image is object, trying properties:', possibleUrl);
      return possibleUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80';
    }
    
    console.log('No valid image found, using placeholder');
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80';
  };

  const mainImage = getMainImage();
  console.log('Final main image:', mainImage);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    setImageLoading(false);
    setImageError(true);
    e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80';
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(_id);
  };

  // Determine numeric rating
  const ratingValue =
    typeof rating === 'number'
      ? rating
      : typeof rating === 'object' && rating !== null
      ? rating.average
      : null;

  return (
    <Link to={`/pg/${_id}`} className="pg-card-link">
      <div className={`pg-card ${darkMode ? 'dark' : ''}`}>
        {/* Image Container */}
        <div className="pg-card-image">
          {imageLoading && (
            <div className="image-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
          <img 
            src={mainImage} 
            alt={name}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
          <div className="pg-card-overlay">
            <button
              onClick={handleSave}
              className={`save-btn ${isSaved ? 'saved' : ''}`}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            {!isAvailable && (
              <div className="unavailable-badge">
                Not Available
              </div>
            )}
          </div>
          {ratingValue && (
            <div className="rating-badge">
              <Star size={16} fill="currentColor" />
              <span>{ratingValue}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pg-card-content">
          <h3 className="pg-card-title">{name}</h3>

          <div className="pg-card-location">
            <MapPin size={16} />
            <span>{location.city || 'Location'}, {location.state || 'State'}</span>
          </div>

          <div className="pg-card-price">
            <span className="price-amount">₹{price.monthly || '0'}</span>
            <span className="price-period">/month</span>
          </div>

          <div className="pg-card-gender">
            <Users size={16} />
            <span className={`gender-badge ${gender}`}>
              {gender === 'boys'
                ? 'Boys'
                : gender === 'girls'
                ? 'Girls'
                : 'Unisex'}
            </span>
          </div>

          {/* Amenities */}
          <div className="pg-card-amenities">
            {amenities.includes('WiFi') && (
              <div className="amenity-item">
                <Wifi size={14} />
                <span>WiFi</span>
              </div>
            )}
            {amenities.includes('AC') && (
              <div className="amenity-item">
                <Snowflake size={14} />
                <span>AC</span>
              </div>
            )}
            {amenities.length > 2 && (
              <div className="amenity-more">
                +{amenities.length - 2} more
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PGCard;
