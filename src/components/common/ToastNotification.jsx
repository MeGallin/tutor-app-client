import { useState, useEffect } from 'react';
import './ToastNotification.css';

/**
 * Toast notification component for displaying temporary messages
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Type of toast (success, error, info, warning)
 * @param {string} props.message - Message content to display
 * @param {number} props.duration - Duration in milliseconds
 * @param {function} props.onClose - Function to call when toast is closed
 */
const ToastNotification = ({
  id,
  type = 'info',
  message,
  duration = 5000,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  // Handle toast automatic dismissal
  useEffect(() => {
    const timer = setTimeout(() => {
      startExitAnimation();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Start exit animation before removal
  const startExitAnimation = () => {
    setIsExiting(true);

    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };

  // Get icon based on toast type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="bi bi-check-circle-fill me-2"></i>;
      case 'error':
        return <i className="bi bi-exclamation-circle-fill me-2"></i>;
      case 'warning':
        return <i className="bi bi-exclamation-triangle-fill me-2"></i>;
      case 'info':
      default:
        return <i className="bi bi-info-circle-fill me-2"></i>;
    }
  };

  return (
    <div
      className={`toast-notification toast-${type} ${
        isExiting ? 'toast-exit' : ''
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-notification-content">
        {getIcon()}
        {message}
      </div>
      <button
        type="button"
        className="toast-notification-close"
        aria-label="Close"
        onClick={startExitAnimation}
      >
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
};

export default ToastNotification;
