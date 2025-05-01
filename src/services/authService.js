/**
 * Authentication Service Module
 * Handles authentication API calls (login & registration)
 */

import api from '../api';
import { handleApiError } from '../utils/errorHandling';

/**
 * Register a new user account
 *
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} - User data with auth token
 * @throws {Error} - With formatted error message on failure
 */
export async function register({ name, email, password }) {
  try {
    return await api.post('/auth/register', { name, email, password });
  } catch (error) {
    throw new Error(
      handleApiError(
        error,
        'Registration',
        'Registration failed. Please try again.',
      ),
    );
  }
}

/**
 * Login an existing user
 *
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} - User data with auth token
 * @throws {Error} - With formatted error message on failure
 */
export async function login({ email, password }) {
  try {
    return await api.post('/auth/login', { email, password });
  } catch (error) {
    throw new Error(
      handleApiError(
        error,
        'Login',
        'Login failed. Please check your credentials and try again.',
      ),
    );
  }
}

/**
 * Refresh the authentication token
 *
 * @param {string} token - Current authentication token
 * @returns {Promise<Object>} - Updated user data with new token
 * @throws {Error} - With formatted error message on failure
 */
export async function refreshToken(token) {
  try {
    return await api.post('/auth/refresh', {}, { token });
  } catch (error) {
    throw new Error(
      handleApiError(
        error,
        'Token Refresh',
        'Session refresh failed. You may need to login again.',
      ),
    );
  }
}

/**
 * Log out the current user
 *
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await api.post('/auth/logout', {}, { expectEmptyResponse: true });
  } catch (error) {
    // We don't throw here since logout should always succeed from the client's perspective
    handleApiError(error, 'Logout');
  }
}
