import { useEffect, useRef, useCallback } from 'react';
import authApiService from '../api/auth';
import { useNavigate } from 'react-router-dom';

interface UseSessionTimeoutOptions {
  inactivityTimeout?: number; // milliseconds (default: 30 minutes)
  warningTime?: number; // milliseconds before logout to show warning (default: 5 minutes)
  onWarning?: (remainingTime: number) => void;
  onLogout?: () => void;
}

/**
 * Hook to manage session timeout and automatic logout
 * 
 * Features:
 * - Tracks user inactivity
 * - Shows warning before logout
 * - Automatically logs out after inactivity period
 * - Resets timer on user activity
 */
export const useSessionTimeout = (options: UseSessionTimeoutOptions = {}) => {
  const {
    inactivityTimeout = 30 * 60 * 1000, // 30 minutes default
    warningTime = 5 * 60 * 1000, // 5 minutes warning
    onWarning,
    onLogout,
  } = options;

  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    // Only reset if user is authenticated
    if (!authApiService.isAuthenticated()) {
      return;
    }

    clearTimeouts();
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      if (authApiService.isAuthenticated()) {
        warningShownRef.current = true;
        const remainingTime = inactivityTimeout - warningTime;
        if (onWarning) {
          onWarning(remainingTime);
        } else {
          // Default warning: show alert
          const minutes = Math.floor(remainingTime / 60000);
          alert(`Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}. Please save your work.`);
        }
      }
    }, inactivityTimeout - warningTime);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      if (authApiService.isAuthenticated()) {
        authApiService.logout();
        if (onLogout) {
          onLogout();
        } else {
          // Default logout: redirect to login
          navigate('/login', { 
            state: { 
              message: 'Your session has expired due to inactivity. Please log in again.' 
            } 
          });
        }
      }
    }, inactivityTimeout);
  }, [inactivityTimeout, warningTime, onWarning, onLogout, navigate, clearTimeouts]);

  const handleActivity = useCallback(() => {
    // Reset timer on any user activity
    if (authApiService.isAuthenticated()) {
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    // Only set up session timeout if user is authenticated
    if (!authApiService.isAuthenticated()) {
      clearTimeouts();
      return;
    }

    // Set up event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeouts();
    };
  }, [handleActivity, resetTimer, clearTimeouts]);

  return {
    resetTimer,
    clearTimeouts,
    getRemainingTime: () => {
      if (!authApiService.isAuthenticated()) return 0;
      const elapsed = Date.now() - lastActivityRef.current;
      return Math.max(0, inactivityTimeout - elapsed);
    },
  };
};

export default useSessionTimeout;

