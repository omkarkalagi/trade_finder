// Placeholder authentication service
import axios from 'axios';

// Remove unused constant
const API_URL = "https://trade-finder-uebi.onrender.com/api/auth";

export const loginWithEmail = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const loginWithOTP = async (phone, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { phone, otp });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message ||
                   error.message ||
                   'OTP verification failed';
    throw new Error(message);
  }
};

// Add this function for sending OTP
export const sendOTP = async (phone) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, { phone });
    return response.data;
  } catch (error) {
    // Improved error message
    const message = error.response?.data?.message ||
                   error.message ||
                   'Failed to send OTP';
    throw new Error(message);
  }
};

export const verifyOTP = async (phone, otp) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'OTP verification failed');
    }

    return data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
