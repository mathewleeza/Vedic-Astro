import { useNavigate } from 'react-router-dom';
import { useChartStore } from '../store/chartStore';
import AnalysisReport from '../components/AnalysisReport';

export default function Analysis() {
  const navigate = useNavigate();
  const { analysisResponse, isLoading } = useChartStore();

  if (isLoading) return <p style={{ textAlign: 'center', padding: 40 }}>Generating analysis…</p>;
  if (!analysisResponse) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p>No analysis data available.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>🔱 Vedic Analysis</h1>
      <AnalysisReport analysis={analysisResponse} />
      <button onClick={() => navigate('/dasha')} style={{ marginTop: 16, padding: '6px 16px' }}>← Dasha</button>
    </div>
  );
}
