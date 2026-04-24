import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ScrollView, Platform, Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { searchLocation, getAyanamsaList, calculateChart, calculateDasha, getAnalysis } from '../api/client';
import type { ChartRequest } from '../../../shared/types/chart';

interface LocationResult {
  display_name: string;
  latitude: number;
  longitude: number;
}

interface AyanamsaOption {
  id: string;
  label: string;
}

export default function HomeScreen({ navigation }: any) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [ayanamsa, setAyanamsa] = useState('lahiri');
  const [ayanamsaOptions, setAyanamsaOptions] = useState<AyanamsaOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAyanamsaList()
      .then((res) => setAyanamsaOptions(res.data))
      .catch(() => {});
  }, []);

  const handleLocationSearch = async () => {
    if (!locationQuery.trim()) return;
    try {
      const res = await searchLocation(locationQuery);
      setLocationResults(res.data);
    } catch {
      Alert.alert('Error', 'Location search failed');
    }
  };

  const handleSubmit = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location');
      return;
    }
    const birthDate = date.toISOString().split('T')[0];
    const birthTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    const req: ChartRequest = {
      birth_date: birthDate,
      birth_time: birthTime,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      timezone: 'UTC',
      ayanamsa,
      house_system: 'whole_sign',
    };
    setIsLoading(true);
    try {
      const [chartRes, dashaRes, analysisRes] = await Promise.all([
        calculateChart(req),
        calculateDasha(req),
        getAnalysis(req),
      ]);
      navigation.navigate('Chart', {
        chart: chartRes.data,
        dasha: dashaRes.data,
        analysis: analysisRes.data,
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to calculate chart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔱 Vedic Astro</Text>
      <Text style={styles.subtitle}>Sidereal Chart Calculator</Text>

      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(_, d) => { setShowDatePicker(false); if (d) setDate(d); }}
        />
      )}

      <Text style={styles.label}>Time of Birth</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
        <Text>{`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          onChange={(_, d) => { setShowTimePicker(false); if (d) setDate(d); }}
        />
      )}

      <Text style={styles.label}>Location</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Search city..."
          value={locationQuery}
          onChangeText={setLocationQuery}
        />
        <TouchableOpacity style={styles.button} onPress={handleLocationSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {locationResults.length > 0 && (
        <FlatList
          data={locationResults}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => {
                setSelectedLocation(item);
                setLocationQuery(item.display_name);
                setLocationResults([]);
              }}
            >
              <Text numberOfLines={2}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      {selectedLocation && (
        <Text style={styles.selected}>📍 {selectedLocation.display_name.slice(0, 60)}…</Text>
      )}

      <Text style={styles.label}>Ayanamsa</Text>
      <View style={styles.ayanamsaRow}>
        {(ayanamsaOptions.length > 0 ? ayanamsaOptions : [{ id: 'lahiri', label: 'Lahiri' }]).map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.chip, ayanamsa === opt.id && styles.chipSelected]}
            onPress={() => setAyanamsa(opt.id)}
          >
            <Text style={ayanamsa === opt.id ? styles.chipTextSelected : styles.chipText}>
              {opt.label.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, (!selectedLocation || isLoading) && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={!selectedLocation || isLoading}
      >
        <Text style={styles.submitText}>{isLoading ? 'Calculating…' : 'Calculate Chart'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f7ff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 20, color: '#334' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#778', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#445', marginTop: 16, marginBottom: 4 },
  input: { backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#dde' },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  button: { backgroundColor: '#6b9fff', padding: 12, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: '600' },
  resultItem: { padding: 12, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#eef' },
  selected: { marginTop: 4, fontSize: 12, color: '#557' },
  ayanamsaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { padding: 8, borderRadius: 16, borderWidth: 1, borderColor: '#99b', backgroundColor: 'white' },
  chipSelected: { backgroundColor: '#6b9fff', borderColor: '#6b9fff' },
  chipText: { fontSize: 12, color: '#334' },
  chipTextSelected: { fontSize: 12, color: 'white' },
  submitButton: { backgroundColor: '#334', padding: 16, borderRadius: 12, marginTop: 24, marginBottom: 40 },
  submitDisabled: { backgroundColor: '#aab' },
  submitText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});
