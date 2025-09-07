import { useCallback } from 'react';
import { useTaskFlowStore } from '@/lib/store';
import toast from 'react-hot-toast';

export function useAuth() {
  const {
    setUser,
    setAuthenticated,
    setLoading,
    setError,
    setNotificationAccess,
    setProjectLinking,
  } = useTaskFlowStore();

  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is already authenticated (from localStorage)
      const storedUser = localStorage.getItem('taskflow-user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        
        // Verify user session with backend
        const response = await fetch(`/api/auth/farcaster?userId=${user.userId}`);
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setAuthenticated(true);
          setNotificationAccess(data.features.notifications);
          setProjectLinking(data.features.projectLinking);
          return;
        }
      }

      // If no valid session, user needs to authenticate
      setAuthenticated(false);
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError('Failed to initialize authentication');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [setUser, setAuthenticated, setLoading, setError, setNotificationAccess, setProjectLinking]);

  const authenticateWithFarcaster = useCallback(async (fid: number, signature: string, message: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/farcaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fid,
          signature,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store user data
      setUser(data.user);
      setAuthenticated(true);
      setNotificationAccess(data.features.notifications);
      setProjectLinking(data.features.projectLinking);

      // Persist to localStorage
      localStorage.setItem('taskflow-user', JSON.stringify(data.user));

      toast.success('Successfully authenticated!');
      return data.user;
    } catch (error) {
      console.error('Farcaster auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setUser, setAuthenticated, setLoading, setError, setNotificationAccess, setProjectLinking]);

  const logout = useCallback(() => {
    setUser(null);
    setAuthenticated(false);
    setNotificationAccess(false);
    setProjectLinking(false);
    localStorage.removeItem('taskflow-user');
    toast.success('Logged out successfully');
  }, [setUser, setAuthenticated, setNotificationAccess, setProjectLinking]);

  const refreshUserFeatures = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/subscriptions?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setNotificationAccess(data.activeFeatures.notifications);
        setProjectLinking(data.activeFeatures.projectLinking);
      }
    } catch (error) {
      console.error('Error refreshing user features:', error);
    }
  }, [setNotificationAccess, setProjectLinking]);

  return {
    initializeAuth,
    authenticateWithFarcaster,
    logout,
    refreshUserFeatures,
  };
}
