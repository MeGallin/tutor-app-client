import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../hooks/useChat';
import { v4 as uuidv4 } from 'uuid';
import './ChatBox.css';

/**
 * ChatBox component for interacting with the AI Tutor
 */
const ChatBox = ({ initialSessionId = null }) => {
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();
  const [sessionId] = useState(() => initialSessionId || uuidv4()); // Use provided ID or generate one
  const messagesEndRef = useRef(null);

  // Initialize chat functionality with the useChat hook
  const {
    messages,
    isLoading,
    isLoadingHistory,
    error,
    sendMessage,
    clearMessages,
    loadChatHistory,
  } = useChat(sessionId, {
    useStreaming: true,
    loadHistory: true,
  });

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage('');
    }
  };

  // Handle starting a new chat
  const handleNewChat = () => {
    if (isLoading) return;
    clearMessages();
  };

  // Handle retry when there's an error
  const handleRetry = () => {
    if (messages.length >= 2) {
      // Get the last user message
      const lastUserMessage = [...messages]
        .reverse()
        .find((msg) => msg.role === 'user');
      if (lastUserMessage) {
        sendMessage(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="card chat-container">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">AI Tutor Chat</h5>
        <button
          className="btn btn-sm btn-outline-light"
          onClick={handleNewChat}
          disabled={isLoading}
        >
          New Chat
        </button>
      </div>

      <div className="card-body chat-messages p-4">
        {isLoadingHistory && messages.length === 0 ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading history...</span>
            </div>
            <p className="mt-2">Loading your conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted my-5">
            <p>Start chatting with your AI tutor!</p>
            <p>Ask any question about your coursework.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.role === 'user' ? 'user-message' : 'ai-message'
              } mb-3`}
            >
              <div className="message-content p-3 rounded">
                {msg.role === 'assistant' && msg.isPartial ? (
                  <div className="message-text">
                    {msg.content}
                    <span className="blinking-cursor">|</span>
                  </div>
                ) : (
                  <div className="message-text">{msg.content}</div>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="message ai-message mb-3">
            <div className="message-content p-3 rounded">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            <div className="d-flex justify-content-between align-items-center">
              <span>{error}</span>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="card-footer p-3">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={
                isLoading && !messages.some((m) => m.role === 'assistant')
              }
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                !message.trim() ||
                (isLoading && !messages.some((m) => m.role === 'assistant'))
              }
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
