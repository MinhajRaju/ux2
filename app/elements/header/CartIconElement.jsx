'use client';
import { ShoppingCart } from 'lucide-react';
export default function CartIconElement({ props }) {
  const p = props || {};
  return (
    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}>
      <ShoppingCart size={p.size || 22} color={p.color || '#334155'} />
      {p.showCount && p.count > 0 && (
        <span style={{
          position: 'absolute', top: -6, right: -8,
          background: '#ef4444', color: '#fff',
          borderRadius: '50%', width: 16, height: 16,
          fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{p.count}</span>
      )}
    </div>
  );
}
