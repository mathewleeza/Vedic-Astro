import type { AnalysisResponse, Yoga } from '../../../../shared/types/analysis';

interface Props {
  analysis: AnalysisResponse;
}

function YogaCard({ yoga }: { yoga: Yoga }) {
  return (
    <div style={{
      border: `1px solid ${yoga.present ? '#6b9' : '#ccc'}`,
      borderRadius: 6,
      padding: 12,
      marginBottom: 8,
      background: yoga.present ? '#f0fff4' : '#fafafa',
    }}>
      <strong>{yoga.name}</strong>
      <span style={{ marginLeft: 8, fontSize: 12, color: yoga.present ? 'green' : 'gray' }}>
        {yoga.present ? '✓ Present' : '✗ Absent'}
      </span>
      {yoga.present && <p style={{ margin: '4px 0', fontSize: 13 }}>{yoga.effect}</p>}
      <small style={{ color: '#888' }}>{yoga.conditions_met}</small>
    </div>
  );
}

export default function AnalysisReport({ analysis }: Props) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      {/* Personality */}
      <section>
        <h2>Personality Analysis</h2>
        <p style={{ fontStyle: 'italic', color: '#555' }}>{analysis.personality.summary}</p>
        {analysis.personality.sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 16 }}>
            <h3 style={{ color: '#334' }}>{section.title}</h3>
            {section.findings.map((finding, i) => (
              <div key={i} style={{ marginBottom: 8, padding: 8, background: '#f8f8ff', borderRadius: 4 }}>
                <p style={{ margin: 0 }}>{finding.text}</p>
                <small style={{ color: '#88a' }}>{finding.attributed_to.join(' · ')}</small>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Yogas */}
      <section>
        <h2>Yogas</h2>
        {analysis.yogas.map((yoga) => (
          <YogaCard key={yoga.name} yoga={yoga} />
        ))}
      </section>

      {/* Timing */}
      <section>
        <h2>Current Timing</h2>
        <div style={{ background: '#fff8e8', border: '1px solid #e8c', borderRadius: 6, padding: 12 }}>
          <h3>Current Dasha</h3>
          <p>
            <strong>Mahadasha:</strong> {analysis.timing.current_dasha.mahadasha} &nbsp;
            <strong>Antardasha:</strong> {analysis.timing.current_dasha.antardasha}
          </p>
          <p>{analysis.timing.current_dasha.interpretation}</p>
          <small>{analysis.timing.current_dasha.start} → {analysis.timing.current_dasha.end}</small>
        </div>
        {analysis.timing.upcoming_dashas.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <h3>Upcoming Periods</h3>
            {analysis.timing.upcoming_dashas.map((d: { planet: string; start: string; end: string }, i: number) => (
              <div key={i} style={{ padding: 8, background: '#f0f4ff', borderRadius: 4, marginBottom: 4 }}>
                <strong>{d.planet.charAt(0).toUpperCase() + d.planet.slice(1)}</strong>: {d.start} → {d.end}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
