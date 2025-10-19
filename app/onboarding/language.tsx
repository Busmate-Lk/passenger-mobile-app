import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';

interface Language {
  code: string;
  name: string;
  localName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', localName: 'English' },
  { code: 'si', name: 'Sinhala', localName: 'සිංහල' },
  { code: 'ta', name: 'Tamil', localName: 'தமிழ்' },
];

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const router = useRouter();

  const handleContinue = () => {
    // Here you would save the selected language to storage
    router.push('/onboarding/onboarding1');
  };

  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 80 }}>
            <Text style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#111827',
              textAlign: 'center',
              marginBottom: 16
            }}>
              Choose Your Language
            </Text>
            <Text style={{
              fontSize: 18,
              color: '#6B7280',
              textAlign: 'center',
              marginBottom: 48
            }}>
              Select your preferred language to continue
            </Text>

            <View style={{ gap: 16, width: '100%' }}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => setSelectedLanguage(language.code)}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedLanguage === language.code ? '#004CFF' : '#E5E7EB',
                    backgroundColor: selectedLanguage === language.code ? 'rgba(0, 76, 255, 0.05)' : 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <View>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {language.name}
                    </Text>
                    <Text style={{
                      fontSize: 16,
                      color: '#6B7280'
                    }}>
                      {language.localName}
                    </Text>
                  </View>
                  {selectedLanguage === language.code && (
                    <View style={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#004CFF',
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleContinue}
            style={{
              backgroundColor: '#004CFF',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center'
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: '600'
            }}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}