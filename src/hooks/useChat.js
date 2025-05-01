import { useState, useEffect, useRef, useCallback } from 'react';
import { streamChat, chat, getChatHistory } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { handleApiError } from '../utils/errorHandling';
import { log } from '../utils/config';

/**
 * Custom hook for managing chat interactions with the Tutor AI
 *
 * @param {string} sessionId - Unique identifier for the chat session
 * @param {Object} options - Configuration options
 * @param {boolean} options.useStreaming - Whether to use streaming SSE (default: true)
 * @param {boolean} options.loadHistory - Whether to load chat history on mount (default: true)
 * @returns {Object} - Chat state and control functions
 */
export function useChat(
  sessionId,
  { useStreaming = true, loadHistory = true } = {},
) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  // Load chat history on mount if requested
  useEffect(() => {
    if (loadHistory && sessionId) {
      loadChatHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, loadHistory]);

  // Cleanup function to close EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  /**
   * Load chat history for the current session
   */
  const loadChatHistory = useCallback(async () => {
    if (!sessionId) return;

    try {
      setIsLoadingHistory(true);
      setError(null);

      const historyData = await getChatHistory({
        sessionId,
        token: currentUser?.token,
      });

      if (Array.isArray(historyData?.messages)) {
        setMessages(historyData.messages);
      }
    } catch (err) {
      setError(
        handleApiError(err, 'Chat History', 'Failed to load chat history'),
      );
    } finally {
      setIsLoadingHistory(false);
    }
  }, [sessionId, currentUser?.token]);

  /**
   * Send a message to the Tutor AI
   * @param {string} content - Message content to send
   */
  const sendMessage = useCallback(
    async (content) => {
      // Reset error state
      setError(null);

      try {
        setIsLoading(true);

        // Add the user message immediately to the UI
        setMessages((prev) => [...prev, { role: 'user', content }]);

        if (useStreaming) {
          // Close any existing stream
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
          }

          // Create new stream connection
          const source = streamChat({
            message: content,
            sessionId,
            token: currentUser?.token,
          });

          eventSourceRef.current = source;

          // Track the assistant's response as it comes in
          let assistantResponse = '';

          source.onmessage = (event) => {
            try {
              const token = event.data;
              assistantResponse += token;

              // Update the messages array with the current accumulated response
              setMessages((prev) => {
                const newMessages = [...prev];

                // Check if we already have an assistant message
                const assistantMsgIndex = newMessages.findIndex(
                  (msg) => msg.role === 'assistant' && msg.isPartial,
                );

                if (assistantMsgIndex >= 0) {
                  // Update existing message
                  newMessages[assistantMsgIndex] = {
                    ...newMessages[assistantMsgIndex],
                    content: assistantResponse,
                  };
                } else {
                  // Add new message
                  newMessages.push({
                    role: 'assistant',
                    content: assistantResponse,
                    isPartial: true,
                  });
                }

                return newMessages;
              });
            } catch (err) {
              log('Error processing SSE message:', err);
            }
          };

          source.onerror = (err) => {
            log('EventSource error:', err);
            source.close();
            setError('Connection error. Please try again.');
            setIsLoading(false);
          };

          source.addEventListener('complete', () => {
            // Mark message as complete when the stream ends
            setMessages((prev) => {
              return prev.map((msg) => {
                if (msg.role === 'assistant' && msg.isPartial) {
                  return { ...msg, isPartial: false };
                }
                return msg;
              });
            });

            setIsLoading(false);
            source.close();
          });
        } else {
          // Use regular API call as fallback
          const response = await chat({
            message: content,
            sessionId,
            token: currentUser?.token,
          });

          // Add assistant response to messages
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                response.message ||
                response.content ||
                response.reply ||
                response.response ||
                '',
            },
          ]);
          setIsLoading(false);
        }
      } catch (err) {
        const errorMessage = handleApiError(
          err,
          'Chat',
          'Failed to send message. Please try again.',
        );
        setError(errorMessage);
        setIsLoading(false);
      }
    },
    [sessionId, currentUser?.token, useStreaming],
  );

  /**
   * Clear all messages in the current chat
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    isLoadingHistory,
    error,
    sendMessage,
    clearMessages,
    loadChatHistory,
  };
}
