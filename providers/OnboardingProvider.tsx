import React, { createContext, useContext } from 'react';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';

type OnboardingContextType = ReturnType<typeof useOnboardingStatus>;

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const onboardingStatus = useOnboardingStatus();
  
  return (
    <OnboardingContext.Provider value={onboardingStatus}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};