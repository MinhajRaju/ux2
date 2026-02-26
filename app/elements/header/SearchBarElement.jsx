'use client';
import { Search } from 'lucide-react';
export default function SearchBarElement({ props, mode }) {
  const p = props || {};
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: '#f1f5f9', borderRadius: p.borderRadius || 8,
      padding: '7px 14px', width: p.width || 220,
      border: '1.5px solid #e2e8f0',
    }}>
      <Search size={15} color="#94a3b8" />
      <span style={{ fontSize: 13, color: '#94a3b8' }}>{p.placeholder || 'Search...'}</span>
    </div>
  );
}
