import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import './styles/global.css'; // Import global styles
import App from './App.jsx';

// Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Bootstrap initialization component
function BootstrapInitializer({ children }) {
  useEffect(() => {
    // This ensures Bootstrap's JavaScript plugins are properly initialized
    // after the component mounts

    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    [...tooltipTriggerList].forEach((tooltipTriggerEl) => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]',
    );
    [...popoverTriggerList].forEach((popoverTriggerEl) => {
      new window.bootstrap.Popover(popoverTriggerEl);
    });

    // Initialize dropdowns
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    [...dropdownElementList].forEach((dropdownToggleEl) => {
      new window.bootstrap.Dropdown(dropdownToggleEl);
    });
  }, []);

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BootstrapInitializer>
        <App />
      </BootstrapInitializer>
    </AuthProvider>
  </StrictMode>,
);
