import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { DashaResponse, DashaEntry } from '../../../shared/types/chart';

interface Props {
  route: { params: { dasha: DashaResponse } };
  navigation: any;
}

export default function DashaScreen({ route, navigation }: Props) {
  const { dasha } = route.params;
  const [expanded, setExpanded] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vimshottari Dasha</Text>
      <Text style={styles.meta}>
        Moon Nakshatra: {dasha.moon_nakshatra} · Balance: {dasha.dasha_balance_at_birth.planet} ({dasha.dasha_balance_at_birth.years_remaining} yrs)
      </Text>

      {dasha.mahadashas.map((maha: DashaEntry) => {
        const isCurrent = maha.start <= today && today <= maha.end;
        const isExpanded = expanded === maha.planet;

        return (
          <View key={maha.planet + maha.start} style={[styles.mahaCard, isCurrent && styles.currentCard]}>
            <TouchableOpacity
              style={styles.mahaHeader}
              onPress={() => setExpanded(isExpanded ? null : maha.planet)}
            >
              <View>
                <Text style={[styles.mahaTitle, isCurrent && styles.currentTitle]}>
                  {isCurrent ? '▶ ' : ''}{maha.planet.charAt(0).toUpperCase() + maha.planet.slice(1)}
                </Text>
                <Text style={styles.mahaDate}>{maha.start} → {maha.end}</Text>
              </View>
              <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isExpanded && maha.antardashas && (
              <View style={styles.antarContainer}>
                {maha.antardashas.map((antar: DashaEntry) => {
                  const isCurrentAntar = antar.start <= today && today <= antar.end;
                  return (
                    <View
                      key={antar.planet + antar.start}
                      style={[styles.antarRow, isCurrentAntar && styles.currentAntar]}
                    >
                      <Text style={styles.antarPlanet}>
                        {antar.planet.charAt(0).toUpperCase() + antar.planet.slice(1)}
                      </Text>
                      <Text style={styles.antarDate}>{antar.start} → {antar.end}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7ff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#334', marginBottom: 4 },
  meta: { fontSize: 12, color: '#778', marginBottom: 16 },
  mahaCard: { backgroundColor: 'white', borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#dde', overflow: 'hidden' },
  currentCard: { borderColor: '#c44', borderWidth: 2 },
  mahaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  mahaTitle: { fontSize: 16, fontWeight: '600', color: '#334' },
  currentTitle: { color: '#c44' },
  mahaDate: { fontSize: 11, color: '#889', marginTop: 2 },
  expandIcon: { fontSize: 14, color: '#889' },
  antarContainer: { borderTopWidth: 1, borderColor: '#eef', paddingHorizontal: 14, paddingVertical: 8 },
  antarRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#f0f0f8' },
  currentAntar: { backgroundColor: '#fff0f0' },
  antarPlanet: { fontSize: 13, fontWeight: '500', color: '#445' },
  antarDate: { fontSize: 11, color: '#889' },
  backBtn: { backgroundColor: '#334', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8, marginBottom: 40 },
  backBtnText: { color: 'white', fontWeight: 'bold' },
});
