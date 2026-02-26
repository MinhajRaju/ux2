'use client';
import { ImageIcon } from 'lucide-react';
export default function ImageElement({ props, mode }) {
  const p = props || {};
  if (!p.src) {
    return (
      <div style={{
        width: p.width || '100%', height: p.height === 'auto' ? 200 : (p.height || 200),
        background: '#f1f5f9', borderRadius: p.borderRadius || 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px dashed #cbd5e1', flexDirection: 'column', gap: 8,
      }}>
        <ImageIcon size={32} color="#94a3b8" />
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Add Image URL in properties</span>
      </div>
    );
  }
  return (
    <img
      src={p.src}
      alt={p.alt || ''}
      style={{
        width: p.width || '100%',
        height: p.height === 'auto' ? 'auto' : p.height,
        objectFit: p.objectFit || 'cover',
        borderRadius: (p.borderRadius || 8) + 'px',
        display: 'block',
      }}
    />
  );
}
