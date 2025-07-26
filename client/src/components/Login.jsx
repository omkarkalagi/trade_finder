import React, { useState, useEffect } from 'react';
import { sendOTP, loginWithOTP } from '../services/authService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './common/LoadingSpinner'; // Create this component

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Handle OTP resend countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // Test backend connection on component mount
    axios.get('https://trade-finder-uebi.onrender.com/health')
      .then(response => console.log('Backend connection:', response.data))
      .catch(error => console.error('Backend connection failed:', error));
  }, []);

  const handleSendOTP = async () => {
    if (!phone.match(/^\+?[1-9]\d{1,14}$/)) {
      setError('Invalid phone number format');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await sendOTP(phone);
      setOtpSent(true);
      setCountdown(30); // 30-second cooldown
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.match(/^\d{6}$/)) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await loginWithOTP(phone, otp);

      if (result.token) {
        localStorage.setItem('token', result.token);
        navigate('/dashboard');
      } else {
        throw new Error('Authentication token missing');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login with OTP</h2>

      {error && <div className="error alert">{error}</div>}

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1234567890"
          disabled={otpSent || loading}
        />
      </div>

      {otpSent && (
        <div className="form-group">
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            disabled={loading}
            maxLength={6}
          />
        </div>
      )}

      <div className="actions">
        {loading ? (
          <LoadingSpinner />
        ) : !otpSent ? (
          <button
            onClick={handleSendOTP}
            disabled={!phone || countdown > 0}
          >
            {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Send OTP'}
          </button>
        ) : (
          <button
            onClick={handleVerifyOTP}
            disabled={!otp}
          >
            Verify OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
