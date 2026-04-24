import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChartStore } from '../store/chartStore';
import ChartWheel from '../components/ChartWheel';
import PlanetTable from '../components/PlanetTable';

export default function Chart() {
  const navigate = useNavigate();
  const { chartResponse, isLoading } = useChartStore();
  const [tab, setTab] = useState<'d1' | 'd9'>('d1');

  if (isLoading) return <p style={{ textAlign: 'center', padding: 40 }}>Calculating chart…</p>;
  if (!chartResponse) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p>No chart data available.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>🔱 Vedic Chart</h1>
      <p style={{ color: '#888', fontSize: 13 }}>
        Ayanamsa: {chartResponse.meta.ayanamsa} ({chartResponse.meta.ayanamsa_value.toFixed(4)}°) &nbsp;|&nbsp;
        House System: {chartResponse.meta.house_system}
      </p>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['d1', 'd9'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ padding: '6px 16px', fontWeight: tab === t ? 'bold' : 'normal', background: tab === t ? '#6b9fff' : '#eef', border: 'none', borderRadius: 4, cursor: 'pointer', color: tab === t ? 'white' : 'inherit' }}
          >
            {t === 'd1' ? 'D1 Chart (Rasi)' : 'D9 Chart (Navamsa)'}
          </button>
        ))}
        <button onClick={() => navigate('/dasha')} style={{ marginLeft: 'auto', padding: '6px 16px', background: '#e8f', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          → Dasha
        </button>
        <button onClick={() => navigate('/analysis')} style={{ padding: '6px 16px', background: '#8ef', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          → Analysis
        </button>
      </nav>

      {tab === 'd1' && (
        <>
          <ChartWheel
            ascendant={chartResponse.ascendant}
            planets={chartResponse.planets}
            houses={chartResponse.houses}
          />
          <PlanetTable planets={chartResponse.planets} title="D1 Planet Positions" />
        </>
      )}

      {tab === 'd9' && (
        <>
          <p><strong>D9 Ascendant:</strong> {chartResponse.d9.ascendant.sign} {chartResponse.d9.ascendant.degree.toFixed(2)}°</p>
          <PlanetTable planets={chartResponse.d9.planets} title="D9 Planet Positions" />
        </>
      )}
    </div>
  );
}
