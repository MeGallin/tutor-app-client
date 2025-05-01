/**
 * Error handling utilities for API responses
 */

import { log } from './config';

/**
 * Format error messages from API responses for display to users
 *
 * @param {Error|Object|string} error - Error object, response data, or message
 * @param {string} defaultMessage - Fallback message if no specific error is found
 * @returns {string} - Formatted error message
 */
export function formatApiError(
  error,
  defaultMessage = 'An unexpected error occurred',
) {
  // If it's already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // Extract message from Error object
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  // Handle API response error object
  if (error && typeof error === 'object') {
    // Common API error formats
    if (error.message) {
      return error.message;
    }

    if (error.error) {
      return typeof error.error === 'string'
        ? error.error
        : formatApiError(error.error);
    }

    // Handle validation errors array
    if (Array.isArray(error.errors) && error.errors.length > 0) {
      return error.errors.map((err) => err.message || err).join('. ');
    }
  }

  // Fallback to default message
  return defaultMessage;
}

/**
 * Handle API errors with consistent logging and formatting
 *
 * @param {Error} error - Error object from API call
 * @param {string} context - Context where the error occurred for logging
 * @param {string} defaultMessage - Default message if error can't be formatted
 * @returns {string} - Formatted error message
 */
export function handleApiError(
  error,
  context = 'API',
  defaultMessage = 'An unexpected error occurred',
) {
  log(`${context} Error:`, error);

  return formatApiError(error, defaultMessage);
}
