import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit2
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/ui/AppHeader';

export default function ProfileInfoScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Fallback if user is not loaded
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader title="Profile Information" />
        <View style={styles.content}>
          <Text>Loading profile information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Add a function to map image paths to require statements
  const getProfileImage = (imagePath: string | undefined) => {
    if (!imagePath) return require('@/assets/users/kavinda.png');
    
    // Map each possible image path to its require statement
    switch (imagePath) {
      case '/assets/users/kavinda.png':
      case '@/assets/users/kavinda.png':
        return require('@/assets/users/kavinda.png');
      case '/assets/users/manusha.png':
      case '@/assets/users/manusha.png':
        return require('@/assets/users/manusha.png');
      case '/assets/users/nadun.png':
      case '@/assets/users/nadun.png':
        return require('@/assets/users/nadun.png');
      case '/assets/users/nethmi.png':
      case '@/assets/users/nethmi.png':
        return require('@/assets/users/nethmi.png');
      case '/assets/users/chamudi.png':
      case '@/assets/users/chamudi.png':
        return require('@/assets/users/chamudi.png');
      case '/assets/users/ishan.png':
      case '@/assets/users/ishan.png':
        return require('@/assets/users/ishan.png');
      default:
        return require('@/assets/users/kavinda.png');
    }
  };

  // Format member since date for display
  const formatMemberSince = (memberSince: string) => {
    if (!memberSince) return 'Recently';
    return memberSince;
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Profile Information" />

      <ScrollView style={styles.content}>
        {/* Profile Image Section */}
        <View style={styles.photoSection}>
          <Image 
            source={getProfileImage(user?.profileImage)}
            style={styles.profileImage} 
          />
          <Text style={styles.nameText}>{user.name}</Text>
          <Text style={styles.memberSinceText}>Member since {formatMemberSince(user.memberSince)}</Text>
        </View>

        <View style={styles.infoCardContainer}>
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <User size={20} color="#004CFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Mail size={20} color="#004CFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Phone size={20} color="#004CFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Calendar size={20} color="#004CFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{user.dob || 'Not provided'}</Text>
              </View>
            </View>
          </View>

          {/* Address Card */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MapPin size={20} color="#004CFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{user.address || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MapPin size={20} color="#004CFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>City</Text>
                <Text style={styles.infoValue}>{user.city || 'Not provided'}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Button */}
      <View style={styles.editButtonContainer}>
        <TouchableOpacity
          onPress={() => router.push('/profile/edit')}
          style={styles.editButton}
        >
          <Edit2 size={20} color="white" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  memberSinceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoCardContainer: {
    marginBottom: 110,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  editButton: {
    backgroundColor: '#004CFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});