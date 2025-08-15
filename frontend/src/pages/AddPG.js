import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  DollarSign, 
  Users, 
  Wifi, 
  Snowflake, 
  Camera,
  Plus,
  X,
  ArrowLeft
} from 'lucide-react';
import './AddPG.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AddPG = ({ darkMode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    price: {
      monthly: '',
      deposit: ''
    },
    gender: '',
    amenities: [],
    roomTypes: [
      {
        type: 'Single',
        available: 1,
        price: ''
      }
    ],
    images: [],
    rules: [''],
    contactInfo: {
      phone: '',
      email: ''
    }
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to add a PG listing');
          return;
        }

        console.log('Fetching user data...');
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('User data response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('User data received:', data);
          setUserData(data);
          
          // Pre-fill contact information with user data
          const updatedContactInfo = {
            phone: data.phone || data.contactInfo?.phone || '',
            email: data.email || data.contactInfo?.email || ''
          };
          
          console.log('Pre-filling contact info:', updatedContactInfo);
          
          setFormData(prev => ({
            ...prev,
            contactInfo: updatedContactInfo
          }));
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch user data:', errorData);
          setError('Failed to fetch user data: ' + (errorData.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data: ' + err.message);
      }
    };

    fetchUserData();
  }, []);

  const availableAmenities = [
    'WiFi', 'AC', 'Food', 'Laundry', 'Parking', 'Security', 
    'Gym', 'Study Room', 'TV', 'Refrigerator', 'Washing Machine',
    'Hot Water', 'Power Backup', 'CCTV', 'Housekeeping'
  ];

  const roomTypeOptions = ['Single', 'Double', 'Triple', 'Dormitory'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleRoomTypeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.map((room, i) => 
        i === index ? { ...room, [field]: value } : room
      )
    }));
  };

  const addRoomType = () => {
    setFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, {
        type: 'Single',
        available: 1,
        price: ''
      }]
    }));
  };

  const removeRoomType = (index) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index)
    }));
  };

  const handleRuleChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const removeRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'PG name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.location.address.trim()) return 'Address is required';
    if (!formData.location.city.trim()) return 'City is required';
    if (!formData.location.state.trim()) return 'State is required';
    if (!formData.location.pincode.trim()) return 'Pincode is required';
    if (!/^[0-9]{6}$/.test(formData.location.pincode)) return 'Please enter a valid 6-digit pincode';
    if (!formData.price.monthly) return 'Monthly price is required';
    if (formData.price.monthly < 1000) return 'Price must be at least ₹1000';
    if (formData.price.monthly > 50000) return 'Price cannot exceed ₹50000';
    if (!formData.gender) return 'Gender preference is required';
    if (formData.roomTypes.length === 0) return 'At least one room type is required';
    if (!formData.contactInfo.phone.trim()) return 'Contact phone number is required';
    if (!/^[0-9]{10}$/.test(formData.contactInfo.phone)) return 'Please enter a valid 10-digit phone number';
    if (!formData.contactInfo.email.trim()) return 'Contact email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) return 'Please enter a valid email address';
    
    for (let room of formData.roomTypes) {
      if (!room.price || room.price < 1000) return 'Room price must be at least ₹1000';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to add a PG listing');
        setLoading(false);
        return;
      }

      const requestData = {
        ...formData,
        price: {
          monthly: parseInt(formData.price.monthly),
          deposit: parseInt(formData.price.deposit) || 0
        },
        roomTypes: formData.roomTypes.map(room => ({
          ...room,
          price: parseInt(room.price),
          available: parseInt(room.available)
        })),
        rules: formData.rules.filter(rule => rule.trim()),
        images: formData.images.map((url, index) => ({
          url,
          caption: `Image ${index + 1}`,
          isPrimary: index === 0
        })),
        contactInfo: formData.contactInfo
      };

      console.log('Sending data to backend:', JSON.stringify(requestData, null, 2));

      const response = await fetch(`${API_BASE_URL}/pg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('Backend response:', data);

      if (response.ok) {
        setSuccess('PG listing added successfully!');
        setTimeout(() => {
          navigate('/owner-dashboard');
        }, 2000);
      } else {
        console.error('Backend error details:', data);
        setError(data.message || data.errors?.[0]?.message || 'Failed to add PG listing');
      }
    } catch (err) {
      console.error('Frontend error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`add-pg ${darkMode ? 'dark' : ''}`}>
      <div className="container">
        {/* Header */}
        <div className="add-pg-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>Add New PG Listing</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="add-pg-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Basic Information */}
          <section className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">PG Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter PG name"
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your PG accommodation..."
                maxLength={1000}
                rows={4}
                required
              />
            </div>
          </section>

          {/* Location */}
          <section className="form-section">
            <h2>Location</h2>
            
            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                placeholder="Enter complete address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit pincode"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="form-section">
            <h2>Pricing</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="monthly">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  id="monthly"
                  name="price.monthly"
                  value={formData.price.monthly}
                  onChange={handleInputChange}
                  placeholder="Enter monthly rent"
                  min={1000}
                  max={50000}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="deposit">Security Deposit (₹)</label>
                <input
                  type="number"
                  id="deposit"
                  name="price.deposit"
                  value={formData.price.deposit}
                  onChange={handleInputChange}
                  placeholder="Enter security deposit"
                  min={0}
                />
              </div>
            </div>
          </section>

          {/* Gender Preference */}
          <section className="form-section">
            <h2>Gender Preference *</h2>
            
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="gender"
                  value="boys"
                  checked={formData.gender === 'boys'}
                  onChange={handleInputChange}
                />
                <span>Boys Only</span>
              </label>
              
              <label className="radio-option">
                <input
                  type="radio"
                  name="gender"
                  value="girls"
                  checked={formData.gender === 'girls'}
                  onChange={handleInputChange}
                />
                <span>Girls Only</span>
              </label>
              
              <label className="radio-option">
                <input
                  type="radio"
                  name="gender"
                  value="unisex"
                  checked={formData.gender === 'unisex'}
                  onChange={handleInputChange}
                />
                <span>Unisex</span>
              </label>
            </div>
          </section>

          {/* Amenities */}
          <section className="form-section">
            <h2>Amenities</h2>
            
            <div className="amenities-grid">
              {availableAmenities.map(amenity => (
                <label key={amenity} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Room Types */}
          <section className="form-section">
            <h2>Room Types & Availability</h2>
            
            {formData.roomTypes.map((room, index) => (
              <div key={index} className="room-type-card">
                <div className="room-type-header">
                  <h3>Room Type {index + 1}</h3>
                  {formData.roomTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoomType(index)}
                      className="remove-btn"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={room.type}
                      onChange={(e) => handleRoomTypeChange(index, 'type', e.target.value)}
                    >
                      {roomTypeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Available Rooms</label>
                    <input
                      type="number"
                      value={room.available}
                      onChange={(e) => handleRoomTypeChange(index, 'available', e.target.value)}
                      min={0}
                    />
                  </div>

                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={room.price}
                      onChange={(e) => handleRoomTypeChange(index, 'price', e.target.value)}
                      placeholder="Enter price"
                      min={1000}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addRoomType}
              className="add-room-btn"
            >
              <Plus size={16} />
              Add Room Type
            </button>
          </section>

          {/* Contact Information */}
          <section className="form-section">
            <h2>Contact Information</h2>
            <p className="section-note">
              Contact information is pre-filled from your profile. You can modify it if needed.
            </p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactPhone">Contact Phone *</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit phone number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email *</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  placeholder="Enter contact email"
                  required
                />
              </div>
            </div>
          </section>

          {/* House Rules */}
          <section className="form-section">
            <h2>House Rules</h2>
            
            {formData.rules.map((rule, index) => (
              <div key={index} className="rule-input-group">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  placeholder="Enter house rule"
                />
                {formData.rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="remove-btn"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addRule}
              className="add-rule-btn"
            >
              <Plus size={16} />
              Add Rule
            </button>
          </section>

          {/* Images */}
          <section className="form-section">
            <h2>Images</h2>
            
            <div className="image-upload-area">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="image-input"
              />
              <label htmlFor="images" className="upload-label">
                <Camera size={24} />
                <span>Click to upload images</span>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="image-preview-grid">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Adding PG...' : 'Add PG Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPG; 