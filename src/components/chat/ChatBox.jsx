import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useChat } from '../../hooks/useChat';
import { v4 as uuidv4 } from 'uuid';
import './ChatBox.css';

/**
 * ChatBox component for interacting with the AI Tutor
 */
const ChatBox = ({ initialSessionId = null }) => {
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();
  const { showError } = useToast();
  const [sessionId] = useState(() => initialSessionId || uuidv4()); // Use provided ID or generate one
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Enhanced suggestions organized by categories
  const allSuggestions = {
    math: [
      'Can you explain the concept of calculus?',
      'Help me understand trigonometric functions',
      'How do I solve this equation: 2x² + 5x - 3 = 0?',
      'Explain probability and statistics concepts',
    ],
    science: [
      'Explain the process of photosynthesis',
      "What's the difference between atoms and molecules?",
      'How does gravity work?',
      'What are the laws of thermodynamics?',
    ],
    history: [
      'What were the main causes of World War II?',
      'Explain the significance of the Renaissance period',
      'Who were the key figures in the Civil Rights Movement?',
      'How did ancient civilizations develop writing systems?',
    ],
    languages: [
      'Help me improve my essay writing skills',
      'What are the fundamental grammar rules in English?',
      'How can I remember new vocabulary effectively?',
      'Explain the use of metaphors in literature',
    ],
  };

  // Get a mix of suggestions from different categories
  const getRandomSuggestions = (count = 8) => {
    const result = [];
    const categories = Object.keys(allSuggestions);

    // At least one from each category
    categories.forEach((category) => {
      const items = allSuggestions[category];
      const randomIndex = Math.floor(Math.random() * items.length);
      result.push({
        text: items[randomIndex],
        category: category,
      });
    });

    // Fill the rest randomly
    while (result.length < count) {
      const randomCat =
        categories[Math.floor(Math.random() * categories.length)];
      const items = allSuggestions[randomCat];
      const randomItem = items[Math.floor(Math.random() * items.length)];

      // Check if already in the result
      if (!result.some((item) => item.text === randomItem)) {
        result.push({
          text: randomItem,
          category: randomCat,
        });
      }
    }

    return result.slice(0, count);
  };

  const [suggestions, setSuggestions] = useState(() => getRandomSuggestions());

  // Refresh suggestions
  const refreshSuggestions = () => {
    setSuggestions(getRandomSuggestions());
  };

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

  // Hide suggestions when there are messages
  useEffect(() => {
    if (messages.length > 0) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  }, [messages.length]);

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
    refreshSuggestions();
    setShowSuggestions(true);
    messageInputRef.current?.focus();
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

  // Display error toast when error changes
  useEffect(() => {
    if (error) {
      showError(`Chat error: ${error}`);
    }
  }, [error, showError]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    sendMessage(suggestion);
    setMessage('');
  };

  // Add animation class to new messages
  const getMessageClass = (index) => {
    return index === messages.length - 1 ? 'message-fade-in' : '';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Enter or Command+Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (message.trim() && !isLoading) {
          sendMessage(message);
          setMessage('');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [message, isLoading, sendMessage]);

  // Helper function to format timestamps
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to get category colors
  const getCategoryColor = (category) => {
    const colors = {
      math: 'primary',
      science: 'success',
      history: 'warning',
      languages: 'info',
    };
    return colors[category] || 'secondary';
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      math: 'bi-calculator',
      science: 'bi-flask',
      history: 'bi-book',
      languages: 'bi-translate',
    };
    return icons[category] || 'bi-lightbulb';
  };

  return (
    <div className="card chat-container">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <i className="bi bi-robot me-2 fs-4"></i>
          <h5 className="mb-0">AI Tutor Chat</h5>
        </div>
        <div>
          {messages.length > 0 && (
            <button
              className="btn btn-sm btn-outline-light"
              onClick={handleNewChat}
              disabled={isLoading}
              aria-label="Start new chat"
              title="Start new conversation"
            >
              <i className="bi bi-plus-circle me-1"></i>
              New Chat
            </button>
          )}
        </div>
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
            <h3 className="h5 mb-4">
              <i className="bi bi-robot me-2"></i>
              How can I help you learn today?
            </h3>
            {showSuggestions && (
              <div className="suggested-prompts">
                <p className="small mb-3">Try asking about:</p>
                <div className="row g-3">
                  {suggestions.map((suggestion, index) => (
                    <div className="col-12 col-md-6" key={index}>
                      <button
                        className={`btn btn-outline-${getCategoryColor(
                          suggestion.category,
                        )} btn-sm text-start w-100`}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                      >
                        <i
                          className={`${getCategoryIcon(
                            suggestion.category,
                          )} me-2`}
                        ></i>
                        {suggestion.text}
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-link btn-sm mt-3"
                  onClick={refreshSuggestions}
                  title="Show different suggestions"
                >
                  <i className="bi bi-arrow-repeat me-1"></i>
                  Show different suggestions
                </button>
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.role === 'user' ? 'user-message' : 'ai-message'
              } mb-3 ${getMessageClass(index)}`}
              aria-label={`${msg.role} message`}
            >
              <div className="message-avatar">
                <div
                  className="avatar-circle"
                  title={msg.role === 'user' ? 'You' : 'AI Tutor'}
                >
                  {msg.role === 'user' ? (
                    <i className="bi bi-person-fill"></i>
                  ) : (
                    <i className="bi bi-robot"></i>
                  )}
                </div>
              </div>
              <div className="message-content p-3 rounded">
                <div className="mb-1 d-flex justify-content-between align-items-center">
                  <small className="text-muted fw-bold">
                    {msg.role === 'user' ? 'You' : 'AI Tutor'}
                  </small>
                  {msg.timestamp && (
                    <small className="text-muted">
                      {formatTime(msg.timestamp)}
                    </small>
                  )}
                </div>
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
          <div className="message ai-message mb-3 message-fade-in">
            <div className="message-avatar">
              <div className="avatar-circle">
                <i className="bi bi-robot"></i>
              </div>
            </div>
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
                aria-label="Retry last message"
              >
                <i className="bi bi-arrow-repeat me-1"></i>
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
              placeholder="Type your message... (Ctrl+Enter to send)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={
                isLoading && !messages.some((m) => m.role === 'assistant')
              }
              ref={messageInputRef}
              aria-label="Message input"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                !message.trim() ||
                (isLoading && !messages.some((m) => m.role === 'assistant'))
              }
              aria-label="Send message"
              title="Send message (Ctrl+Enter)"
            >
              <i className="bi bi-send me-1"></i>
              Send
            </button>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <small className="text-muted">
              {message.length > 0 && `${message.length} characters`}
            </small>
            <small className="text-muted">Use Ctrl+Enter to send</small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
