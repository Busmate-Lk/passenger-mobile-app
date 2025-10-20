import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  StatusBar,
  Platform
} from 'react-native';
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Bell,
  AlertTriangle,
  Clock,
  Bus,
  Ticket,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Navigation,
  Heart,
  Repeat
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { MockUserService } from '@/services/mockUserService';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  // Get user-specific data from mock service
  const upcomingTrip = user?.email ? MockUserService.getUpcomingTrip(user.email) : null;
  const recentRoutes = user?.email ? MockUserService.getRecentRoutes(user.email) : [];

  // Mock data for dashboard
  const promotions = [
    {
      id: 'promo1',
      title: 'Weekend Special',
      description: 'Get 15% off on weekend trips!',
      color: '#004CFF',
      image: 'https://images.pexels.com/photos/2402648/pexels-photo-2402648.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'promo2',
      title: 'Student Discount',
      description: 'Special rates for students with ID',
      color: '#FF3831',
      image: 'https://images.pexels.com/photos/1872199/pexels-photo-1872199.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  // Alert data
  const alerts = [
    {
      id: 'alert1',
      title: 'Route 001 Delays',
      message: 'Temporary delays on Colombo-Kandy due to construction',
      time: '10 mins ago',
      type: 'warning'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#1DD724';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#FF3831';
      default: return '#6B7280';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleRouteSearch = (route) => {
    router.push({
      pathname: '/search/results',
      params: {
        from: route.from,
        to: route.to,
        date: new Date().toISOString().split('T')[0],
        passengers: '1'
      }
    });
  };

  const handleToggleFavorite = (routeId) => {
    // TODO: Implement favorite toggle logic
    console.log('Toggle favorite for route:', routeId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#004CFF" translucent={false} />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username}>{user?.name ?? 'Passenger'}</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push('/notifications/inbox')}
        >
          <Bell size={24} color="#004CFF" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push('/search')}
          >
            <Search size={20} color="#6B7280" />
            <Text style={styles.searchPlaceholder}>Where are you going?</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/search')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#EBF2FF' }]}>
              <Search size={24} color="#004CFF" />
            </View>
            <Text style={styles.quickActionText}>Find Buses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/tickets')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF4EB' }]}>
              <Ticket size={24} color="#FF8A00" />
            </View>
            <Text style={styles.quickActionText}>My Tickets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/tracking/input')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#EBFFF4' }]}>
              <Bus size={24} color="#1DD724" />
            </View>
            <Text style={styles.quickActionText}>Track Bus</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Trip Card */}
        {upcomingTrip && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Trip</Text>
              <TouchableOpacity onPress={() => router.push('/tickets')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.upcomingTripCard}
              onPress={() => router.push(`/tickets/${upcomingTrip.id}/detail`)}
            >
              <Image source={{ uri: upcomingTrip.busImage }} style={styles.tripImage} />
              <View style={styles.tripOverlay}>
                <View style={styles.tripDetails}>
                  <View style={styles.tripHeader}>
                    <Text style={styles.tripRoute}>{upcomingTrip.route.from} → {upcomingTrip.route.to}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(upcomingTrip.status)}15` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(upcomingTrip.status) }]}>
                        Upcoming
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.tripInfo}>{upcomingTrip.operator} • Route {upcomingTrip.routeNumber}</Text>
                  <View style={styles.tripFooter}>
                    <View style={styles.tripDetail}>
                      <Clock size={16} color="#FFFFFF" />
                      <Text style={styles.tripDetailText}>{upcomingTrip.date}, {upcomingTrip.time}</Text>
                    </View>
                    <View style={styles.tripDetail}>
                      <Ticket size={16} color="#FFFFFF" />
                      <Text style={styles.tripDetailText}>Seat {upcomingTrip.seatNumber}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Routes - Modernized */}
        {recentRoutes.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Recent Routes</Text>
                <Text style={styles.sectionSubtitle}>Your frequently traveled routes</Text>
              </View>
              <TouchableOpacity
                style={styles.seeAllButton}
                onPress={() => router.push('/profile/favorites')}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ArrowRight size={16} color="#004CFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.recentRoutesContainer}>
              {recentRoutes.slice(0, 3).map((route, index) => (
                <TouchableOpacity 
                  key={route.id} 
                  style={styles.recentRouteCard}
                  activeOpacity={0.7}
                  onPress={() => handleRouteSearch(route)}
                >
                  {/* Route Information */}
                  <View style={styles.routeContent}>
                    <View style={styles.locationContainer}>
                      {/* Location labels above route path */}
                      <View style={styles.locationLabels}>
                        <Text style={styles.fromLocationLabel}>{route.from}</Text>
                        <Text style={styles.toLocationLabel}>{route.to}</Text>
                      </View>
                      
                      <View style={styles.routePathContainer}>
                        <View style={styles.originDot} />
                        <View style={styles.routeLine} />
                        <View style={styles.routeIcon}>
                          <Bus size={16} color="#6B7280" />
                        </View>
                        <View style={styles.routeLine} />
                        <View style={styles.destinationDot} />
                      </View>

                      {/* Last Used Information */}
                      <View style={styles.routeMetrics}>
                        {/* <TouchableOpacity 
                      style={styles.favoriteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(route.id);
                      }}
                    >
                      <Heart
                        size={16}
                        color={route.saved ? "#FF3831" : "#9CA3AF"}
                        fill={route.saved ? "#FF3831" : "none"}
                      />
                    </TouchableOpacity> */}
                        <View style={styles.metricItem}>
                          <Clock size={14} color="#6B7280" />
                          <Text style={styles.metricText}>
                            Last used {route.lastUsed || (index === 0 ? '2 days ago' : index === 1 ? '1 week ago' : '2 weeks ago')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Action Button */}
                  {/* <View style={styles.routeFooter}>
                    <TouchableOpacity 
                      style={styles.searchRouteButton}
                      onPress={() => handleRouteSearch(route)}
                    >
                      <Search size={16} color="#004CFF" />
                      <Text style={styles.searchRouteText}>Search This</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.favoriteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(route.id);
                      }}
                    >
                      <Heart
                        size={20}
                        color={route.saved ? "#FF3831" : "#9CA3AF"}
                        fill={route.saved ? "#FF3831" : "none"}
                      />
                    </TouchableOpacity>
                  </View> */}
                </TouchableOpacity>
              ))}

              {/* Add New Route Card */}
              <TouchableOpacity
                style={styles.addRouteCard}
                onPress={() => router.push('/search')}
                activeOpacity={0.7}
              >
                <View style={styles.addRouteIconContainer}>
                  <View style={styles.addRouteIcon}>
                    <Navigation size={24} color="#004CFF" />
                  </View>
                </View>
                <View style={styles.addRouteContent}>
                  <Text style={styles.addRouteTitle}>Find New Route</Text>
                  <Text style={styles.addRouteSubtitle}>Discover new destinations</Text>
                </View>
                <ArrowRight size={20} color="#004CFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Promotions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promoScrollContainer}
          >
            {promotions.map(promo => (
              <TouchableOpacity key={promo.id} style={styles.promoCard}>
                <Image source={{ uri: promo.image }} style={styles.promoImage} />
                <View style={[styles.promoOverlay, { backgroundColor: `${promo.color}99` }]}>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoDescription}>{promo.description}</Text>
                  <View style={styles.learnMoreButton}>
                    <Text style={styles.learnMoreText}>Learn More</Text>
                    <ArrowRight size={16} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Routes */}
        <View style={[styles.sectionContainer, { marginBottom: 24 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Routes</Text>
          </View>

          <View style={styles.popularRoutesContainer}>
            <TouchableOpacity style={styles.popularRouteItem}>
              <View style={styles.popularRouteInfo}>
                <Text style={styles.popularRouteTitle}>Colombo - Kandy</Text>
                <Text style={styles.popularRouteSubtitle}>3 hours • Express</Text>
              </View>
              <View style={styles.popularRoutePrice}>
                <Text style={styles.popularRoutePriceText}>LKR 250</Text>
                <ArrowUp size={16} color="#FF3831" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popularRouteItem}>
              <View style={styles.popularRouteInfo}>
                <Text style={styles.popularRouteTitle}>Colombo - Galle</Text>
                <Text style={styles.popularRouteSubtitle}>2 hours • Highway</Text>
              </View>
              <View style={styles.popularRoutePrice}>
                <Text style={styles.popularRoutePriceText}>LKR 200</Text>
                <ArrowDown size={16} color="#1DD724" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popularRouteItem}>
              <View style={styles.popularRouteInfo}>
                <Text style={styles.popularRouteTitle}>Kandy - Nuwara Eliya</Text>
                <Text style={styles.popularRouteSubtitle}>2.5 hours • Scenic</Text>
              </View>
              <View style={styles.popularRoutePrice}>
                <Text style={styles.popularRoutePriceText}>LKR 220</Text>
                <ArrowDown size={16} color="#1DD724" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#004CFF',
  },
  greeting: {
    fontSize: 14,
    color: '#FFFFF0',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3831',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 0,
    backgroundColor: 'background',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: '#9CA3AF',
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#004CFF',
    fontWeight: '500',
  },
  upcomingTripCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  tripImage: {
    width: '100%',
    height: '100%',
  },
  tripOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  tripDetails: {
    gap: 4,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripRoute: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tripInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tripFooter: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripDetailText: {
    fontSize: 14,
    color: 'white',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    marginTop: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Updated Recent Routes Styles
  recentRoutesContainer: {
    gap: 16,
  },
  recentRouteCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  routeContent: {
    marginBottom: 16,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fromLocationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  toLocationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  routePathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
  },
  routeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#004CFF',
    shadowColor: '#004CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3831',
    shadowColor: '#FF3831',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  routeMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    // paddingHorizontal: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  routeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  searchRouteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5EFFF',
  },
  searchRouteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004CFF',
  },
  favoriteButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addRouteCard: {
    backgroundColor: '#F8FAFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: '#E5EFFF',
    borderStyle: 'dashed',
  },
  addRouteIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRouteIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRouteContent: {
    flex: 1,
  },
  addRouteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  addRouteSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Existing styles for other sections...
  alertsContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8EB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  promoScrollContainer: {
    paddingRight: 24,
  },
  promoCard: {
    width: Dimensions.get('window').width * 0.75,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'flex-end',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  promoDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  popularRoutesContainer: {
    gap: 12,
  },
  popularRouteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  popularRouteInfo: {
    flex: 1,
  },
  popularRouteTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  popularRouteSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  popularRoutePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  popularRoutePriceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});