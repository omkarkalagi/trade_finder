// Fixed: Phone input display and bo.connect error - v2.0
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
          email: 'demo@tradefinder.com'
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
      setOtp('');
      setStep('phone');
      setError('');
      setSuccess('');
    }
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 p-8 rounded-2xl border border-gray-200/50 shadow-2xl backdrop-blur-xl">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl font-bold text-white">TF</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
                style={{ fontFamily: 'Great Vibes, Dancing Script, cursive' }}>
              Trade Finder
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              {step === 'phone' ? 'Enter your mobile number to continue' : 'Enter the OTP sent to your phone'}
            </p>
            <p className="text-xs text-gray-400 mt-1">v2.1 - Light Theme</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-bounce-in">
              <div className="flex items-center">
                <span className="mr-2">❌</span>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-bounce-in">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                {success}
              </div>
            </div>
          )}

          {/* Phone Number Step */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-3">
                    <span className="text-gray-700 font-medium text-lg">+91</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-4 py-3 text-lg font-medium bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      placeholder="9876543210"
                      maxLength="10"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <span className="text-slate-500 text-sm font-medium">{phone.length}/10</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">📱</span>
                    Send OTP
                  </div>
                )}
              </button>
            </form>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <div className="text-xs text-gray-600 mb-3">
                  Sent to +91{phone}
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Change number
                  </button>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
                <div className="text-center mt-2">
                  <span className="text-slate-500 text-sm">{otp.length}/6</span>
                </div>
              </div>

              {/* Countdown Timer */}
              {countdown > 0 && (
                <div className="text-center">
                  <p className="text-sm text-slate-400">
                    Resend OTP in <span className="font-mono font-bold text-blue-400">{formatCountdown(countdown)}</span>
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🔐</span>
                      Verify & Login
                    </div>
                  )}
                </button>

                {countdown === 0 && (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="w-full btn-secondary py-3 text-lg font-semibold transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🔄</span>
                      Resend OTP
                    </div>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2 mt-0.5">🔒</span>
              <div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your phone number is secure and will only be used for authentication.
                  We use industry-standard encryption to protect your data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Professional Trading Platform
          </p>
          <p className="text-xs text-gray-500 mt-1">Since 2023</p>
        </div>
      </div>

      {/* Additional CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
