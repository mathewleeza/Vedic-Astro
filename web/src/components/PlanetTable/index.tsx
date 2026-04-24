import React from 'react';
import type { PlanetPosition } from '../../../../shared/types/chart';

interface Props {
  planets: PlanetPosition[];
  title?: string;
}

export default function PlanetTable({ planets, title }: Props) {
  return (
    <div>
      {title && <h3>{title}</h3>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e8eeff' }}>
            <th style={th}>Planet</th>
            <th style={th}>Sign</th>
            <th style={th}>Degree</th>
            <th style={th}>House</th>
            <th style={th}>Nakshatra</th>
            <th style={th}>Pada</th>
            <th style={th}>Retro</th>
          </tr>
        </thead>
        <tbody>
          {planets.map((p) => (
            <tr key={p.id} style={{ background: p.is_retrograde ? '#fff0f0' : 'white' }}>
              <td style={td}>{p.name}</td>
              <td style={td}>{p.sign}</td>
              <td style={td}>{p.degree.toFixed(2)}°</td>
              <td style={td}>{p.house}</td>
              <td style={td}>{p.nakshatra}</td>
              <td style={td}>{p.pada}</td>
              <td style={td}>{p.is_retrograde ? '℞' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #ccd' };
const td: React.CSSProperties = { padding: '6px 12px', borderBottom: '1px solid #eef' };
