'use client';
import { Play } from 'lucide-react';
export default function VideoElement({ props, mode }) {
  const p = props || {};
  if (!p.src) {
    return (
      <div style={{
        width: p.width || '100%', height: 220,
        background: '#0f172a', borderRadius: p.borderRadius || 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 10,
      }}>
        <Play size={40} color="#475569" fill="#475569" />
        <span style={{ fontSize: 12, color: '#64748b' }}>Add video URL in properties</span>
      </div>
    );
  }
  return (
    <video
      src={p.src}
      poster={p.poster}
      controls={p.controls !== false}
      style={{ width: p.width || '100%', borderRadius: (p.borderRadius || 8) + 'px', display: 'block' }}
    />
  );
}
