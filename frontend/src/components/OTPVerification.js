import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react';
import './OTPVerification.css';

const OTPVerification = ({ 
  email, 
  tempData, 
  onVerificationSuccess, 
  onBack, 
  darkMode 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otpString,
          tempData
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Success - call the callback with user data
      onVerificationSuccess(data.data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tempData
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      // Reset timer and OTP
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
      
      // Focus first input
      const firstInput = document.getElementById('otp-0');
      if (firstInput) firstInput.focus();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={`otp-verification ${darkMode ? 'dark' : ''}`}>
      <div className="otp-container">
        <div className="otp-header">
          <button onClick={onBack} className="back-btn">
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="verification-icon">
            <Mail size={48} />
          </div>
          
          <h1>Verify Your Email</h1>
          <p>
            We've sent a 6-digit verification code to<br />
            <strong>{email}</strong>
          </p>
        </div>

        <div className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                className="otp-input"
                placeholder="0"
              />
            ))}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.join('').length !== 6}
            className="verify-btn"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <CheckCircle size={20} />
                Verify & Create Account
              </>
            )}
          </button>

          <div className="resend-section">
            <div className="timer">
              {timeLeft > 0 ? (
                <span>Resend code in {formatTime(timeLeft)}</span>
              ) : (
                <span>Code expired</span>
              )}
            </div>
            
            <button
              onClick={handleResendOTP}
              disabled={!canResend || resendLoading}
              className="resend-btn"
            >
              {resendLoading ? (
                <div className="loading-spinner small"></div>
              ) : (
                <>
                  <RotateCcw size={16} />
                  Resend Code
                </>
              )}
            </button>
          </div>
        </div>

        <div className="otp-footer">
          <p>
            Didn't receive the code? Check your spam folder or{' '}
            <button 
              onClick={handleResendOTP}
              disabled={!canResend || resendLoading}
              className="link-btn"
            >
              resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
