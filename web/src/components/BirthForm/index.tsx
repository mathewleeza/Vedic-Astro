import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChartStore } from '../../store/chartStore';
import { searchLocation, getAyanamsaList } from '../../api/client';
import type { ChartRequest } from '../../../../shared/types/chart';

interface LocationResult {
  display_name: string;
  latitude: number;
  longitude: number;
}

interface AyanamsaOption {
  id: string;
  label: string;
  description: string;
}

export default function BirthForm() {
  const navigate = useNavigate();
  const fetchAll = useChartStore((s) => s.fetchAll);
  const isLoading = useChartStore((s) => s.isLoading);
  const error = useChartStore((s) => s.error);

  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [ayanamsa, setAyanamsa] = useState('lahiri');
  const [houseSystem, setHouseSystem] = useState('whole_sign');
  const [ayanamsaOptions, setAyanamsaOptions] = useState<AyanamsaOption[]>([]);

  useEffect(() => {
    getAyanamsaList().then((res) => setAyanamsaOptions(res.data)).catch(() => {});
  }, []);

  const handleLocationSearch = async () => {
    if (!locationQuery) return;
    const res = await searchLocation(locationQuery);
    setLocationResults(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;
    const req: ChartRequest = {
      birth_date: birthDate,
      birth_time: birthTime,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      timezone: 'UTC',
      ayanamsa,
      house_system: houseSystem,
    };
    await fetchAll(req);
    navigate('/chart');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h2>Birth Details</h2>

      <label>
        Date of Birth
        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
      </label>

      <label>
        Time of Birth
        <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} required />
      </label>

      <label>
        Location
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Search city..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
          <button type="button" onClick={handleLocationSearch}>Search</button>
        </div>
        {locationResults.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #ccc' }}>
            {locationResults.map((r, i) => (
              <li
                key={i}
                style={{ padding: 8, cursor: 'pointer', background: selectedLocation === r ? '#eef' : '' }}
                onClick={() => { setSelectedLocation(r); setLocationResults([]); setLocationQuery(r.display_name); }}
              >
                {r.display_name}
              </li>
            ))}
          </ul>
        )}
      </label>

      <label>
        Ayanamsa
        <select value={ayanamsa} onChange={(e) => setAyanamsa(e.target.value)}>
          {ayanamsaOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
          {ayanamsaOptions.length === 0 && <option value="lahiri">Lahiri</option>}
        </select>
      </label>

      <label>
        House System
        <select value={houseSystem} onChange={(e) => setHouseSystem(e.target.value)}>
          <option value="whole_sign">Whole Sign</option>
          <option value="placidus">Placidus</option>
          <option value="equal">Equal</option>
        </select>
      </label>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={isLoading || !selectedLocation}>
        {isLoading ? 'Calculating...' : 'Calculate Chart'}
      </button>
    </form>
  );
}
