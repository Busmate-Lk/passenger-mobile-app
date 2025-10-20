import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Info, X, AlertTriangle, Users } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import AppHeader from '../../components/ui/AppHeader';
import { useBooking } from '../../context/BookingContext';

interface Seat {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'selected' | 'reserved' | 'priority';
  type: 'window' | 'aisle' | 'middle';
  price?: number;
}

export default function SeatSelectionScreen() {
  const router = useRouter();
  const { bookingData, setSelectedSeat } = useBooking();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState(false);

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData) {
      Alert.alert(
        'No Booking Data',
        'Please start the booking process from the search results.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }

    // Initialize with already selected seat if any
    if (bookingData.selectedSeatNumber) {
      setSelectedSeats([bookingData.selectedSeatNumber]);
    }
  }, [bookingData, router]);

  if (!bookingData) {
    return null; // Will redirect via useEffect
  }

  const passengersCount = 1; // Single passenger booking only

  // Mock seat layout for typical Sri Lankan bus (12 rows, 2+2 configuration with rear 5-seater)
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const occupiedSeats = ['A1', 'A4', 'B2', 'C3', 'D1', 'E4', 'F2', 'G3'];
    const reservedSeats = ['B3', 'D4'];
    const prioritySeats = ['A3', 'B1', 'B4']; // For elderly, pregnant women, differently-abled
    
    // Front cabin - driver's area
    seats.push({
      id: 'driver',
      number: 'DR',
      status: 'occupied',
      type: 'window'
    });
    
    // Regular rows (10 rows of 2+2 configuration)
    for (let row = 1; row <= 10; row++) {
      const rowLetter = String.fromCharCode(64 + row); // A, B, C...
      
      // Left side seats
      seats.push({
        id: `${rowLetter}1`,
        number: `${rowLetter}1`,
        status: prioritySeats.includes(`${rowLetter}1`) ? 'priority' : 
               occupiedSeats.includes(`${rowLetter}1`) ? 'occupied' : 
               reservedSeats.includes(`${rowLetter}1`) ? 'reserved' : 'available',
        type: 'window',
        price: 250
      });
      
      seats.push({
        id: `${rowLetter}2`,
        number: `${rowLetter}2`,
        status: prioritySeats.includes(`${rowLetter}2`) ? 'priority' : 
               occupiedSeats.includes(`${rowLetter}2`) ? 'occupied' : 
               reservedSeats.includes(`${rowLetter}2`) ? 'reserved' : 'available',
        type: 'aisle',
        price: 250
      });
      
      // Right side seats
      seats.push({
        id: `${rowLetter}3`,
        number: `${rowLetter}3`,
        status: prioritySeats.includes(`${rowLetter}3`) ? 'priority' : 
               occupiedSeats.includes(`${rowLetter}3`) ? 'occupied' : 
               reservedSeats.includes(`${rowLetter}3`) ? 'reserved' : 'available',
        type: 'aisle',
        price: 250
      });
      
      seats.push({
        id: `${rowLetter}4`,
        number: `${rowLetter}4`,
        status: prioritySeats.includes(`${rowLetter}4`) ? 'priority' : 
               occupiedSeats.includes(`${rowLetter}4`) ? 'occupied' : 
               reservedSeats.includes(`${rowLetter}4`) ? 'reserved' : 'available',
        type: 'window',
        price: 250
      });
    }
    
    // Last row - 5-seater
    seats.push({
      id: 'last1',
      number: 'L1',
      status: 'available',
      type: 'window',
      price: 225
    });
    
    seats.push({
      id: 'last2',
      number: 'L2',
      status: 'available',
      type: 'middle',
      price: 225
    });
    
    seats.push({
      id: 'last3',
      number: 'L3',
      status: occupiedSeats.includes('L3') ? 'occupied' : 'available',
      type: 'middle',
      price: 225
    });
    
    seats.push({
      id: 'last4',
      number: 'L4',
      status: 'available',
      type: 'middle',
      price: 225
    });
    
    seats.push({
      id: 'last5',
      number: 'L5',
      status: occupiedSeats.includes('L5') ? 'occupied' : 'available',
      type: 'window',
      price: 225
    });
    
    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats());

  const handleSeatPress = (seatId: string) => {
    const seatStatus = getSeatStatus(seatId);
    if (seatStatus === 'occupied' || seatStatus === 'reserved' || seatId === 'driver') return;

    if (selectedSeats.includes(seatId)) {
      // Deselect the seat
      setSelectedSeats([]);
    } else {
      // Select only this seat (single passenger only)
      setSelectedSeats([seatId]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 1) {
      // Save selected seat to booking context
      setSelectedSeat(selectedSeats[0]);
      // Navigate back to booking confirmation
      router.push('/search/booking');
    }
  };

  const getSeatStatus = (seatId: string): 'available' | 'occupied' | 'selected' | 'reserved' | 'priority' => {
    if (selectedSeats.includes(seatId)) return 'selected';
    return seats.find(s => s.id === seatId)?.status || 'available';
  };

  const getSeatStyle = (status: 'available' | 'occupied' | 'selected' | 'reserved' | 'priority', type: string) => {
    const baseStyle = [
      styles.seat,
      type === 'window' && styles.windowSeat,
      type === 'aisle' && styles.aisleSeat,
      type === 'middle' && styles.middleSeat
    ];

    switch (status) {
      case 'available':
        return [...baseStyle, styles.seatAvailable];
      case 'occupied':
        return [...baseStyle, styles.seatOccupied];
      case 'selected':
        return [...baseStyle, styles.seatSelected];
      case 'reserved':
        return [...baseStyle, styles.seatReserved];
      case 'priority':
        return [...baseStyle, styles.seatPriority];
      default:
        return [...baseStyle, styles.seatAvailable];
    }
  };

  const getSeatPrice = (seatId: string): number => {
    return seats.find(s => s.id === seatId)?.price || 250;
  };

  const renderDriverArea = () => (
    <View style={styles.driverArea}>
      <View style={styles.doorSection}>
        <Text style={styles.doorLabel}>Door</Text>
      </View>
      <View style={styles.driverSection}>
        <View style={styles.steeringWheel} />
        <Text style={styles.driverLabel}>Driver</Text>
      </View>
    </View>
  );

  const renderRegularRows = () => {
    const regularSeats = seats.filter(seat => seat.id !== 'driver' && !seat.id.startsWith('last'));
    const rows = [];

    for (let i = 0; i < regularSeats.length; i += 4) {
      const rowSeats = regularSeats.slice(i, i + 4);
      const rowIndex = Math.floor(i / 4) + 1;
      
      rows.push(
        <View key={`row-${rowIndex}`} style={styles.seatRow}>
          <Text style={styles.rowNumber}>{rowIndex}</Text>
          
          {/* Left side seats */}
          <View style={styles.seatPair}>
            {rowSeats.slice(0, 2).map((seat) => {
              const status = getSeatStatus(seat.id);
              return (
                <TouchableOpacity
                  key={seat.id}
                  onPress={() => handleSeatPress(seat.id)}
                  style={getSeatStyle(status, seat.type)}
                  disabled={status === 'occupied' || status === 'reserved'}
                >
                  <Text style={[
                    styles.seatText,
                    status === 'selected' && styles.seatTextSelected,
                    status === 'occupied' && styles.seatTextOccupied,
                    status === 'reserved' && styles.seatTextReserved,
                    status === 'priority' && styles.seatTextPriority,
                  ]}>
                    {seat.number}
                  </Text>
                  {status === 'priority' && (
                    <AlertTriangle size={10} color="#FF9800" style={styles.priorityIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Aisle */}
          <View style={styles.aisle} />

          {/* Right side seats */}
          <View style={styles.seatPair}>
            {rowSeats.slice(2, 4).map((seat) => {
              const status = getSeatStatus(seat.id);
              return (
                <TouchableOpacity
                  key={seat.id}
                  onPress={() => handleSeatPress(seat.id)}
                  style={getSeatStyle(status, seat.type)}
                  disabled={status === 'occupied' || status === 'reserved'}
                >
                  <Text style={[
                    styles.seatText,
                    status === 'selected' && styles.seatTextSelected,
                    status === 'occupied' && styles.seatTextOccupied,
                    status === 'reserved' && styles.seatTextReserved,
                    status === 'priority' && styles.seatTextPriority,
                  ]}>
                    {seat.number}
                  </Text>
                  {status === 'priority' && (
                    <AlertTriangle size={10} color="#FF9800" style={styles.priorityIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    }

    return rows;
  };

  const renderLastRow = () => {
    const lastRowSeats = seats.filter(seat => seat.id.startsWith('last'));
    
    return (
      <View style={styles.lastRow}>
        <Text style={styles.rowNumber}>11</Text>
        <View style={styles.lastRowSeats}>
          {lastRowSeats.map((seat) => {
            const status = getSeatStatus(seat.id);
            return (
              <TouchableOpacity
                key={seat.id}
                onPress={() => handleSeatPress(seat.id)}
                style={getSeatStyle(status, seat.type)}
                disabled={status === 'occupied' || status === 'reserved'}
              >
                <Text style={[
                  styles.seatText,
                  status === 'selected' && styles.seatTextSelected,
                  status === 'occupied' && styles.seatTextOccupied,
                  status === 'reserved' && styles.seatTextReserved,
                ]}>
                  {seat.number}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => total + getSeatPrice(seatId), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader 
        title="Select Seats"
        rightElement={
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={() => setShowInfo(!showInfo)}
          >
            <Info size={22} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      {/* Info Panel - conditionally rendered */}
      {showInfo && (
        <View style={styles.infoPanel}>
          <Text style={styles.infoPanelTitle}>About Seat Selection</Text>
          <Text style={styles.infoPanelText}>
            Priority seats are reserved for elderly passengers, pregnant women, and differently-abled passengers.
          </Text>
          <Text style={styles.infoPanelText}>
            Window seats offer scenic views, while aisle seats provide easy access to the corridor.
          </Text>
          <TouchableOpacity 
            style={styles.closeInfoButton}
            onPress={() => setShowInfo(false)}
          >
            <Text style={styles.closeInfoText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.seatAvailable]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.seatSelected]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.seatOccupied]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.seatReserved]} />
            <Text style={styles.legendText}>Reserved</Text>
          </View>
          {/* <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.seatPriority]} />
            <Text style={styles.legendText}>Priority</Text>
            <AlertTriangle size={10} color="#CF1322" />
          </View> */}
        </View>
      </View>

      {/* Bus Layout */}
      <View style={styles.busContainer}>
        <View style={styles.busHeader}>
          <Text style={styles.busTitle}>SLTB Express - Route 001</Text>
          <View style={styles.busInfo}>
            <Users size={14} color="#6B7280" style={{marginRight: 4}} />
            <Text style={styles.busInfoText}>
              1 passenger
            </Text>
          </View>
        </View>

        <ScrollView style={styles.seatsContainer} showsVerticalScrollIndicator={false}>
          {renderDriverArea()}
          <View style={styles.busBody}>
            {renderRegularRows()}
            {renderLastRow()}
          </View>
          
          {/* <View style={styles.backDoor}>
            <Text style={styles.doorLabel}>Rear Door</Text>
          </View> */}
        </ScrollView>
      </View>

      {/* Selected Seats Info */}
      {selectedSeats.length > 0 && (
        <View style={styles.selectedSeatsContainer}>
          <Text style={styles.selectedSeatsTitle}>
            Selected Seat ({selectedSeats.length}/1)
          </Text>
          <View style={styles.selectedSeatsList}>
            {selectedSeats.map((seatId) => {
              const seat = seats.find(s => s.id === seatId);
              return (
                <View key={seatId} style={styles.selectedSeatChip}>
                  <Text style={styles.selectedSeatNumber}>{seat?.number}</Text>
                  <Text style={styles.selectedSeatType}>
                    {seat?.type === 'window' ? 'Window' : 
                     seat?.type === 'aisle' ? 'Aisle' : 'Middle'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleSeatPress(seatId)}
                    style={styles.removeSeatButton}
                  >
                    <X size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Continue Button */}
      <View style={styles.continueContainer}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>LKR {totalPrice}</Text>
        </View>
        
        <TouchableOpacity
          onPress={handleContinue}
          disabled={selectedSeats.length === 0}
          style={[
            styles.continueButton,
            selectedSeats.length === 0 && styles.continueButtonDisabled
          ]}
        >
          <Text style={[
            styles.continueButtonText,
            selectedSeats.length === 0 && styles.continueButtonTextDisabled
          ]}>
            Continue with Selected Seat
          </Text>
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
  infoButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoPanel: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#004CFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoPanelText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  closeInfoButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  closeInfoText: {
    color: '#004CFF',
    fontWeight: '500',
    fontSize: 14,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#595959',
  },
  busContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busHeader: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  busTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  busInfoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  seatsContainer: {
    flex: 1,
  },
  busBody: {
    paddingVertical: 16,
  },
  driverArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  driverSection: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  steeringWheel: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  driverLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  doorSection: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
  },
  doorLabel: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  backDoor: {
    alignSelf: 'center',
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    marginTop: 16,
  },
  seatRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
    // borderWidth: 1,
    // borderColor: '#E5E7EB',
    // borderStyle: 'solid',
  },
  rowNumber: {
    flex: 0,
    width: 20,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  seatPair: {
    flex:3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  aisle: {
    flex: 1,
    width: 32,
  },
  seat: {
    width: 38,
    height: 38,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  windowSeat: {
    // Styling specific to window seats
  },
  aisleSeat: {
    // Styling specific to aisle seats
  },
  middleSeat: {
    // Styling specific to middle seats
  },
  seatAvailable: {
    backgroundColor: '#E6F7FF',
    borderColor: '#91D5FF',
  },
  seatSelected: {
    backgroundColor: '#1890FF',
    borderColor: '#096DD9',
  },
  seatOccupied: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D9D9D9',
  },
  seatReserved: {
    backgroundColor: '#FFF7E6',
    borderColor: '#FFD591',
  },
  seatPriority: {
    backgroundColor: '#FFF1F0',
    borderColor: '#FFA39E',
  },
  seatText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#595959',
  },
  seatTextSelected: {
    color: 'white',
  },
  seatTextOccupied: {
    color: '#8C8C8C',
  },
  seatTextReserved: {
    color: '#D46B08',
  },
  seatTextPriority: {
    color: '#CF1322',
  },
  priorityIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  lastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  lastRowSeats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginLeft: 10,
  },
  selectedSeatsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectedSeatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  selectedSeatsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedSeatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedSeatNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#004CFF',
  },
  selectedSeatType: {
    fontSize: 12,
    color: '#4B5563',
  },
  removeSeatButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  continueContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  continueButton: {
    flex: 2,
    backgroundColor: '#004CFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
});