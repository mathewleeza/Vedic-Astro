import React from 'react';
import BirthForm from '../components/BirthForm';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7ff', paddingTop: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, color: '#334' }}>🔱 Vedic Astro</h1>
        <p style={{ color: '#667', fontSize: 16 }}>
          Sidereal chart calculations powered by Swiss Ephemeris
        </p>
      </div>
      <BirthForm />
    </div>
  );
}
