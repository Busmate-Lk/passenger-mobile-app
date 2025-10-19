import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';

const ArrowRightIcon = ({ size = 24, color = "white" }) => (
  <Text style={{ fontSize: size, color }}>→</Text>
);

export default function Onboarding2Screen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboardingStatus();

  const handleSkip = async () => {
    try {
      await completeOnboarding();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/auth/login');
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
          {/* Skip Button */}
          <View style={{ alignItems: 'flex-end', marginBottom: 32 }}>
            <TouchableOpacity
              onPress={handleSkip}
              style={{ paddingHorizontal: 16, paddingVertical: 8 }}
            >
              <Text style={{ color: '#6B7280', fontSize: 16 }}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Icon */}
            <View style={{
              width: 128,
              height: 128,
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: 64,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 48
            }}>
              <Text style={{ fontSize: 64 }}>🚌</Text>
            </View>

            {/* Title */}
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#111827',
              textAlign: 'center',
              marginBottom: 24
            }}>
              Track Buses Live
            </Text>
            
            {/* Description */}
            <Text style={{
              fontSize: 16,
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 24,
              paddingHorizontal: 16
            }}>
              Get real-time location updates and arrival predictions for your buses
            </Text>
          </View>

          {/* Bottom Navigation */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Progress Dots */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: '#D1D5DB',
                borderRadius: 6
              }} />
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: '#004CFF',
                borderRadius: 6
              }} />
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: '#D1D5DB',
                borderRadius: 6
              }} />
            </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={() => router.push('/onboarding/onboarding3')}
              style={{
                backgroundColor: '#004CFF',
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowRight size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}