import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChartStore } from '../store/chartStore';
import DashaTimeline from '../components/DashaTimeline';

export default function Dasha() {
  const navigate = useNavigate();
  const { dashaResponse, isLoading } = useChartStore();

  if (isLoading) return <p style={{ textAlign: 'center', padding: 40 }}>Calculating dashas…</p>;
  if (!dashaResponse) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p>No dasha data available.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>🔱 Vimshottari Dasha</h1>
      <p>
        <strong>Moon Nakshatra:</strong> {dashaResponse.moon_nakshatra} &nbsp;|&nbsp;
        <strong>Dasha at Birth:</strong> {dashaResponse.dasha_balance_at_birth.planet.charAt(0).toUpperCase() + dashaResponse.dasha_balance_at_birth.planet.slice(1)} ({dashaResponse.dasha_balance_at_birth.years_remaining} yrs remaining)
      </p>
      <DashaTimeline mahadashas={dashaResponse.mahadashas} />
      <button onClick={() => navigate('/chart')} style={{ marginTop: 16, padding: '6px 16px' }}>← Chart</button>
      <button onClick={() => navigate('/analysis')} style={{ marginLeft: 8, padding: '6px 16px' }}>→ Analysis</button>
    </div>
  );
}
