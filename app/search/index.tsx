import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, ArrowUpDown, Filter, MapPin, Clock } from 'lucide-react-native';
import AppHeader from '../../components/ui/AppHeader';
import RouteFilterModal from '../../components/modals/NewRouteFilterModal';
import StopSearchInput from '../../components/StopSearchInput';
import { PassengerStopResponse } from '../../lib/api-client/route-management';

interface FilterOptionsType {
  travelDate: Date;
  departureTimeFrom?: string;
  departureTimeTo?: string;
  operatorType?: 'PRIVATE' | 'CTB';
  operatorId?: string;
  status?: 'pending' | 'active' | 'completed' | 'cancelled' | 'delayed' | 'in_transit' | 'boarding' | 'departed';
  passengers: number;
}

export default function SearchScreen() {
  const router = useRouter();
  const [fromStop, setFromStop] = useState<PassengerStopResponse | null>(null);
  const [toStop, setToStop] = useState<PassengerStopResponse | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Colombo Fort to Kandy',
    'Negombo to Colombo',
    'Galle to Colombo',
  ]);

  // Popular destinations - we'll use static data for now but could come from API
  const popularDestinations = [
    'Colombo Fort', 'Kandy', 'Galle', 'Negombo', 'Anuradhapura', 'Matara'
  ];

  const [filterOptions, setFilterOptions] = useState<FilterOptionsType>({
    travelDate: new Date(),
    departureTimeFrom: undefined,
    departureTimeTo: undefined,
    operatorType: undefined,
    operatorId: undefined,
    status: undefined,
    passengers: 1
  });

  const handleSearch = () => {
    if (!fromStop || !toStop) {
      return;
    }

    // Save to recent searches
    const searchString = `${fromStop.name} to ${toStop.name}`;
    if (!recentSearches.includes(searchString)) {
      setRecentSearches(prev => [searchString, ...prev.slice(0, 4)]);
    }

    // Navigate to results with search parameters
    router.push({
      pathname: '/search/results',
      params: {
        fromStopId: fromStop.stopId || '',
        toStopId: toStop.stopId || '',
        fromStopName: fromStop.name || '',
        toStopName: toStop.name || '',
        travelDate: filterOptions.travelDate.toISOString().split('T')[0], // YYYY-MM-DD format
        departureTimeFrom: filterOptions.departureTimeFrom || '',
        departureTimeTo: filterOptions.departureTimeTo || '',
        operatorType: filterOptions.operatorType || '',
        operatorId: filterOptions.operatorId || '',
        passengers: filterOptions.passengers.toString(),
        filters: JSON.stringify(filterOptions)
      }
    });
  };

  const swapLocations = () => {
    const tempFromStop = fromStop;
    setFromStop(toStop);
    setToStop(tempFromStop);
  };

  const applyFilters = (newFilters: FilterOptionsType) => {
    setFilterOptions(newFilters);
  };

  const formatFilterSummary = () => {
    const parts = [];

    // Date info
    parts.push(filterOptions.travelDate.toLocaleDateString());

    // Passenger info
    parts.push(`${filterOptions.passengers} passenger${filterOptions.passengers !== 1 ? 's' : ''}`);

    // Departure time filters
    if (filterOptions.departureTimeFrom && filterOptions.departureTimeTo) {
      parts.push(`${filterOptions.departureTimeFrom} - ${filterOptions.departureTimeTo}`);
    } else if (filterOptions.departureTimeFrom) {
      parts.push(`From ${filterOptions.departureTimeFrom}`);
    } else if (filterOptions.departureTimeTo) {
      parts.push(`Until ${filterOptions.departureTimeTo}`);
    }

    // Operator type
    if (filterOptions.operatorType) {
      parts.push(filterOptions.operatorType);
    }

    return parts.join(' • ');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader 
        title="Search Bus Routes"
        showBackButton={true}
        rightElement={
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#FFFFFF" />
          </TouchableOpacity>
        }
        statusBarStyle="light-content"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          {/* Search Form */}
          <View style={styles.searchForm}>
            {/* Search inputs container */}
            <View style={styles.searchInputsContainer}>
              {/* From */}
              <StopSearchInput
                label="From"
                placeholder="Enter departure location"
                value={fromStop?.name || ''}
                onStopSelect={setFromStop}
                style={styles.inputContainer}
              />

              {/* To */}
              <StopSearchInput
                label="To"
                placeholder="Enter destination"
                value={toStop?.name || ''}
                onStopSelect={setToStop}
                style={[styles.inputContainer, styles.toInputContainer]}
              />

              {/* Swap Button */}
              <TouchableOpacity
                style={styles.swapButton}
                onPress={swapLocations}
              >
                <ArrowUpDown size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Filter summary */}
            <TouchableOpacity
              style={styles.filterSummary}
              onPress={() => setShowFilterModal(true)}
            >
              <Clock size={16} color="#6B7280" />
              <Text style={styles.filterSummaryText}>
                {formatFilterSummary()}
              </Text>
            </TouchableOpacity>

            {/* Search Button */}
            <TouchableOpacity
              style={[
                styles.searchButton,
                (!fromStop || !toStop) && styles.searchButtonDisabled
              ]}
              onPress={handleSearch}
              disabled={!fromStop || !toStop}
            >
              <Search size={18} color="#FFFFFF" />
              <Text style={styles.searchButtonText}>Search Routes</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>

              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => {
                    // Note: This is simplified - in real implementation you'd need to search for stops by name
                    // For now, we'll skip this functionality and let user search manually
                  }}
                >
                  <View style={styles.recentSearchIcon}>
                    <Clock size={16} color="#004CFF" />
                  </View>
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Popular Destinations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <View style={styles.destinationsGrid}>
              {popularDestinations.map((destination, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.destinationChip}
                  onPress={() => {
                    // Note: This is simplified - in real implementation you'd search for stop by name
                    // For now, we'll skip this functionality
                  }}
                >
                  <Text style={styles.destinationText}>{destination}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <RouteFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        onApplyFilters={applyFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F9',
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  searchForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInputsContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 8,
  },
  toInputContainer: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  fromInput: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  toInput: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  swapButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    width: 52,
    height: 52,
    borderRadius: 50,
    backgroundColor: '#004CFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  filterSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 16,
  },
  filterSummaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004CFF',
    borderRadius: 12,
    paddingVertical: 14,
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  clearText: {
    fontSize: 14,
    color: '#004CFF',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recentSearchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentSearchText: {
    fontSize: 14,
    color: '#374151',
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginHorizontal: -4,
  },
  destinationChip: {
    backgroundColor: '#EBF2FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  destinationText: {
    fontSize: 14,
    color: '#004CFF',
  },
});