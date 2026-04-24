import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { ChartResponse } from '../../../shared/types/chart';

interface Props {
  route: { params: { chart: ChartResponse } };
  navigation: any;
}

export default function ChartScreen({ route, navigation }: Props) {
  const { chart } = route.params;
  const [tab, setTab] = useState<'d1' | 'd9'>('d1');
  const planets = tab === 'd1' ? chart.planets : chart.d9.planets;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vedic Chart</Text>
      <Text style={styles.meta}>
        Asc: {chart.ascendant.sign} {chart.ascendant.degree.toFixed(2)}° · {chart.ascendant.nakshatra} pada {chart.ascendant.pada}
      </Text>
      <Text style={styles.meta}>
        Ayanamsa: {chart.meta.ayanamsa} ({chart.meta.ayanamsa_value.toFixed(4)}°)
      </Text>

      <View style={styles.tabRow}>
        {(['d1', 'd9'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={tab === t ? styles.tabTextActive : styles.tabText}>
              {t === 'd1' ? 'D1 Rasi' : 'D9 Navamsa'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Planet table */}
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>Planet</Text>
          <Text style={[styles.cell, styles.headerCell]}>Sign</Text>
          <Text style={[styles.cell, styles.headerCell]}>°</Text>
          <Text style={[styles.cell, styles.headerCell]}>H</Text>
          <Text style={[styles.cell, styles.headerCell]}>Nak</Text>
          <Text style={[styles.cell, styles.headerCell]}>℞</Text>
        </View>
        {planets.map((p) => (
          <View key={p.id} style={[styles.row, p.is_retrograde && styles.retroRow]}>
            <Text style={styles.cell}>{p.name}</Text>
            <Text style={styles.cell}>{p.sign.slice(0, 3)}</Text>
            <Text style={styles.cell}>{p.degree.toFixed(1)}</Text>
            <Text style={styles.cell}>{p.house}</Text>
            <Text style={[styles.cell, { flex: 2 }]} numberOfLines={1}>{p.nakshatra}</Text>
            <Text style={styles.cell}>{p.is_retrograde ? '℞' : ''}</Text>
          </View>
        ))}
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Dasha', route.params)}>
          <Text style={styles.navBtnText}>Dasha →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Analysis', route.params)}>
          <Text style={styles.navBtnText}>Analysis →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7ff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#334', marginBottom: 4 },
  meta: { fontSize: 12, color: '#778', marginBottom: 2 },
  tabRow: { flexDirection: 'row', marginVertical: 12, gap: 8 },
  tab: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#eef', alignItems: 'center' },
  tabActive: { backgroundColor: '#6b9fff' },
  tabText: { color: '#445', fontWeight: '500' },
  tabTextActive: { color: 'white', fontWeight: 'bold' },
  table: { borderWidth: 1, borderColor: '#dde', borderRadius: 8, overflow: 'hidden' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eef' },
  headerRow: { backgroundColor: '#e8eeff' },
  retroRow: { backgroundColor: '#fff0f0' },
  cell: { flex: 1, padding: 8, fontSize: 12, color: '#334' },
  headerCell: { fontWeight: 'bold', color: '#445' },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 40 },
  navBtn: { flex: 1, backgroundColor: '#334', padding: 14, borderRadius: 10, alignItems: 'center' },
  navBtnText: { color: 'white', fontWeight: 'bold' },
});
