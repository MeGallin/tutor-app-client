/**
 * Chat Service Module
 * Handles chat API interactions with the Tutor AI
 */

import api from '../api';
import { API_URL, log } from '../utils/config';
import { handleApiError } from '../utils/errorHandling';

/**
 * Stream chat responses using Server-Sent Events (SSE)
 *
 * @param {Object} params - Chat parameters
 * @param {string} params.message - User's message/prompt
 * @param {string} params.sessionId - Chat session identifier
 * @param {string} params.token - Authentication token
 * @returns {EventSource} - EventSource instance for receiving streaming responses
 */
export function streamChat({ message, sessionId, token }) {
  try {
    // Create the full URL for the chat endpoint
    const baseUrl = API_URL || window.location.origin;
    const url = new URL('/api/chat', baseUrl);

    // Add query parameters for authentication and session
    url.searchParams.append('sessionId', sessionId);
    url.searchParams.append('message', message); // Add message as query param for SSE

    if (token) {
      url.searchParams.append('token', token);
    }

    log('Creating EventSource connection to:', url.toString());

    // Create an EventSource instance for SSE
    const eventSource = new EventSource(url.toString(), {
      withCredentials: true, // Send cookies if they exist
    });

    // Set up error handling
    eventSource.addEventListener('error', (err) => {
      log('EventSource error:', err);
    });

    return eventSource;
  } catch (error) {
    throw new Error(
      handleApiError(error, 'Chat Stream', 'Failed to connect to chat service'),
    );
  }
}

/**
 * Alternative non-streaming chat request
 * Use this as a fallback for browsers that don't support EventSource
 *
 * @param {Object} params - Chat parameters
 * @param {string} params.message - User's message/prompt
 * @param {string} params.sessionId - Chat session identifier
 * @param {string} params.token - Authentication token
 * @returns {Promise<Object>} - Chat response data
 * @throws {Error} - With formatted error message on failure
 */
export async function chat({ message, sessionId, token }) {
  try {
    return await api.post('/chat', { message, sessionId }, { token });
  } catch (error) {
    throw new Error(
      handleApiError(
        error,
        'Chat',
        'Failed to send message. Please try again.',
      ),
    );
  }
}

/**
 * Fetch chat history for a session
 *
 * @param {Object} params - Chat parameters
 * @param {string} params.sessionId - Chat session identifier
 * @param {string} params.token - Authentication token
 * @returns {Promise<Array>} - Array of chat messages
 * @throws {Error} - With formatted error message on failure
 */
export async function getChatHistory({ sessionId, token }) {
  try {
    return await api.get(`/chat/history?sessionId=${sessionId}`, { token });
  } catch (error) {
    throw new Error(
      handleApiError(error, 'Chat History', 'Failed to load chat history'),
    );
  }
}
