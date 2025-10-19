import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StatusBar, Platform } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';

function RootLayoutNav() {
  const { user, isLoading: authLoading } = useAuth();
  const { hasCompletedOnboarding, isLoading: onboardingLoading } = useOnboardingStatus();
  const segments = useSegments();
  const router = useRouter();
  const [navigationState, setNavigationState] = useState({
    hasNavigated: false,
    lastNavigationTarget: '',
  });

  const isLoading = authLoading || onboardingLoading;

  useEffect(() => {
    console.log('Navigation check:', {
      authLoading,
      onboardingLoading,
      hasCompletedOnboarding,
      user: !!user,
      segments: segments[0],
      hasNavigated: navigationState.hasNavigated,
    });

    // Reset navigation flag when loading states change
    if (isLoading) {
      setNavigationState({ hasNavigated: false, lastNavigationTarget: '' });
      return;
    }

    // Don't navigate if still loading
    if (hasCompletedOnboarding === null) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    let targetRoute = '';

    // Determine target route based on state
    if (!hasCompletedOnboarding) {
      targetRoute = '/onboarding/language';
    } else if (hasCompletedOnboarding && !user && !authLoading) {
      targetRoute = '/auth/login';
    } else if (user && hasCompletedOnboarding && !authLoading) {
      targetRoute = '/(tabs)';
    }

    // Only navigate if we have a target and haven't already navigated to it
    if (targetRoute && targetRoute !== navigationState.lastNavigationTarget) {
      const shouldNavigate = 
        (!hasCompletedOnboarding && !inOnboardingGroup) ||
        (hasCompletedOnboarding && !user && !authLoading && !inAuthGroup) ||
        (user && hasCompletedOnboarding && !authLoading && !inTabsGroup);

      if (shouldNavigate) {
        console.log(`Redirecting to ${targetRoute}...`);
        router.replace(targetRoute);
        setNavigationState({ 
          hasNavigated: true, 
          lastNavigationTarget: targetRoute 
        });
      }
    }
  }, [user, authLoading, segments, hasCompletedOnboarding, onboardingLoading, router, navigationState]);

  // Reset navigation state when segments change significantly
  useEffect(() => {
    const currentGroup = segments[0];
    const expectedGroup = 
      !hasCompletedOnboarding ? 'onboarding' :
      hasCompletedOnboarding && !user ? 'auth' :
      user ? '(tabs)' : '';

    if (currentGroup && currentGroup !== expectedGroup) {
      setNavigationState(prev => ({ ...prev, hasNavigated: false }));
    }
  }, [segments, hasCompletedOnboarding, user]);

  // Show nothing while loading
  if (isLoading || hasCompletedOnboarding === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding/language" />
      <Stack.Screen name="onboarding/onboarding1" />
      <Stack.Screen name="onboarding/onboarding2" />
      <Stack.Screen name="onboarding/onboarding3" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="auth/forgot-password" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="tickets" options={{ headerShown: false }} />
      <Stack.Screen name="wallet" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="tracking" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  useFrameworkReady();

  // Set status bar properties natively
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('#004CFF');
      StatusBar.setTranslucent(false);
    }
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded || fontError) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
      {Platform.OS === 'ios' && <ExpoStatusBar style="light" />}
    </AuthProvider>
  );
}