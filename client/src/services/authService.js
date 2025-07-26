// Placeholder authentication service
import axios from 'axios';

// Update this line:
const API_URL = "https://trade-finder-uebi.onrender.com/api/auth";

// And add this base URL:
const API_BASE = "https://trade-finder-uebi.onrender.com";

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
    const response = await axios.post(`${API_URL}/verify-otp`, { phone, otp });
    return response.data;
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error.response) {
      // The server responded with a status code outside 2xx
      errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from the server. The backend might be down.';
    } else {
      // Something else happened
      errorMessage = error.message;
    }
    console.error('OTP verification error:', errorMessage, error);
    throw new Error(errorMessage);
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
