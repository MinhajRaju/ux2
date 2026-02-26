'use client';
import { useState } from 'react';
import { T } from '../../constants/theme';

export function PropSec({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 16, borderBottom: `1px solid ${T.borderLight}`, paddingBottom: 16 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '0 0 8px 0', fontSize: 11, fontWeight: 800, color: T.textMid,
          textTransform: 'uppercase', letterSpacing: '0.07em',
        }}
      >
        {title}
        <span style={{ fontSize: 14, color: T.textLight }}>{open ? '▾' : '▸'}</span>
      </button>
      {open && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>}
    </div>
  );
}

export function FL({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: T.textLight, marginBottom: 4 }}>{children}</div>;
}

export function RInput({ val, set, placeholder, type = 'text', disabled }) {
  return (
    <input
      type={type}
      value={val ?? ''}
      onChange={e => set(type === 'number' ? +e.target.value : e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%', padding: '7px 10px', fontSize: 12, color: T.text,
        border: `1.5px solid ${T.border}`, borderRadius: 7, outline: 'none',
        background: '#fff', boxSizing: 'border-box',
        transition: 'border-color 0.2s',
      }}
      onFocus={e => (e.target.style.borderColor = T.primary)}
      onBlur={e => (e.target.style.borderColor = T.border)}
    />
  );
}

export function ColorPick({ label, val, set }) {
  return (
    <div>
      {label && <FL>{label}</FL>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative', width: 32, height: 32, borderRadius: 7, overflow: 'hidden', border: `1.5px solid ${T.border}`, flexShrink: 0 }}>
          <input type="color" value={val || '#ffffff'}
            onChange={e => set(e.target.value)}
            style={{ position: 'absolute', inset: -4, width: 'calc(100% + 8px)', height: 'calc(100% + 8px)', cursor: 'pointer', border: 'none', padding: 0 }} />
        </div>
        <RInput val={val || ''} set={set} placeholder="#ffffff" />
      </div>
    </div>
  );
}

export function SliderInput({ label, val, set, min = 0, max = 100, unit = '' }) {
  return (
    <div>
      {label && <FL>{label}</FL>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="range" min={min} max={max} value={val ?? min}
          onChange={e => set(+e.target.value)}
          style={{ flex: 1, accentColor: T.primary, cursor: 'pointer' }} />
        <span style={{ fontSize: 11, color: T.textMid, minWidth: 36, textAlign: 'right', fontWeight: 600 }}>
          {val ?? min}{unit}
        </span>
      </div>
    </div>
  );
}

export function SegCtrl({ val, set, opts }) {
  return (
    <div style={{ display: 'flex', background: T.light, borderRadius: 8, padding: 3, gap: 2 }}>
      {opts.map(o => (
        <button key={o.v}
          onClick={() => set(o.v)}
          style={{
            flex: 1, padding: '5px 6px', fontSize: 11, fontWeight: 600, border: 'none',
            borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
            background: val === o.v ? '#fff' : 'transparent',
            color: val === o.v ? T.primary : T.textLight,
            boxShadow: val === o.v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ val, set, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {label && <span style={{ fontSize: 12, color: T.textMid }}>{label}</span>}
      <button
        onClick={() => set(!val)}
        style={{
          width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
          background: val ? T.primary : '#cbd5e1',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: val ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

export function SelectInput({ label, val, set, opts }) {
  return (
    <div>
      {label && <FL>{label}</FL>}
      <select
        value={val ?? ''}
        onChange={e => set(e.target.value)}
        style={{
          width: '100%', padding: '7px 10px', fontSize: 12, color: T.text,
          border: `1.5px solid ${T.border}`, borderRadius: 7, outline: 'none',
          background: '#fff', cursor: 'pointer', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3E%3Cpath stroke='%2364748b' stroke-width='1.5' d='M4 6l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          backgroundSize: '16px',
        }}
      >
        {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}
