import { HelmetProvider } from "react-helmet-async";
import AppNavigation from "./navigation/Navigation";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // <-- named import
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSessionTimeout from "./hooks/useSessionTimeout";
import authApiService from "./api/auth";

function AppContent() {
  const navigate = useNavigate();

  // Session timeout management
  useSessionTimeout({
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000, // 5 minutes warning
    onWarning: (remainingTime) => {
      const minutes = Math.floor(remainingTime / 60000);
      const message = `Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''} due to inactivity. Please save your work.`;
      
      // Show toast notification if available, otherwise alert
      if (window.confirm(message + '\n\nClick OK to continue your session.')) {
        // User clicked OK, timer will reset automatically
      }
    },
    onLogout: () => {
      navigate('/login', {
        state: {
          message: 'Your session has expired due to inactivity. Please log in again.'
        }
      });
    }
  });

  // Check token expiration on app load and periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!authApiService.isAuthenticated()) {
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        return;
      }

      try {
        // Decode JWT token (without verification, just to check expiration)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;

        // If token expires in less than 5 minutes, show warning
        if (timeUntilExpiration > 0 && timeUntilExpiration < 5 * 60 * 1000) {
          const minutes = Math.floor(timeUntilExpiration / 60000);
          console.warn(`Token will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}`);
        }

        // If token is expired, logout
        if (timeUntilExpiration <= 0) {
          console.warn('Token has expired, logging out...');
          authApiService.logout();
          navigate('/login', {
            state: {
              message: 'Your session has expired. Please log in again.'
            }
          });
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        // If token is invalid, logout
        authApiService.logout();
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <HelmetProvider>
      <AppNavigation />
    </HelmetProvider>
  );
}

function App() {
  return (
    <>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </>
  );
}

export default App;
