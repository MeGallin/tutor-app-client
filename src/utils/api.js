/**
 * API utility for making HTTP requests to the backend
 */

// Base API URL - can be changed based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Gets the authentication token from local storage
 */
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Creates headers for API requests, including auth token if available
 */
const getHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Makes a fetch request with proper error handling
 */
const fetchWithErrorHandling = async (url, options) => {
  try {
    const response = await fetch(url, options);
    
    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Handle API errors
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Unknown error occurred',
        errors: data.errors,
        data,
      };
    }
    
    return { data, status: response.status };
  } catch (error) {
    // Re-throw with useful info
    if (error.status) {
      throw error;
    } else {
      // Network or parsing error
      throw {
        status: 0,
        message: error.message || 'Network error',
        error,
      };
    }
  }
};

/**
 * API client for making HTTP requests
 */
const api = {
  /**
   * Make a GET request
   */
  get: (endpoint, customHeaders = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    return fetchWithErrorHandling(url, {
      method: 'GET',
      headers: getHeaders(customHeaders),
    });
  },

  /**
   * Make a POST request with JSON body
   */
  post: (endpoint, data = {}, customHeaders = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    return fetchWithErrorHandling(url, {
      method: 'POST',
      headers: getHeaders(customHeaders),
      body: JSON.stringify(data),
    });
  },

  /**
   * Make a PUT request with JSON body
   */
  put: (endpoint, data = {}, customHeaders = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    return fetchWithErrorHandling(url, {
      method: 'PUT',
      headers: getHeaders(customHeaders),
      body: JSON.stringify(data),
    });
  },

  /**
   * Make a DELETE request
   */
  delete: (endpoint, customHeaders = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    return fetchWithErrorHandling(url, {
      method: 'DELETE',
      headers: getHeaders(customHeaders),
    });
  },
};

export default api;