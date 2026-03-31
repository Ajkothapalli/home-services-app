import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// TODO: import MapView, { Marker, Region } from 'react-native-maps';
// TODO: import { geocodeAddress, reverseGeocode } from '../../services/maps.service';

interface LocationPickerProps {
  initialCoords?: { lat: number; lng: number };
  onLocationSelected: (coords: { lat: number; lng: number }, address: string) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  initialCoords,
  onLocationSelected,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoords, setSelectedCoords] = useState(
    initialCoords ?? { lat: 28.6139, lng: 77.2090 }, // Default: New Delhi
  );
  const [address, setAddress] = useState('');

  const handleSearch = async () => {
    // TODO: Call MapsService.geocodeAddress(searchQuery)
    // TODO: Update selectedCoords and address with result
  };

  const handleMapPress = async (coords: { lat: number; lng: number }) => {
    setSelectedCoords(coords);
    // TODO: Call MapsService.reverseGeocode(coords) to get address string
    // TODO: setAddress(result.formattedAddress)
  };

  const handleConfirm = () => {
    if (!address) return;
    onLocationSelected(selectedCoords, address);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search address..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* TODO: Replace with <MapView> from react-native-maps */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.mapCoords}>
          {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
        </Text>
      </View>

      {address ? (
        <Text style={styles.selectedAddress}>{address}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.confirmButton, !address && styles.confirmDisabled]}
        onPress={handleConfirm}
        disabled={!address}
      >
        <Text style={styles.confirmText}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  searchInput: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#1A1A2E' },
  searchButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingHorizontal: 14, justifyContent: 'center' },
  searchButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  mapPlaceholder: { height: 240, backgroundColor: '#E5E7EB', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  mapText: { fontSize: 16, color: '#6C757D' },
  mapCoords: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  selectedAddress: { fontSize: 14, color: '#374151', paddingVertical: 8, paddingHorizontal: 4 },
  confirmButton: { backgroundColor: '#2563EB', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  confirmDisabled: { backgroundColor: '#93C5FD' },
  confirmText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});

export default LocationPicker;
