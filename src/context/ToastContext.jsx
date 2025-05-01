import { createContext, useContext, useState, useCallback } from 'react';
import ToastNotification from '../components/common/ToastNotification';

// Create context
const ToastContext = createContext(null);

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Toast Provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast notification
  const addToast = useCallback((type, message) => {
    const id = Date.now(); // Unique ID for the toast
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);

    return id;
  }, []);

  // Remove a toast notification
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Helper functions for different toast types
  const showSuccess = useCallback(
    (message) => addToast(TOAST_TYPES.SUCCESS, message),
    [addToast],
  );
  const showError = useCallback(
    (message) => addToast(TOAST_TYPES.ERROR, message),
    [addToast],
  );
  const showInfo = useCallback(
    (message) => addToast(TOAST_TYPES.INFO, message),
    [addToast],
  );
  const showWarning = useCallback(
    (message) => addToast(TOAST_TYPES.WARNING, message),
    [addToast],
  );

  return (
    <ToastContext.Provider
      value={{ showSuccess, showError, showInfo, showWarning, removeToast }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
