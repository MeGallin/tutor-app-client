/**
 * Token storage utility to manage authentication tokens consistently
 * Centralizes token storage/retrieval logic to prevent circular dependencies
 */

import { log } from './config';

// Default token refresh interval in milliseconds (20 minutes)
export const TOKEN_REFRESH_INTERVAL = 1000 * 60 * 20;

/**
 * Get stored user data with token
 *
 * @returns {Object|null} - User data object or null if not found
 */
export function getStoredUser() {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    log('Error reading user data from storage', error);
    return null;
  }
}

/**
 * Get the current auth token
 *
 * @returns {string|null} - The token or null if not found
 */
export function getToken() {
  const user = getStoredUser();
  return user?.token || null;
}

/**
 * Check if the stored token is expired
 *
 * @param {number} [bufferMinutes=5] - Buffer time in minutes before actual expiry to consider token as expired
 * @returns {boolean} - True if token is expired or expiring soon, false otherwise
 */
export function isTokenExpired(bufferMinutes = 5) {
  try {
    const tokenExpiry = localStorage.getItem('token_expiry');
    if (!tokenExpiry) return true;

    const expiry = parseInt(tokenExpiry, 10);
    const now = Date.now();

    // Token is expired if current time is within buffer period of expiry
    return now > expiry - bufferMinutes * 60 * 1000;
  } catch (error) {
    log('Error checking token expiry', error);
    return true; // Assume expired if we can't verify
  }
}

/**
 * Store user data with token information
 *
 * @param {Object} userData - User data to store
 * @param {string} userData.token - Authentication token
 * @param {string|number} [userData.expiry] - Token expiry date (ISO string or timestamp)
 */
export function storeUserData(userData) {
  if (!userData) return;

  try {
    // Store user data
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token_timestamp', Date.now().toString());

    // Calculate and store expiry time
    let expiry;
    if (userData.expiry) {
      // If expiry is provided as string (ISO date) or number (timestamp)
      expiry =
        typeof userData.expiry === 'number'
          ? userData.expiry
          : new Date(userData.expiry).getTime();
    } else {
      // Default expiry time based on refresh interval
      expiry = Date.now() + TOKEN_REFRESH_INTERVAL;
    }

    localStorage.setItem('token_expiry', expiry.toString());
  } catch (error) {
    log('Error storing user data', error);
  }
}

/**
 * Clear all stored authentication data
 */
export function clearUserData() {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('token_timestamp');
    localStorage.removeItem('token_expiry');
  } catch (error) {
    log('Error clearing user data', error);
  }
}
