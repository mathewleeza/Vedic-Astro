import { useState } from 'react';
import type { DashaEntry } from '../../../../shared/types/chart';

interface Props {
  mahadashas: DashaEntry[];
}

function dateToYear(dateStr: string): number {
  return new Date(dateStr).getFullYear() + new Date(dateStr).getMonth() / 12;
}

export default function DashaTimeline({ mahadashas }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

  const allStart = dateToYear(mahadashas[0]?.start ?? today);
  const allEnd = dateToYear(mahadashas[mahadashas.length - 1]?.end ?? today);
  const totalSpan = allEnd - allStart;

  return (
    <div style={{ padding: 16 }}>
      <h3>Vimshottari Dasha Timeline</h3>
      {mahadashas.map((maha) => {
        const isCurrent = maha.start <= today && today <= maha.end;
        const left = ((dateToYear(maha.start) - allStart) / totalSpan) * 100;
        const width = ((dateToYear(maha.end) - dateToYear(maha.start)) / totalSpan) * 100;

        return (
          <div key={maha.planet} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 80, fontWeight: isCurrent ? 'bold' : 'normal', color: isCurrent ? '#c00' : '#333' }}>
                {maha.planet.charAt(0).toUpperCase() + maha.planet.slice(1)}
              </span>
              <div style={{ flex: 1, height: 24, background: '#eef', borderRadius: 4, position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    width: `${width}%`,
                    height: '100%',
                    background: isCurrent ? '#ff6b6b' : '#6b9fff',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 4,
                    fontSize: 10,
                    color: 'white',
                    overflow: 'hidden',
                  }}
                >
                  {maha.start.slice(0, 4)}–{maha.end.slice(0, 4)}
                </div>
              </div>
              <button
                onClick={() => setExpanded(expanded === maha.planet ? null : maha.planet)}
                style={{ fontSize: 11, padding: '2px 6px' }}
              >
                {expanded === maha.planet ? '▲' : '▼'}
              </button>
            </div>
            {expanded === maha.planet && maha.antardashas && (
              <div style={{ marginLeft: 88, marginTop: 4 }}>
                {maha.antardashas.map((antar) => {
                  const isCurrentAntar = antar.start <= today && today <= antar.end;
                  return (
                    <div key={antar.planet} style={{
                      padding: '2px 8px',
                      background: isCurrentAntar ? '#fff0f0' : '#f8f8ff',
                      borderLeft: isCurrentAntar ? '3px solid #c00' : '3px solid #ccd',
                      marginBottom: 2,
                      fontSize: 12,
                    }}>
                      <strong>{antar.planet.charAt(0).toUpperCase() + antar.planet.slice(1)}</strong>: {antar.start} → {antar.end}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
