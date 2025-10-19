import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StyleSheet,
  Platform,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import { X, Calendar, Users, ChevronDown, Plus, Search, Trash } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FilterOptionsType {
  priceRange: [number, number];
  departureTime: string[];
  busType: string[];
  amenities: string[];
  operators: string[];
  date?: Date;
  endDate?: Date;
  isDateRange: boolean;
  passengers: number;
}

interface RouteFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterOptions: FilterOptionsType;
  onApplyFilters: (filters: FilterOptionsType) => void;
}

export default function RouteFilterModal({
  visible,
  onClose,
  filterOptions: initialFilters,
  onApplyFilters,
}: RouteFilterModalProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptionsType>(initialFilters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [operatorSearch, setOperatorSearch] = useState('');
  const [showOperatorSuggestions, setShowOperatorSuggestions] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // For operator suggestions
  const operatorSuggestions = [
    { id: 'sltb', label: 'SLTB Express' },
    { id: 'ntc', label: 'National Transport Commission' },
    { id: 'superline', label: 'Super Line' },
    { id: 'expressway', label: 'Expressway Transit' },
    { id: 'blueline', label: 'Blue Line Express' },
    { id: 'greenline', label: 'Green Line' },
    { id: 'silverline', label: 'Silver Line' },
    { id: 'redline', label: 'Red Line Transit' },
    { id: 'goldline', label: 'Gold Line Express' },
    { id: 'rapidtransit', label: 'Rapid Transit' },
  ].filter(
    op => 
      !filterOptions.operators.includes(op.id) && 
      op.label.toLowerCase().includes(operatorSearch.toLowerCase())
  );

  // Update local state when props change
  useEffect(() => {
    setFilterOptions(initialFilters);
  }, [initialFilters]);

  // For suggestions dropdown animation
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: showOperatorSuggestions && operatorSuggestions.length > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showOperatorSuggestions, operatorSuggestions.length]);

  const timeSlots = [
    { id: 'any', label: 'Any Time', icon: '🕒' },
    { id: 'morning', label: 'Morning', icon: '🌅', time: '6AM - 12PM' },
    { id: 'afternoon', label: 'Afternoon', icon: '☀️', time: '12PM - 5PM' },
    { id: 'evening', label: 'Evening', icon: '🌆', time: '5PM - 9PM' },
    { id: 'night', label: 'Night', icon: '🌙', time: '9PM - 6AM' },
  ];

  const busTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'express', label: 'Express' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'normal', label: 'Normal' },
    { id: 'semi-luxury', label: 'Semi-Luxury' },
    { id: 'super-luxury', label: 'Super Luxury' },
    { id: 'ac', label: 'A/C' },
    { id: 'non-ac', label: 'Non-A/C' },
  ];

  const amenitiesList = [
    { id: 'ac', label: 'A/C', icon: '❄️' },
    { id: 'wifi', label: 'Wi-Fi', icon: '📶' },
    { id: 'charging', label: 'Charging', icon: '🔌' },
    { id: 'reclining', label: 'Reclining Seats', icon: '🪑' },
    { id: 'water', label: 'Water', icon: '💧' },
    { id: 'tv', label: 'TV', icon: '📺' },
    { id: 'blanket', label: 'Blankets', icon: '🧣' },
    { id: 'snacks', label: 'Snacks', icon: '🍪' },
    { id: 'toilet', label: 'Toilet', icon: '🚻' },
    { id: 'luggage', label: 'Extra Luggage', icon: '🧳' },
  ];

  const toggleDepartureTime = (id: string) => {
    setFilterOptions(prev => {
      if (prev.departureTime.includes(id)) {
        return {
          ...prev,
          departureTime: prev.departureTime.filter(item => item !== id),
        };
      } else {
        // If "Any" is selected, clear other selections
        if (id === 'any') {
          return {
            ...prev,
            departureTime: ['any']
          };
        }
        // If another option is selected and "Any" was previously selected, remove "Any"
        const newDepartureTime = prev.departureTime.filter(item => item !== 'any');
        return {
          ...prev,
          departureTime: [...newDepartureTime, id],
        };
      }
    });
  };

  const toggleBusType = (id: string) => {
    setFilterOptions(prev => {
      if (prev.busType.includes(id)) {
        return {
          ...prev,
          busType: prev.busType.filter(item => item !== id),
        };
      } else {
        // If "All Types" is selected, clear other selections
        if (id === 'all') {
          return {
            ...prev,
            busType: ['all']
          };
        }
        // If another option is selected and "All Types" was previously selected, remove "All Types"
        const newBusType = prev.busType.filter(item => item !== 'all');
        return {
          ...prev,
          busType: [...newBusType, id],
        };
      }
    });
  };

  const toggleAmenity = (id: string) => {
    setFilterOptions(prev => {
      if (prev.amenities.includes(id)) {
        return {
          ...prev,
          amenities: prev.amenities.filter(item => item !== id),
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, id],
        };
      }
    });
  };

  const addOperator = (operator: { id: string, label: string }) => {
    setFilterOptions(prev => ({
      ...prev,
      operators: [...prev.operators, operator.id]
    }));
    setOperatorSearch('');
    setShowOperatorSuggestions(false);
  };

  const removeOperator = (id: string) => {
    setFilterOptions(prev => ({
      ...prev,
      operators: prev.operators.filter(item => item !== id),
    }));
  };

  const toggleDateRangeMode = () => {
    setFilterOptions(prev => ({
      ...prev,
      isDateRange: !prev.isDateRange,
      endDate: prev.isDateRange ? undefined : prev.endDate
    }));
  };

  const incrementPassengers = () => {
    setFilterOptions(prev => ({
      ...prev,
      passengers: prev.passengers + 1
    }));
  };

  const decrementPassengers = () => {
    if (filterOptions.passengers > 1) {
      setFilterOptions(prev => ({
        ...prev,
        passengers: prev.passengers - 1
      }));
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const resetFilters = () => {
    setFilterOptions({
      priceRange: [100, 500],
      departureTime: [],
      busType: [],
      amenities: [],
      operators: [],
      date: new Date(),
      endDate: undefined,
      isDateRange: false,
      passengers: 1,
    });
    setOperatorSearch('');
    setShowOperatorSuggestions(false);
  };

  const applyFilters = () => {
    onApplyFilters(filterOptions);
    onClose();
  };

  // Find operator label by id
  const getOperatorLabel = (id: string) => {
    const found = operatorSuggestions.find(op => op.id === id);
    if (found) return found.label;
    
    const allOperators = [
      { id: 'sltb', label: 'SLTB Express' },
      { id: 'ntc', label: 'National Transport Commission' },
      { id: 'superline', label: 'Super Line' },
      { id: 'expressway', label: 'Expressway Transit' },
      { id: 'blueline', label: 'Blue Line Express' },
      { id: 'greenline', label: 'Green Line' },
      { id: 'silverline', label: 'Silver Line' },
      { id: 'redline', label: 'Red Line Transit' },
      { id: 'goldline', label: 'Gold Line Express' },
      { id: 'rapidtransit', label: 'Rapid Transit' },
    ];
    
    const foundInAll = allOperators.find(op => op.id === id);
    return foundInAll ? foundInAll.label : id;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.closeButton}
            >
              <X size={20} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filter Routes</Text>
            <TouchableOpacity 
              onPress={resetFilters}
              style={styles.resetTextButton}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.filtersScroll} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContent}
          >
            {/* 1. Bus Type */}
            <View style={styles.filterSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.filterTitle}>Bus Type</Text>
              </View>
              
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={busTypes}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      filterOptions.busType.includes(item.id) && styles.chipSelected
                    ]}
                    onPress={() => toggleBusType(item.id)}
                  >
                    <Text style={[
                      styles.chipText,
                      filterOptions.busType.includes(item.id) && styles.chipTextSelected
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.horizontalListContent}
              />
            </View>
            
            {/* 2. Departure Time */}
            <View style={styles.filterSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.filterTitle}>Departure Time</Text>
              </View>
              
              <View style={styles.timeGrid}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlot,
                      filterOptions.departureTime.includes(slot.id) && styles.timeSlotSelected
                    ]}
                    onPress={() => toggleDepartureTime(slot.id)}
                  >
                    {/* <Text style={styles.timeSlotIcon}>{slot.icon}</Text> */}
                    <Text style={[
                      styles.timeSlotLabel,
                      filterOptions.departureTime.includes(slot.id) && styles.timeSlotLabelSelected
                    ]}>
                      {slot.label}
                    </Text>
                    {slot.time && (
                      <Text style={[
                        styles.timeSlotTime,
                        filterOptions.departureTime.includes(slot.id) && styles.timeSlotTimeSelected
                      ]}>
                        {slot.time}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* 3. Travel Date */}
            <View style={styles.filterSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.filterTitle}>Travel Date</Text>
              </View>
              
              <View style={styles.dateModeContainer}>
                <View style={styles.dateModeToggle}>
                  <TouchableOpacity
                    style={[
                      styles.dateToggleButton,
                      !filterOptions.isDateRange && styles.dateToggleButtonActive
                    ]}
                    onPress={() => filterOptions.isDateRange && toggleDateRangeMode()}
                  >
                    <Text style={[
                      styles.dateToggleText,
                      !filterOptions.isDateRange && styles.dateToggleTextActive
                    ]}>Single Date</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dateToggleButton, 
                      filterOptions.isDateRange && styles.dateToggleButtonActive
                    ]}
                    onPress={() => !filterOptions.isDateRange && toggleDateRangeMode()}
                  >
                    <Text style={[
                      styles.dateToggleText,
                      filterOptions.isDateRange && styles.dateToggleTextActive
                    ]}>Date Range</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.dateSelectionContainer}>
                <TouchableOpacity 
                  style={styles.dateSelector}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Calendar size={18} color="#004CFF" />
                  <Text style={styles.dateText}>
                    {filterOptions.date ? formatDate(filterOptions.date) : 'Select date'}
                  </Text>
                  <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>
                
                {filterOptions.isDateRange && (
                  <TouchableOpacity 
                    style={[styles.dateSelector, styles.endDateSelector]}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Calendar size={18} color="#004CFF" />
                    <Text style={styles.dateText}>
                      {filterOptions.endDate ? formatDate(filterOptions.endDate) : 'End date'}
                    </Text>
                    <ChevronDown size={18} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {/* 4. Fare Range */}
            <View style={styles.filterSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.filterTitle}>Fare Range</Text>
                <Text style={styles.priceRangeText}>
                  LKR {filterOptions.priceRange[0]} - LKR {filterOptions.priceRange[1]}
                </Text>
              </View>
              <View style={styles.priceSliderContainer}>
                {/* Slider implementation would go here */}
                <View style={styles.priceSlider}>
                  <View style={styles.priceSliderActive} />
                  <View style={[styles.priceThumb, { left: '20%' }]} />
                  <View style={[styles.priceThumb, { left: '70%' }]} />
                </View>
                <View style={styles.priceLabels}>
                  <Text style={styles.priceLabel}>LKR 0</Text>
                  <Text style={styles.priceLabel}>LKR 1000+</Text>
                </View>
              </View>
            </View>
            
            {/* 5. Passengers Count */}
            <View style={styles.filterSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.filterTitle}>Passengers</Text>
              </View>
              <View style={styles.passengerSelector}>
                <View style={styles.passengerInfo}>
                  <Users size={18} color="#004CFF" />
                  <Text style={styles.passengerText}>
                    {filterOptions.passengers} Passenger{filterOptions.passengers !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.passengerControls}>
                  <TouchableOpacity 
                    style={[
                      styles.passengerButton,
                      filterOptions.passengers <= 1 && styles.passengerButtonDisabled
                    ]}
                    onPress={decrementPassengers}
                    disabled={filterOptions.passengers <= 1}
                  >
                    <Text style={[
                      styles.passengerButtonText,
                      filterOptions.passengers <= 1 && styles.passengerButtonTextDisabled
                    ]}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.passengerCountText}>{filterOptions.passengers}</Text>
                  <TouchableOpacity 
                    style={styles.passengerButton}
                    onPress={incrementPassengers}
                  >
                    <Text style={styles.passengerButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* 6. Bus Operators */}
            <View style={[styles.filterSection, styles.operatorsSection]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.filterTitle}>Bus Operators</Text>
              </View>
              
              <View style={styles.operatorSearchContainer}>
                <View style={styles.operatorSearchInputContainer}>
                  <Search size={18} color="#6B7280" style={styles.searchIcon} />
                  <TextInput
                    style={styles.operatorSearchInput}
                    placeholder="Search for bus operators"
                    value={operatorSearch}
                    onChangeText={(text) => {
                      setOperatorSearch(text);
                      setShowOperatorSuggestions(text.length > 0);
                    }}
                    onFocus={() => operatorSearch.length > 0 && setShowOperatorSuggestions(true)}
                  />
                  {operatorSearch.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setOperatorSearch('');
                        setShowOperatorSuggestions(false);
                      }}
                      style={styles.clearSearchButton}
                    >
                      <X size={16} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>
                
                {/* Operator suggestions dropdown */}
                <Animated.View 
                  style={[
                    styles.operatorSuggestionsContainer,
                    {
                      maxHeight: animatedHeight.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 200]
                      }),
                      opacity: animatedHeight,
                      borderWidth: animatedHeight.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                      })
                    }
                  ]}
                >
                  {operatorSuggestions.map((operator) => (
                    <TouchableOpacity
                      key={operator.id}
                      style={styles.operatorSuggestionItem}
                      onPress={() => addOperator(operator)}
                    >
                      <Text style={styles.operatorSuggestionText}>{operator.label}</Text>
                      <Plus size={16} color="#004CFF" />
                    </TouchableOpacity>
                  ))}
                  {operatorSuggestions.length === 0 && operatorSearch.length > 0 && (
                    <View style={styles.noSuggestionsContainer}>
                      <Text style={styles.noSuggestionsText}>No operators found</Text>
                    </View>
                  )}
                </Animated.View>
              </View>
              
              {/* Selected operators */}
              {filterOptions.operators.length > 0 ? (
                <View style={styles.selectedOperatorsContainer}>
                  {filterOptions.operators.map((operatorId) => (
                    <View key={operatorId} style={styles.selectedOperatorTag}>
                      <Text style={styles.selectedOperatorText}>
                        {getOperatorLabel(operatorId)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeOperator(operatorId)}
                        style={styles.removeOperatorButton}
                      >
                        <X size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noOperatorsText}>
                  No operators selected. Search and add operators to filter by.
                </Text>
              )}
            </View>
            
            {/* 7. Amenities */}
            <View style={styles.filterSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.filterTitle}>Amenities</Text>
              </View>
              
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={amenitiesList}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={[
                      styles.amenityChip,
                      filterOptions.amenities.includes(item.id) && styles.amenityChipSelected
                    ]}
                    onPress={() => toggleAmenity(item.id)}
                  >
                    <Text style={styles.amenityIcon}>{item.icon}</Text>
                    <Text style={[
                      styles.amenityText,
                      filterOptions.amenities.includes(item.id) && styles.amenityTextSelected
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.horizontalListContent}
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
          
          {/* Date Pickers */}
          {showStartDatePicker && (
            <DateTimePicker
              value={filterOptions.date || new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  setFilterOptions(prev => ({
                    ...prev,
                    date: selectedDate,
                    // If we're in range mode and end date is before the new start date, clear end date
                    endDate: prev.endDate && prev.isDateRange && selectedDate > prev.endDate ? undefined : prev.endDate
                  }));
                }
              }}
            />
          )}
          
          {showEndDatePicker && (
            <DateTimePicker
              value={filterOptions.endDate || (filterOptions.date ? new Date(filterOptions.date) : new Date())}
              mode="date"
              display="default"
              minimumDate={filterOptions.date || new Date()}
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) {
                  setFilterOptions(prev => ({
                    ...prev,
                    endDate: selectedDate
                  }));
                }
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  resetTextButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#004CFF',
  },
  filtersScroll: {
    flex: 1,
  },
  filtersScrollContent: {
    paddingBottom: 20,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  horizontalListContent: {
    paddingRight: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  chipSelected: {
    backgroundColor: '#EBF2FF',
    borderColor: '#004CFF',
  },
  chipText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#004CFF',
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    // justifyContent: 'space-between',
  },
  timeSlot: {
    width: '32%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeSlotSelected: {
    backgroundColor: '#EBF2FF',
    borderColor: '#004CFF',
  },
  timeSlotIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  timeSlotLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 2,
    textAlign: 'center',
  },
  timeSlotLabelSelected: {
    color: '#004CFF',
  },
  timeSlotTime: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  timeSlotTimeSelected: {
    color: '#004CFF',
  },
  dateModeContainer: {
    marginBottom: 16,
  },
  dateModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  dateToggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  dateToggleButtonActive: {
    backgroundColor: '#EBF2FF',
  },
  dateToggleText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dateToggleTextActive: {
    color: '#004CFF',
    fontWeight: '600',
  },
  dateSelectionContainer: {
    marginBottom: 8,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  endDateSelector: {
    marginTop: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginLeft: 12,
  },
  priceRangeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceSliderContainer: {
    paddingVertical: 8,
  },
  priceSlider: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginVertical: 16,
    position: 'relative',
  },
  priceSliderActive: {
    position: 'absolute',
    left: '20%',
    right: '30%',
    height: 4,
    backgroundColor: '#004CFF',
    borderRadius: 2,
  },
  priceThumb: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#004CFF',
    borderWidth: 2,
    borderRadius: 10,
    position: 'absolute',
    top: -8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  passengerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 12,
  },
  passengerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#004CFF',
  },
  passengerButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  passengerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#004CFF',
  },
  passengerButtonTextDisabled: {
    color: '#9CA3AF',
  },
  passengerCountText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    width: 40,
    textAlign: 'center',
  },
  operatorsSection: {
    paddingBottom: 20,
  },
  operatorSearchContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  operatorSearchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  operatorSearchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  clearSearchButton: {
    padding: 4,
  },
  operatorSuggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    zIndex: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  operatorSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  operatorSuggestionText: {
    fontSize: 14,
    color: '#111827',
  },
  noSuggestionsContainer: {
    padding: 12,
    alignItems: 'center',
  },
  noSuggestionsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  selectedOperatorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  selectedOperatorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004CFF',
    borderRadius: 100,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOperatorText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 4,
  },
  removeOperatorButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noOperatorsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  amenityChipSelected: {
    backgroundColor: '#EBF2FF',
    borderColor: '#004CFF',
  },
  amenityIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  amenityText: {
    fontSize: 14,
    color: '#4B5563',
  },
  amenityTextSelected: {
    color: '#004CFF',
    fontWeight: '500',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  applyButton: {
    backgroundColor: '#004CFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#004CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});