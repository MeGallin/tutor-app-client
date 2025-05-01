/**
 * Configuration utility for handling environment variables
 * Usage: import { API_URL } from './utils/config';
 */

/**
 * API base URL
 * In development with no VITE_API_URL set, defaults to empty string (same-origin)
 * which means requests will be handled by the Vite proxy
 */
export const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Whether the app is running in development mode
 */
export const IS_DEV = import.meta.env.MODE === 'development';

/**
 * Whether to enable verbose logging
 */
export const ENABLE_LOGS =
  IS_DEV || import.meta.env.VITE_ENABLE_LOGS === 'true';

/**
 * Log messages only in development or when logs are explicitly enabled
 * @param {...any} args - Arguments to log
 */
export function log(...args) {
  if (ENABLE_LOGS) {
    console.log(...args);
  }
}
