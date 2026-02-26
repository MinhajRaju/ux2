'use client';
import { User } from 'lucide-react';
export default function AccountIconElement({ props }) {
  const p = props || {};
  return (
    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <User size={p.size || 22} color={p.color || '#334155'} />
    </div>
  );
}
