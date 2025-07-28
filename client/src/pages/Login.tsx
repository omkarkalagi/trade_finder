import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import axios from 'axios'; // Added axios import
import React from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loginMethod, setLoginMethod] = useState('email');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const { login } = auth;
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(''); // Added error state

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Use absolute URL with correct port
      const response = await axios.post(
        'http://localhost:6000/api/auth/login', // Changed to 6000
        { email, password }
      );
      auth.login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      let errorMessage = 'Login failed';

      if (error.message === 'Network Error') {
        errorMessage = 'Backend server not running. Start server with: node index.js';
      } else if (error.response) {
        errorMessage = error.response.data.error || 'Invalid credentials';
      }

      setError(errorMessage);
      console.error('Login error details:', error);
    }
  };

  const handleSendOTP = async () => {
    setMessage('');
    try {
      const response = await authService.loginWithOTP(phone);
      if (response.success) {
        setStep(2);
        setMessage('OTP sent to your phone!');
      } else {
        setMessage('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    setMessage('');
    try {
      const response = await authService.verifyOTP(phone, otp);

      if (response.success && response.token) {
        login(response.user, response.token);
        navigate('/dashboard');
      } else {
        setMessage(response.error || 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleSignup = async () => {
    setMessage('');
    try {
      const response = await authService.register({ name, email, password });

      if (response.success) {
        setMessage('Signup successful! You can now login.');
        setName('');
        setEmail('');
        setPassword('');
        setIsSignup(false);
      } else {
        setMessage(response.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-red-500 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-wider"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                letterSpacing: '1px'
              }}>
            Trade Finder
          </h1>
          <div className="w-20 h-1 bg-white mx-auto rounded-full"></div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsSignup(false)}
            className={`px-6 py-2 font-semibold rounded-l-lg transition-colors ${
              !isSignup
                ? 'bg-white text-blue-600 shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`px-6 py-2 font-semibold rounded-r-lg transition-colors ${
              isSignup
                ? 'bg-white text-blue-600 shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {!isSignup ? (
              <>
                <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-200">
                  <button
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-3 font-semibold transition-all duration-300 ${
                      loginMethod === 'email'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Email Login
                  </button>
                  <button
                    onClick={() => setLoginMethod('otp')}
                    className={`flex-1 py-3 font-semibold transition-all duration-300 ${
                      loginMethod === 'otp'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    OTP Login
                  </button>
                </div>

                {loginMethod === 'email' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Email</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleLogin}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Login
                    </button>
                  </div>
                )}

                {loginMethod === 'otp' && step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleSendOTP}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Send OTP
                    </button>
                  </div>
                )}

                {loginMethod === 'otp' && step === 2 && (
                  <div className="space-y-4">
                    <p className="text-gray-600 text-center mb-2">
                      OTP sent to <span className="font-semibold">{phone}</span>
                    </p>
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Enter OTP</label>
                      <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={6}
                      />
                    </div>
                    <button
                      onClick={handleVerifyOTP}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSignup}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </div>
            )}

            {message && (
              <p className={`mt-4 text-center p-3 rounded-lg ${
                message.includes('success') || message.includes('sent')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </p>
            )}
            {error && ( // Added error message display
              <p className="mt-4 text-center p-3 rounded-lg bg-red-100 text-red-700">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white text-lg mb-1" style={{ fontFamily: "'Dancing Script', cursive" }}>
            with love ❤️ from Omkar Kalagi
          </p>
          <p className="text-white opacity-80 text-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>
            By Kalagi Group of Companies since 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
