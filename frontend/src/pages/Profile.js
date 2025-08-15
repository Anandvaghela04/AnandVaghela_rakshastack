import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  LogOut, 
  ArrowLeft, 
  Settings,
  Building2,
  Calendar,
  Shield
} from 'lucide-react';
import './Profile.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';
const Profile = ({ darkMode, user, logout, onBecomeOwner }) => {
  const navigate = useNavigate();
  const [updating, setUpdating] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [localUser, setLocalUser] = React.useState(user);

  React.useEffect(() => {
    setLocalUser(user);
  }, [user]);
  const handleLogout = () => {
    logout();
    navigate('/');
  };
   const handleBecomeOwner = async () => {
    setUpdating(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';
      const res = await fetch(`${API_BASE_URL}/become-owner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to become owner');
      // Update local and global user state
      setLocalUser({ ...localUser, role: 'owner' });
      window.location.reload(); // Force reload to update App.js user state
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };
console.log('User in Profile:', user);
  if (!localUser) {
    return (
      <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
        <div className="container">
          <div className="not-logged-in">
            <h2>Please log in to view your profile</h2>
            <Link to="/login" className="login-btn">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
      <div className="container">
        {/* Back Button */}
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h1>{localUser.name}</h1>
            <div className="role-badge">
              <Shield size={16} />
              <span>{localUser.role}</span>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <User size={20} />
                </div>
                <div className="info-details">
                  <label>Full Name</label>
                  <span>{localUser.name}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Mail size={20} />
                </div>
                <div className="info-details">
                  <label>Email Address</label>
                  <span>{localUser.email}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Phone size={20} />
                </div>
                <div className="info-details">
                  <label>Phone Number</label>
                  <span>{localUser.phone || 'Not provided'}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Calendar size={20} />
                </div>
                <div className="info-details">
                  <label>Member Since</label>
                  <span>{new Date(localUser.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Dashboard Link */}
          {localUser.role === 'owner' && (
            <div className="profile-section">
              <h2>Owner Actions</h2>
              <div className="action-buttons">
                <Link to="/owner-dashboard" className="action-btn primary">
                  <Building2 size={20} />
                  <span>Owner Dashboard</span>
                </Link>
                <Link to="/add-pg" className="action-btn secondary">
                  <Settings size={20} />
                  <span>Add New PG</span>
                </Link>
              </div>
            </div>
          )}
          
          {/* Become Owner Button for non-owners */}
          {localUser.role !== 'owner' && (
            <div className="profile-section">
              <h2>Want to become an Owner?</h2>
              <div className="action-buttons">
                <button className="action-btn primary" onClick={handleBecomeOwner} disabled={updating}>
                  {updating ? 'Becoming Owner...' : 'Become Owner'}
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
          )}

          {/* Account Actions */}
          <div className="profile-section">
            <h2>Account Actions</h2>
            <div className="action-buttons">
              <button className="action-btn danger" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 