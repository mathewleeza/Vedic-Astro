import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { PlanetPosition } from '../../../../shared/types/chart';

interface Props {
  ascendant: { sign: string; sign_num: number; degree: number };
  planets: PlanetPosition[];
  houses: { house: number; sign: string; sign_num: number }[];
}

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const PLANET_GLYPHS: Record<string, string> = {
  sun: '☉', moon: '☽', mars: '♂', mercury: '☿', jupiter: '♃',
  venus: '♀', saturn: '♄', rahu: '☊', ketu: '☋',
};

export default function ChartWheel({ ascendant, planets, houses }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const size = 500;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = 220;
    const innerR = 150;
    const labelR = 190;

    const svg = d3.select(svgRef.current)
      .attr('width', size)
      .attr('height', size);

    svg.selectAll('*').remove();

    const ascSignNum = ascendant.sign_num;
    const startOffset = (ascSignNum - 1) * 30;

    // Draw 12 house segments
    for (let i = 0; i < 12; i++) {
      const houseSign = houses[i];
      const signIndex = (houseSign.sign_num - 1);
      const startAngle = (signIndex * 30 - startOffset - 90) * (Math.PI / 180);
      const endAngle = startAngle + 30 * (Math.PI / 180);

      const arc = d3.arc<unknown, unknown>()
        .innerRadius(innerR)
        .outerRadius(outerR)
        .startAngle(startAngle)
        .endAngle(endAngle);

      svg.append('path')
        .attr('d', arc as unknown as string)
        .attr('transform', `translate(${cx},${cy})`)
        .attr('fill', i % 2 === 0 ? '#f0f4ff' : '#e8f0ff')
        .attr('stroke', '#99a')
        .attr('stroke-width', 1);

      const midAngle = (startAngle + endAngle) / 2;
      svg.append('text')
        .attr('x', cx + labelR * Math.cos(midAngle))
        .attr('y', cy + labelR * Math.sin(midAngle))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', 10)
        .attr('fill', '#333')
        .text(SIGNS[signIndex].slice(0, 3));

      svg.append('text')
        .attr('x', cx + (innerR - 15) * Math.cos(midAngle))
        .attr('y', cy + (innerR - 15) * Math.sin(midAngle))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', 9)
        .attr('fill', '#666')
        .text(String(i + 1));
    }

    // Plot planets
    const planetsBySign: Record<number, PlanetPosition[]> = {};
    planets.forEach((p) => {
      if (!planetsBySign[p.sign_num]) planetsBySign[p.sign_num] = [];
      planetsBySign[p.sign_num].push(p);
    });

    planets.forEach((planet) => {
      const signIndex = planet.sign_num - 1;
      const signMidDeg = signIndex * 30 + planet.degree - startOffset;
      const angle = (signMidDeg - 90) * (Math.PI / 180);
      const r = (innerR + 30);

      svg.append('text')
        .attr('x', cx + r * Math.cos(angle))
        .attr('y', cy + r * Math.sin(angle))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', 13)
        .attr('fill', planet.is_retrograde ? '#c00' : '#004')
        .text(PLANET_GLYPHS[planet.id] || planet.id[0].toUpperCase());
    });

    // Center circle
    svg.append('circle')
      .attr('cx', cx).attr('cy', cy)
      .attr('r', innerR - 5)
      .attr('fill', 'white')
      .attr('stroke', '#99a')
      .attr('stroke-width', 1);

    svg.append('text')
      .attr('x', cx).attr('y', cy - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', '#444')
      .text('Asc: ' + ascendant.sign);

    svg.append('text')
      .attr('x', cx).attr('y', cy + 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', '#888')
      .text(ascendant.degree.toFixed(2) + '°');
  }, [ascendant, planets, houses]);

  return <svg ref={svgRef} />;
}
