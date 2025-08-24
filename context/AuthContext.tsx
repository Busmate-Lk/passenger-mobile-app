import React, { createContext, useContext, useState, useEffect } from 'react';
import { unregisterDevicePush } from '@/services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userServiceEndpoints } from '@/config';
import { MockUserService, MockUser } from '@/services/mockUserService';

type AuthUser = {
  id: string;
  email: string;
  role: string;
  app_role?: string;
  email_confirmed_at?: string;
  phone?: string;
  user_metadata?: {
    email_verified?: boolean;
    user_role?: string;
  };
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  user: AuthUser;
  weak_password?: {
    message: string;
    reasons: string[];
  };
};

type User = MockUser;

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing login
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('access_token');
        const storedUser = await AsyncStorage.getItem('user_data');

        if (storedToken && storedUser) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        // Clear invalid stored data
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch(userServiceEndpoints.login, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        setIsLoading(false);

        // Handle different HTTP status codes
        switch (response.status) {
          case 400:
            return { success: false, error: 'Invalid email or password format' };
          case 401:
            return { success: false, error: 'Invalid email or password' };
          case 404:
            return { success: false, error: 'User not found' };
          case 500:
            return { success: false, error: 'Server error. Please try again later.' };
          default:
            return { success: false, error: 'Login failed. Please try again.' };
        }
      }

      const authData: AuthResponse = await response.json();

      // Check for weak password warning
      if (authData.weak_password) {
        console.warn('Weak password detected:', authData.weak_password.message);
      }

      // Store authentication data
      await AsyncStorage.setItem('access_token', authData.access_token);
      await AsyncStorage.setItem('refresh_token', authData.refresh_token);
      await AsyncStorage.setItem('token_expires_at', authData.expires_at.toString());

      // Get mock user data for this email
      const mockUserData = MockUserService.getUserByEmail(authData.user.email);

      // Transform auth user to our user format, merging with mock data
      const userData: User = mockUserData || {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.email.split('@')[0], // Use email prefix as name for now
        phone: authData.user.phone || '',
        role: authData.user.role,
        app_role: authData.user.app_role || 'Passenger',
        emailVerified: authData.user.user_metadata?.email_verified || false,
        memberSince: authData.user.email_confirmed_at || 'Recently',
        totalTrips: 0,
        savedRoutes: 0,
        walletBalance: 0,
        travelCardStatus: 'none',
        language: 'en',
        upcomingTrips: [],
        recentTickets: [],
        favoriteRoutes: [],
        recentRoutes: []
      };

      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');

      setAccessToken(authData.access_token);
      setUser(userData);
      setIsLoading(false);

      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);

      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        return { success: false, error: 'Network error. Please check your connection.' };
      }

      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem('refresh_token');

      if (!storedRefreshToken) {
        await signOut();
        return false;
      }

      // You would implement refresh token logic here when the API supports it
      // For now, we'll just check if the current token is still valid
      const expiresAt = await AsyncStorage.getItem('token_expires_at');
      if (expiresAt && Date.now() / 1000 < parseInt(expiresAt)) {
        return true;
      }

      // Token expired, need to re-authenticate
      await signOut();
      return false;

    } catch (error) {
      console.error('Token refresh failed:', error);
      await signOut();
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Best-effort device push unregistration
      try { await unregisterDevicePush(accessToken || undefined); } catch { }
      // Clear all stored authentication data
      await AsyncStorage.multiRemove([
        'access_token',
        'refresh_token',
        'token_expires_at',
        'user_data'
      ]);

      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && !!accessToken;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      accessToken,
      signIn,
      signOut,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};