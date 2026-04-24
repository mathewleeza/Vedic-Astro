import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { AnalysisResponse, Yoga } from '../../../shared/types/analysis';

interface Props {
  route: { params: { analysis: AnalysisResponse } };
  navigation: any;
}

function YogaCard({ yoga }: { yoga: Yoga }) {
  return (
    <View style={[styles.yogaCard, yoga.present ? styles.yogaPresent : styles.yogaAbsent]}>
      <View style={styles.yogaHeader}>
        <Text style={styles.yogaName}>{yoga.name}</Text>
        <Text style={yoga.present ? styles.yogaBadgePresent : styles.yogaBadgeAbsent}>
          {yoga.present ? '✓' : '✗'}
        </Text>
      </View>
      {yoga.present && <Text style={styles.yogaEffect}>{yoga.effect}</Text>}
      <Text style={styles.yogaCondition}>{yoga.conditions_met}</Text>
    </View>
  );
}

export default function AnalysisScreen({ route, navigation }: Props) {
  const { analysis } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vedic Analysis</Text>

      {/* Personality */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personality</Text>
        <Text style={styles.summary}>{analysis.personality.summary}</Text>
        {analysis.personality.sections.map((section) => (
          <View key={section.title} style={styles.subsection}>
            <Text style={styles.subsectionTitle}>{section.title}</Text>
            {section.findings.map((finding, i) => (
              <View key={i} style={styles.findingCard}>
                <Text style={styles.findingText}>{finding.text}</Text>
                <Text style={styles.findingAttr}>{finding.attributed_to.join(' · ')}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Current Dasha */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Timing</Text>
        <View style={styles.dashaCard}>
          <Text style={styles.dashaTitle}>
            {analysis.timing.current_dasha.mahadasha} / {analysis.timing.current_dasha.antardasha}
          </Text>
          <Text style={styles.dashaInterp}>{analysis.timing.current_dasha.interpretation}</Text>
          <Text style={styles.dashaDates}>
            {analysis.timing.current_dasha.start} → {analysis.timing.current_dasha.end}
          </Text>
        </View>
      </View>

      {/* Yogas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yogas</Text>
        {analysis.yogas.map((yoga) => (
          <YogaCard key={yoga.name} yoga={yoga} />
        ))}
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7ff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#334', marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#334', marginBottom: 8 },
  summary: { fontStyle: 'italic', color: '#667', marginBottom: 12, lineHeight: 20 },
  subsection: { marginBottom: 12 },
  subsectionTitle: { fontSize: 15, fontWeight: '600', color: '#445', marginBottom: 6 },
  findingCard: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: '#6b9fff' },
  findingText: { fontSize: 13, color: '#334', lineHeight: 18 },
  findingAttr: { fontSize: 11, color: '#88a', marginTop: 4 },
  dashaCard: { backgroundColor: '#fff8e8', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e8c' },
  dashaTitle: { fontSize: 16, fontWeight: 'bold', color: '#554' },
  dashaInterp: { fontSize: 13, color: '#665', marginTop: 6, lineHeight: 18 },
  dashaDates: { fontSize: 11, color: '#889', marginTop: 6 },
  yogaCard: { padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1 },
  yogaPresent: { backgroundColor: '#f0fff4', borderColor: '#6b9' },
  yogaAbsent: { backgroundColor: '#fafafa', borderColor: '#ccc' },
  yogaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  yogaName: { fontSize: 14, fontWeight: '600', color: '#334' },
  yogaBadgePresent: { fontSize: 16, color: 'green' },
  yogaBadgeAbsent: { fontSize: 16, color: '#aaa' },
  yogaEffect: { fontSize: 13, color: '#445', marginTop: 4 },
  yogaCondition: { fontSize: 11, color: '#889', marginTop: 4 },
  backBtn: { backgroundColor: '#334', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8, marginBottom: 40 },
  backBtnText: { color: 'white', fontWeight: 'bold' },
});
