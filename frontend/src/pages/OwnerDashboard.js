import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Home, 
  Users, 
  DollarSign, 
  Star,
  Calendar,
  TrendingUp,
  Settings,
  LogOut
} from 'lucide-react';
import './OwnerDashboard.css';

const API_BASE_URL = 'https://easy-pg-server.onrender.com/api';

const OwnerDashboard = ({ darkMode, user, logout }) => {
  const [pgListings, setPgListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    averageRating: 0
  });

  useEffect(() => {
    // Check if user is logged in and is an owner
    console.log('OwnerDashboard - User:', user);
    console.log('OwnerDashboard - Token:', localStorage.getItem('token'));
    
    if (!user) {
      setError('Please login to access the dashboard.');
      setLoading(false);
      return;
    }
    
    if (user.role !== 'owner') {
      setError('You need to be an owner to access this dashboard. Please become an owner first.');
      setLoading(false);
      return;
    }
    
    console.log('User is owner, fetching listings...');
    fetchMyPGListings();
  }, [user]);

  const fetchMyPGListings = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching PG listings with token:', token);
      
      const res = await fetch(`${API_BASE_URL}/pg/owner/my-listings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch listings');
      }
      
      const data = await res.json();
      setPgListings(data.data?.pgListings || []);
      
      // Calculate stats
      const totalListings = data.data?.pgListings?.length || 0;
      const activeListings = data.data?.pgListings?.filter(pg => pg.isAvailable).length || 0;
      const totalViews = data.data?.pgListings?.reduce((sum, pg) => sum + (pg.views || 0), 0) || 0;
      const avgRating = data.data?.pgListings?.reduce((sum, pg) => sum + (pg.rating?.average || 0), 0) / totalListings || 0;
      
      setStats({
        totalListings,
        activeListings,
        totalViews,
        averageRating: avgRating.toFixed(1)
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePG = async (pgId) => {
    if (!window.confirm('Are you sure you want to delete this PG listing?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/pg/${pgId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete listing');
      
      // Remove from state
      setPgListings(prev => prev.filter(pg => pg._id !== pgId));
      
    } catch (err) {
      alert('Error deleting listing: ' + err.message);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className={`dashboard-loading ${darkMode ? 'dark' : ''}`}>
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`dashboard-error ${darkMode ? 'dark' : ''}`}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchMyPGListings}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={`owner-dashboard ${darkMode ? 'dark' : ''}`}>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Owner Dashboard</h1>
            <p>Welcome back, {user?.name || 'Owner'}!</p>
          </div>
          <div className="header-actions">
            <Link to="/add-pg" className="add-pg-btn">
              <Plus size={20} />
              Add New PG
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Home size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalListings}</h3>
              <p>Total Listings</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.activeListings}</h3>
              <p>Active Listings</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Eye size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalViews}</h3>
              <p>Total Views</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Star size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.averageRating}</h3>
              <p>Avg Rating</p>
            </div>
          </div>
        </div>

        {/* PG Listings */}
        <div className="listings-section">
          <div className="section-header">
            <h2>My PG Listings</h2>
            <span className="listing-count">{pgListings.length} listings</span>
          </div>

          {pgListings.length === 0 ? (
            <div className="empty-state">
              <Home size={64} />
              <h3>No PG Listings Yet</h3>
              <p>Start by adding your first PG accommodation</p>
              <Link to="/add-pg" className="add-first-pg-btn">
                <Plus size={20} />
                Add Your First PG
              </Link>
            </div>
          ) : (
            <div className="listings-grid">
              {pgListings.map(pg => (
                <div key={pg._id} className="listing-card">
                  <div className="listing-image">
                    <img 
                      src={pg.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80'} 
                      alt={pg.name}
                    />
                    <div className="listing-status">
                      <span className={`status ${pg.isAvailable ? 'available' : 'unavailable'}`}>
                        {pg.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="listing-content">
                    <h3>{pg.name}</h3>
                    <p className="location">
                      {pg.location?.city}, {pg.location?.state}
                    </p>
                    
                    <div className="listing-details">
                      <div className="detail-item">
                        <DollarSign size={16} />
                        <span>₹{pg.price?.monthly}/month</span>
                      </div>
                      <div className="detail-item">
                        <Users size={16} />
                        <span>{pg.gender === 'boys' ? 'Boys' : 'Girls'}</span>
                      </div>
                      <div className="detail-item">
                        <Star size={16} />
                        <span>{pg.rating?.average || 0}/5</span>
                      </div>
                    </div>
                    
                    <div className="listing-actions">
                      <Link to={`/pg/${pg._id}`} className="action-btn view-btn">
                        <Eye size={16} />
                        View
                      </Link>
                      <Link to={`/edit-pg/${pg._id}`} className="action-btn edit-btn">
                        <Edit size={16} />
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeletePG(pg._id)}
                        className="action-btn delete-btn"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;