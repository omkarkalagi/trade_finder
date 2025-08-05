// RESTORED ORIGINAL LOGIN - Light Theme Version
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate phone number
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    try {
      // Demo mode - simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      setSuccess('OTP sent successfully! (Demo Mode - Enter any 6-digit code)');
      setStep('otp');
      setCountdown(300); // 5 minutes countdown
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      // Demo mode - simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Accept any 6-digit OTP in demo mode
      if (otp.length === 6) {
        const demoUser = {
          id: '1',
          name: 'Demo User',
          phone: `+91${phone}`,
          email: 'omkardigambar4@gmail.com'
        };

        const demoToken = 'demo-jwt-token-' + Date.now();

        login(demoToken, demoUser);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
      } else {
        setError('Please enter a valid 6-digit OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Verify OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      setCountdown(300);
      setSuccess('OTP resent successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-2xl font-bold text-white">TF</span>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent mb-1 tracking-wide"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              TRADE FINDER
            </h1>
            <p className="text-base text-gray-600 mb-4"
               style={{ fontFamily: 'Dancing Script, cursive' }}>
              by Omkar Kalagi
            </p>
            <p className="text-sm text-gray-500">
              {step === 'phone' ? 'Enter your mobile number to continue' : 'Enter the OTP sent to your phone'}
            </p>
          </div>

          {/* Phone Number Step */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-3">
                  Mobile Number
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <div className="flex items-center justify-center bg-blue-500 text-white px-4 py-3 font-medium">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400"
                    required
                    maxLength="10"
                  />
                  <div className="flex items-center justify-center px-3 text-gray-400 text-sm border-l border-gray-200">
                    {phone.length}/10
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-4 px-4 rounded-xl font-medium hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📱</span>
                    Send OTP
                  </>
                )}
              </button>

              {/* Information Box */}
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-0.5">🔒</span>
                  <div>
                    <p className="font-medium mb-1">Your phone number is safe with us</p>
                    <p className="text-blue-600 text-xs">
                      We use industry-standard encryption to protect your information. We won't spam or share your number with anyone.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                {success}
              </div>
            </div>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-3">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center text-lg font-mono tracking-widest text-gray-900 placeholder-gray-400"
                  required
                  maxLength="6"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  OTP sent to +91{phone}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-4 px-4 rounded-xl font-medium hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🔐</span>
                    Verify OTP
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in {formatTime(countdown)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Back to phone */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setError('');
                    setSuccess('');
                    setCountdown(0);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  ← Change phone number
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            With Love <span className="text-red-500">❤️</span> from <span className="font-medium">Kalagi Group of Companies</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Since 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
