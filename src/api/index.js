/**
 * Unified API client for making HTTP requests to the backend
 * Handles authentication, token refresh, error parsing, and HTTP methods
 */

import { API_URL, log } from '../utils/config';
import {
  getToken,
  getStoredUser,
  storeUserData,
  clearUserData,
} from '../utils/tokenStorage';

// Track if a token refresh is in progress to prevent infinite loops
let isRefreshingToken = false;

// Queue of requests waiting for token refresh
let tokenRefreshQueue = [];

// Resolve all queued requests with the new token
const processTokenRefreshQueue = (newToken) => {
  tokenRefreshQueue.forEach((callback) => callback(newToken));
  tokenRefreshQueue = [];
};

/**
 * Makes a request to the API with proper headers and error handling
 *
 * @param {string} path - API endpoint path (e.g., '/auth/login')
 * @param {Object} options - Request options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.body] - Request body (will be JSON stringified)
 * @param {string} [options.token] - Authentication token (will use stored token if not provided)
 * @param {Object} [options.headers] - Additional headers to include in the request
 * @param {boolean} [options.skipTokenRefresh=false] - Skip automatic token refresh on auth errors
 * @param {boolean} [options.expectEmptyResponse=false] - Whether to expect an empty response body
 * @returns {Promise<Object|null>} - Parsed JSON response or null for empty responses
 * @throws {Error} - With message from server on non-2xx responses
 */
async function request(
  path,
  {
    method = 'GET',
    body,
    token,
    headers: customHeaders = {},
    skipTokenRefresh = false,
    expectEmptyResponse = false,
  } = {},
) {
  // Use provided token or get from storage
  const authToken = token || getToken();

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Set up headers with Content-Type
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  // Add Authorization header if token is provided
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  // Log request in development
  log(`API ${method}:`, `${API_URL}/api${normalizedPath}`);
  if (body) log('Request body:', body);

  try {
    // Make the fetch request
    const res = await fetch(`${API_URL}/api${normalizedPath}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // Include cookies for potential session-based auth
    });

    // Handle authentication errors with token refresh
    if (!skipTokenRefresh && res.status === 401 && authToken) {
      // Get the current user data
      const userData = getStoredUser();

      if (!userData?.token || path === '/auth/refresh') {
        // If no token stored or this is already a refresh request, handle as normal error
        const error = await res
          .json()
          .catch(() => ({ message: 'Authentication failed' }));
        throw new Error(
          error.message || 'Authentication failed. Please log in again.',
        );
      }

      // We need to attempt a token refresh
      if (!isRefreshingToken) {
        isRefreshingToken = true;

        try {
          // Attempt to refresh the token
          const refreshResponse = await request('/auth/refresh', {
            method: 'POST',
            token: userData.token,
            skipTokenRefresh: true, // Prevent infinite refresh loops
          });

          // If refresh successful, update stored user data
          if (refreshResponse && refreshResponse.token) {
            const updatedUserData = { ...userData, ...refreshResponse };
            storeUserData(updatedUserData);

            // Process all waiting requests with the new token
            processTokenRefreshQueue(refreshResponse.token);

            // Retry the original request with new token
            return request(path, {
              method,
              body,
              token: refreshResponse.token,
              headers: customHeaders,
              expectEmptyResponse,
            });
          } else {
            throw new Error('Failed to refresh authentication token');
          }
        } catch (refreshError) {
          // If refresh fails, clear the queue with the error
          tokenRefreshQueue.forEach((callback) => callback(null));
          tokenRefreshQueue = [];

          // Force logout on refresh failure
          clearUserData();

          throw new Error('Your session has expired. Please log in again.');
        } finally {
          isRefreshingToken = false;
        }
      } else {
        // If a refresh is already in progress, add request to queue
        return new Promise((resolve, reject) => {
          tokenRefreshQueue.push((newToken) => {
            if (newToken) {
              // Retry with new token when refresh completes
              resolve(
                request(path, {
                  method,
                  body,
                  token: newToken,
                  headers: customHeaders,
                  expectEmptyResponse,
                }),
              );
            } else {
              // Reject if token refresh fails
              reject(new Error('Authentication failed. Please log in again.'));
            }
          });
        });
      }
    }

    // Handle other non-2xx responses
    if (!res.ok) {
      // Try to parse error message from JSON, fallback to statusText
      const error = await res.json().catch(() => ({ message: res.statusText }));
      const errorMessage = error.message || 'An unknown error occurred';

      log('API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    // For endpoints that don't return content (like DELETE operations)
    if (
      expectEmptyResponse ||
      res.status === 204 ||
      res.headers.get('Content-Length') === '0'
    ) {
      log('API Response: Empty response (as expected)');
      return null;
    }

    // Try to parse the response as JSON
    try {
      const contentType = res.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        log('API Response:', data);
        return data;
      } else {
        // Not a JSON response, return the text
        const text = await res.text();
        log('API Response (text):', text);
        return { text };
      }
    } catch (parseError) {
      log('Response parsing error:', parseError);
      return null; // Return null for empty or invalid JSON responses
    }
  } catch (error) {
    log('Request error:', error.message);
    throw error;
  }
}

/**
 * Convenience methods for different HTTP verbs
 */
const api = {
  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint path
   * @param {Object} options - Additional options (headers, token)
   * @returns {Promise<Object|null>} - Response data
   */
  get: (endpoint, options = {}) => {
    return request(endpoint, {
      method: 'GET',
      ...options,
    });
  },

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint path
   * @param {Object} data - Request body
   * @param {Object} options - Additional options (headers, token)
   * @returns {Promise<Object|null>} - Response data
   */
  post: (endpoint, data = {}, options = {}) => {
    return request(endpoint, {
      method: 'POST',
      body: data,
      ...options,
    });
  },

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint path
   * @param {Object} data - Request body
   * @param {Object} options - Additional options (headers, token)
   * @returns {Promise<Object|null>} - Response data
   */
  put: (endpoint, data = {}, options = {}) => {
    return request(endpoint, {
      method: 'PUT',
      body: data,
      ...options,
    });
  },

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint path
   * @param {Object} options - Additional options (headers, token)
   * @returns {Promise<Object|null>} - Response data
   */
  delete: (endpoint, options = {}) => {
    return request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  },

  /**
   * Direct access to the raw request function
   */
  request,
};

// Export the api object by default for common usage patterns
export default api;

// Also export the raw request function for direct use
export { request };
