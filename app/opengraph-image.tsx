import { ImageResponse } from 'next/og';

export const alt = 'Philant Technologies';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 96, background: '#12202e', color: '#e8eef2' }}>
        <div style={{ fontSize: 28, color: '#5cc3c9', letterSpacing: 2 }}>POWER PLATFORM · DATA · SOFTWARE</div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 24 }}>Philant Technologies</div>
        <div style={{ fontSize: 36, color: '#a9b8c4', marginTop: 24 }}>Patrick S. Mensah</div>
      </div>
    ),
    size,
  );
}
