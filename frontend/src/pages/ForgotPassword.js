import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './Auth.css';

const ForgotPassword = ({ darkMode }) => {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'newPassword', 'success'
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (resendTimer > 0) {
        setResendTimer(0);
      }
    };
  }, [resendTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For OTP, only allow numbers
    if (name === 'otp') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      setMessage({ type: 'success', text: 'OTP sent successfully! Check your email.' });
      setStep('otp');
      // Start resend timer
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
      
      setMessage({ type: 'success', text: 'OTP resent successfully!' });
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    // OTP validation
    if (formData.otp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a 6-digit OTP' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: formData.otp 
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }
      
      setStep('newPassword');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    // Additional password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.newPassword)) {
      setMessage({ type: 'error', text: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: formData.otp,
          newPassword: formData.newPassword 
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      
      setStep('success');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSendOTP} className="auth-form">
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <div className="input-group">
          <Mail size={20} className="input-icon" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
            className="form-input"
          />
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <button 
        type="submit" 
        className="auth-btn"
        disabled={loading}
      >
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <Send size={20} />
            Send Reset Link
          </>
        )}
      </button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleVerifyOTP} className="auth-form">
      <div className="form-group">
        <label htmlFor="otp">Enter OTP</label>
        <div className="input-group">
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            required
            className="form-input"
            style={{ paddingLeft: '15px' }}
          />
        </div>
        <p className="otp-info">
          We've sent a 6-digit OTP to <strong>{formData.email}</strong>
        </p>
        <div className="resend-otp">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendTimer > 0 || loading}
            className="resend-btn"
          >
            {loading ? (
              <div className="loading-spinner small"></div>
            ) : resendTimer > 0 ? (
              `Resend in ${resendTimer}s`
            ) : (
              'Resend OTP'
            )}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <button 
        type="submit" 
        className="auth-btn"
        disabled={loading}
      >
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <CheckCircle size={20} />
            Verify OTP
          </>
        )}
      </button>
    </form>
  );

  const renderNewPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="auth-form">
      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Enter new password"
            required
            className="form-input"
            style={{ paddingLeft: '15px' }}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <div className="input-group">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
            required
            className="form-input"
            style={{ paddingLeft: '15px' }}
          />
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          <AlertCircle size={20} />
          {message.text}
        </div>
      )}

      <button 
        type="submit" 
        className="auth-btn"
        disabled={loading}
      >
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <>
            <CheckCircle size={20} />
            Reset Password
          </>
        )}
      </button>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="success-step">
      <div className="success-icon">
        <CheckCircle size={64} />
      </div>
      <h2>Password Reset Successful!</h2>
      <p>Your password has been reset successfully. You can now log in with your new password.</p>
      <button 
        onClick={() => navigate('/login')} 
        className="auth-btn"
      >
        Go to Login
      </button>
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 'email':
        return 'Forgot Password';
      case 'otp':
        return 'Verify OTP';
      case 'newPassword':
        return 'Set New Password';
      case 'success':
        return 'Success!';
      default:
        return 'Forgot Password';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'email':
        return 'Enter your email address to receive a password reset link';
      case 'otp':
        return 'Enter the 6-digit OTP sent to your email';
      case 'newPassword':
        return 'Create a new password for your account';
      case 'success':
        return 'Your password has been reset successfully';
      default:
        return 'Enter your email address to receive a password reset link';
    }
  };

  return (
    <div className={`auth-page ${darkMode ? 'dark' : ''}`}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="back-button">
              {step !== 'email' && step !== 'success' && (
                <button 
                  onClick={() => setStep(step === 'otp' ? 'email' : 'otp')}
                  className="back-btn"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              )}
            </div>
            <h1>{getStepTitle()}</h1>
            <p>{getStepDescription()}</p>
          </div>

          {step === 'email' && renderEmailStep()}
          {step === 'otp' && renderOTPStep()}
          {step === 'newPassword' && renderNewPasswordStep()}
          {step === 'success' && renderSuccessStep()}

          {step !== 'success' && (
            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;