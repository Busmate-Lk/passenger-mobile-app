import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOnboardingStatus = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      const completed = await AsyncStorage.getItem('hasCompletedOnboarding');
      const status = completed === 'true';
      console.log('Checking onboarding status:', completed, '->', status);
      setHasCompletedOnboarding(status);
      return status;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasCompletedOnboarding(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('hasCompletedOnboarding');
      // Immediately update state to false
      setHasCompletedOnboarding(false);
      console.log('Onboarding reset - state updated to false');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      // Immediately update state to true
      setHasCompletedOnboarding(true);
      console.log('Onboarding completed - state updated to true');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }, []);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  return {
    hasCompletedOnboarding,
    isLoading,
    resetOnboarding,
    completeOnboarding,
    checkOnboardingStatus
  };
};