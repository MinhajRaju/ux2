'use client';
import { useState, useEffect } from 'react';

function parseTarget(p) {
  if (p.targetDate) {
    const d = new Date(p.targetDate);
    if (!isNaN(d)) return d;
  }
  // Default: 24h from now
  return new Date(Date.now() + 24 * 3600 * 1000);
}

function calcRemaining(target) {
  const diff = Math.max(0, target - Date.now());
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownTimerElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  const target = parseTarget(p);
  const [time, setTime] = useState(() => calcRemaining(target));

  useEffect(() => {
    if (mode === 'edit') return;
    const id = setInterval(() => setTime(calcRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target, mode]);

  const pad = n => String(n).padStart(2, '0');
  const units = p.showDays !== false
    ? [['days', 'Days'], ['hours', 'Hrs'], ['minutes', 'Min'], ['seconds', 'Sec']]
    : [['hours', 'Hrs'], ['minutes', 'Min'], ['seconds', 'Sec']];

  return (
    <div
      onClick={mode === 'edit' ? onSelect : undefined}
      style={{
        cursor: mode === 'edit' ? 'pointer' : 'default',
        outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        padding: (p.padV || 16) + 'px ' + (p.padH || 12) + 'px',
        background: p.bg || 'transparent',
        borderRadius: (p.borderRadius || 0) + 'px',
        textAlign: 'center',
      }}
    >
      {p.label && (
        <div style={{ fontSize: (p.labelSize || 14) + 'px', fontWeight: 600, color: p.labelColor || '#334155', marginBottom: 10 }}>
          {p.label}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: (p.gap || 10) + 'px', flexWrap: 'wrap' }}>
        {units.map(([key, label]) => (
          <div key={key} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            minWidth: (p.boxSize || 64) + 'px',
          }}>
            <div style={{
              background: p.boxBg || '#0f172a',
              color: p.numColor || '#fff',
              fontSize: (p.numSize || 28) + 'px',
              fontWeight: 700,
              borderRadius: (p.boxRadius || 8) + 'px',
              padding: '8px 12px',
              lineHeight: 1,
              minWidth: (p.boxSize || 64) + 'px',
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {pad(time[key])}
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: p.labelColor || '#64748b', marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
      {p.endText && time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0 && (
        <div style={{ marginTop: 10, fontSize: 14, color: p.endTextColor || '#ef4444', fontWeight: 600 }}>{p.endText}</div>
      )}
    </div>
  );
}
