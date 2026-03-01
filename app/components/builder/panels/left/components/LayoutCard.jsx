'use client';
import { useState } from 'react';
import { Icons } from './Icons';

/**
 * Clickable card for layout items (Section, Row, etc.).
 * Props:
 *  icon         – emoji or JSX
 *  label        – card title
 *  description  – small subtitle
 *  onClick      – () => void
 *  accentColor  – hex string (default purple)
 */
export function LayoutCard({ icon, label, description, onClick, accentColor = '#8B5CF6' }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
        background: hover ? '#F5F3FF' : '#FFFFFF',
        border: hover ? `1.5px solid ${accentColor}` : '1px solid #E2E8F0',
        boxShadow: hover ? `0 4px 14px ${accentColor}22` : '0 1px 3px rgba(0,0,0,0.04)',
        transform: hover ? 'translateY(-1px)' : 'none',
        transition: 'all 0.2s ease-in-out',
        userSelect: 'none',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 38, height: 38, borderRadius: 9, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? `${accentColor}18` : '#F1F5F9',
        color: accentColor, fontSize: 18,
        transition: 'background 0.2s',
      }}>
        {icon}
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: hover ? '#3B0764' : '#334155', transition: 'color 0.15s' }}>
          {label}
        </span>
        {description && (
          <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>
            {description}
          </span>
        )}
      </div>

      {/* Plus badge */}
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? accentColor : '#E2E8F0',
        color: hover ? '#fff' : '#94A3B8',
        transition: 'all 0.2s',
      }}>
        <Icons.Plus />
      </div>
    </div>
  );
}
