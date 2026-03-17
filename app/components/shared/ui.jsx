/**
 * shared/ui.jsx — Reusable design-system primitives for the builder's right panel.
 * v3 — Modern dropdowns, 360° gradient, image upload in BackgroundEditor, fixed ColorPick
 */
'use client';
import { useState, useRef, useEffect } from 'react';
import { T } from '../../constants/theme';

// ─────────────────────────────────────────────────────────────────────────────
// PropSec — collapsible panel section
// ─────────────────────────────────────────────────────────────────────────────
export function PropSec({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 0, borderBottom: `1px solid ${T.borderLight}`, paddingBottom: open ? 16 : 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '12px 0 8px', fontSize: 10, fontWeight: 800, color: T.textMid,
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}
      >
        {title}
        <span style={{ fontSize: 13, color: T.textLight, transition: 'transform 0.15s', display: 'inline-block', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
      </button>
      {open && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FL — field label
// ─────────────────────────────────────────────────────────────────────────────
export function FL({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: T.textLight, marginBottom: 4, letterSpacing: '0.02em' }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────────────────────────────────────
export function Divider() {
  return <div style={{ height: 1, background: T.borderLight, margin: '4px 0' }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// RInput — text/number input
// ─────────────────────────────────────────────────────────────────────────────
export function RInput({ val, set, placeholder, type = 'text', disabled, label }) {
  return (
    <div>
      {label && <FL>{label}</FL>}
      <input
        type={type}
        value={val ?? ''}
        onChange={e => set(type === 'number' ? +e.target.value : e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%', padding: '7px 10px', fontSize: 12, color: T.text,
          border: `1.5px solid ${T.border}`, borderRadius: 7, outline: 'none',
          background: disabled ? T.light : '#fff', boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = T.primary)}
        onBlur={e => (e.target.style.borderColor = T.border)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NumberInput — compact spinner with unit label
// Free typing: clamp/commit only on blur or Enter
// ─────────────────────────────────────────────────────────────────────────────
export function NumberInput({ label, val, set, min = 0, max = 9999, unit = 'px', step = 1 }) {
  const [localVal, setLocalVal] = useState(val == null || val === '' ? '' : String(val));
  const committed = useRef(val);

  // Sync local when val changes from outside (e.g. drag handle)
  useEffect(() => {
    const incoming = val == null || val === '' ? '' : String(val);
    if (String(committed.current) !== incoming) {
      setLocalVal(incoming);
      committed.current = val;
    }
  }, [val]);

  const commit = (raw) => {
    if (raw === '' || raw === '-') {
      // empty → clear / set to min
      committed.current = min;
      set(min);
      setLocalVal(String(min));
      return;
    }
    const n = parseFloat(raw);
    if (isNaN(n)) return;
    const clamped = Math.min(max, Math.max(min, n));
    committed.current = clamped;
    set(clamped);
    setLocalVal(String(clamped));
  };

  return (
    <div>
      {label && <FL>{label}</FL>}
      <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${T.border}`, borderRadius: 7, overflow: 'hidden', background: '#fff' }}>
        <input
          type="text"
          inputMode="numeric"
          value={localVal}
          onChange={e => {
            setLocalVal(e.target.value);
            const n = parseFloat(e.target.value);
            if (!isNaN(n) && e.target.value !== '' && e.target.value !== '-') {
              const clamped = Math.min(max, Math.max(min, n));
              committed.current = clamped;
              set(clamped);
            }
          }}
          onBlur={e => commit(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { commit(e.target.value); e.target.blur(); }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              const cur = parseFloat(localVal) || 0;
              commit(String(Math.min(max, cur + step)));
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              const cur = parseFloat(localVal) || 0;
              commit(String(Math.max(min, cur - step)));
            }
          }}
          onFocus={e => e.target.select()}
          style={{ flex: 1, padding: '7px 10px', fontSize: 12, color: T.text, border: 'none', outline: 'none', background: 'transparent', width: 0 }}
        />
        {unit && (
          <span style={{ padding: '0 8px', fontSize: 11, color: T.textLight, background: T.light, height: '100%', display: 'flex', alignItems: 'center', borderLeft: `1px solid ${T.border}` }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ColorPick — swatch + hex text input (single row, no double line)
// ─────────────────────────────────────────────────────────────────────────────
export function ColorPick({ label, val, set }) {
  return (
    <div>
      {label && <FL>{label}</FL>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 7, padding: '3px 3px 3px 6px', boxSizing: 'border-box' }}>
        {/* Color swatch */}
        <div style={{ position: 'relative', width: 26, height: 26, borderRadius: 5, overflow: 'hidden', border: `1px solid ${T.border}`, flexShrink: 0, cursor: 'pointer' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%,transparent 75%,#ccc 75%),linear-gradient(45deg,#ccc 25%,#fff 25%,#fff 75%,#ccc 75%)', backgroundSize: '8px 8px', backgroundPosition: '0 0,4px 4px' }} />
          <input
            type="color"
            value={val?.startsWith('#') ? val.slice(0,7) : '#ffffff'}
            onChange={e => set(e.target.value)}
            style={{ position: 'absolute', inset: -4, width: 'calc(100% + 8px)', height: 'calc(100% + 8px)', cursor: 'pointer', border: 'none', padding: 0, opacity: val ? 1 : 0.01 }}
          />
          {val && <div style={{ position: 'absolute', inset: 0, background: val, borderRadius: 4, pointerEvents: 'none' }} />}
        </div>
        {/* Hex/rgba text */}
        <input
          type="text"
          value={val || ''}
          onChange={e => set(e.target.value)}
          placeholder="#rrggbb or rgba(…)"
          style={{ flex: 1, padding: '4px 6px', fontSize: 12, color: T.text, border: 'none', outline: 'none', background: 'transparent', minWidth: 0 }}
        />
        {/* Clear button */}
        {val && (
          <button onClick={() => set('')} style={{ width: 20, height: 20, border: 'none', background: 'transparent', color: T.textLight, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, flexShrink: 0 }}>×</button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SliderInput — range + live numeric value (thin track style)
// ─────────────────────────────────────────────────────────────────────────────
export function SliderInput({ label, val, set, min = 0, max = 100, unit = '', step = 1 }) {
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.textLight }}>{label}</span>
          <span style={{ fontSize: 11, color: T.primary, fontWeight: 700, background: T.primaryLight, padding: '1px 6px', borderRadius: 4 }}>{val ?? min}{unit}</span>
        </div>
      )}
      <div style={{ position: 'relative', height: 16, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: T.borderLight, borderRadius: 2, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: 0, height: 2, borderRadius: 2,
          background: `linear-gradient(90deg, ${T.primary}, #8b5cf6)`,
          width: `${((val ?? min) - min) / (max - min) * 100}%`,
          pointerEvents: 'none',
        }} />
        <input
          type="range"
          min={min} max={max} step={step}
          value={val ?? min}
          onChange={e => set(+e.target.value)}
          style={{
            position: 'relative', width: '100%', margin: 0,
            WebkitAppearance: 'none', appearance: 'none',
            background: 'transparent', cursor: 'pointer', height: 16,
            accentColor: T.primary,
          }}
        />
      </div>
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 13px; height: 13px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid ${T.primary};
          box-shadow: 0 1px 4px rgba(99,102,241,0.25);
          cursor: pointer;
          transition: box-shadow 0.15s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
        }
        input[type=range]::-moz-range-thumb {
          width: 13px; height: 13px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid ${T.primary};
          box-shadow: 0 1px 4px rgba(99,102,241,0.25);
          cursor: pointer;
        }
        input[type=range]::-webkit-slider-runnable-track { background: transparent; }
        input[type=range]::-moz-range-track { background: transparent; height: 2px; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SegCtrl — segmented button control
// ─────────────────────────────────────────────────────────────────────────────
export function SegCtrl({ val, set, opts, label }) {
  return (
    <div>
      {label && <FL>{label}</FL>}
      <div style={{ display: 'flex', background: T.light, borderRadius: 8, padding: 3, gap: 2, border: `1px solid ${T.border}` }}>
        {opts.map(o => (
          <button
            key={o.v}
            onClick={() => set(o.v)}
            title={o.title || o.l}
            style={{
              flex: 1, padding: '5px 4px', fontSize: 11, fontWeight: 600, border: 'none',
              borderRadius: 6, cursor: 'pointer', transition: 'all 0.12s',
              background: val === o.v ? '#fff' : 'transparent',
              color: val === o.v ? T.primary : T.textLight,
              boxShadow: val === o.v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle — on/off switch
// ─────────────────────────────────────────────────────────────────────────────
export function Toggle({ val, set, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 32 }}>
      {label && <span style={{ fontSize: 12, color: T.textMid, fontWeight: 500 }}>{label}</span>}
      <button
        onClick={() => set(!val)}
        style={{
          width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
          background: val ? T.primary : '#cbd5e1',
          position: 'relative', transition: 'background 0.18s', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: val ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left 0.18s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SelectInput — Modern custom dropdown (replaces native <select>)
// ─────────────────────────────────────────────────────────────────────────────
export function SelectInput({ label, val, set, opts }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = opts.find(o => o.v === val) || opts[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {label && <FL>{label}</FL>}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '7px 10px', fontSize: 12, color: T.text,
          border: `1.5px solid ${open ? T.primary : T.border}`, borderRadius: 7,
          background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', textAlign: 'left', transition: 'border-color 0.15s',
          boxSizing: 'border-box',
        }}
      >
        <span>{current?.l || '—'}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path stroke={T.textLight} strokeWidth="1.5" d="M2 4l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 9999,
          background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden',
          maxHeight: 240, overflowY: 'auto',
        }}>
          {opts.map(o => (
            <button
              key={o.v}
              onMouseDown={e => { e.preventDefault(); set(o.v); setOpen(false); }}
              style={{
                width: '100%', padding: '8px 12px', fontSize: 12, textAlign: 'left',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                gap: 8, transition: 'background 0.1s',
                background: val === o.v ? `${T.primary}12` : 'transparent',
                color: val === o.v ? T.primary : T.text,
                fontWeight: val === o.v ? 600 : 400,
              }}
              onMouseEnter={e => { if (val !== o.v) e.currentTarget.style.background = T.light; }}
              onMouseLeave={e => { if (val !== o.v) e.currentTarget.style.background = 'transparent'; }}
            >
              {val === o.v && <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.primary, flexShrink: 0 }} />}
              {val !== o.v && <span style={{ width: 6 }} />}
              {o.l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SpacingBox — 4-sided padding/margin editor
// ─────────────────────────────────────────────────────────────────────────────
function SpacingField({ side, val, onChange, max }) {
  const [local, setLocal] = useState(val != null && val !== '' ? String(val) : '0');
  const prev = useRef(val);
  useEffect(() => {
    if (val !== prev.current) {
      setLocal(val != null && val !== '' ? String(val) : '0');
      prev.current = val;
    }
  }, [val]);
  const commit = (raw) => {
    const n = Math.max(0, Math.min(max, parseFloat(raw) || 0));
    prev.current = n;
    onChange(side, n);
    setLocal(String(n));
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <input
        type="text" inputMode="numeric" value={local}
        onChange={e => {
          setLocal(e.target.value);
          const n = parseFloat(e.target.value);
          if (!isNaN(n) && e.target.value !== '') {
            const clamped = Math.max(0, Math.min(max, n));
            prev.current = clamped;
            onChange(side, clamped);
          }
        }}
        onBlur={e => commit(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { commit(e.target.value); e.target.blur(); } }}
        onFocus={e => e.target.select()}
        style={{
          width: 48, textAlign: 'center', padding: '5px 4px', fontSize: 12,
          border: `1.5px solid ${T.border}`, borderRadius: 6, outline: 'none',
          background: '#fff', color: T.text,
        }}
        onMouseEnter={e => (e.target.style.borderColor = T.primary)}
        onMouseLeave={e => (e.target.style.borderColor = T.border)}
      />
      <span style={{ fontSize: 9, color: T.textLight, fontWeight: 600, textTransform: 'uppercase' }}>{side}</span>
    </div>
  );
}

export function SpacingBox({ label, top, right, bottom, left, setTop, setRight, setBottom, setLeft, unit = 'px', max = 200 }) {
  const [linked, setLinked] = useState(top === right && right === bottom && bottom === left);

  const handleChange = (side, n) => {
    if (linked) { setTop(n); setRight(n); setBottom(n); setLeft(n); }
    else {
      if (side === 'top')    setTop(n);
      if (side === 'right')  setRight(n);
      if (side === 'bottom') setBottom(n);
      if (side === 'left')   setLeft(n);
    }
  };

  return (
    <div>
      {label && <FL>{label}</FL>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gridTemplateRows: 'auto auto auto', gap: 4, alignItems: 'center', justifyItems: 'center' }}>
        <div /><SpacingField side="top"    val={top}    onChange={handleChange} max={max} /><div />
        <SpacingField side="left"  val={left}   onChange={handleChange} max={max} />
        <button
          onClick={() => setLinked(v => !v)}
          title={linked ? 'Unlink sides' : 'Link all sides'}
          style={{
            width: 22, height: 22, border: `1.5px solid ${linked ? T.primary : T.border}`,
            borderRadius: 5, background: linked ? `${T.primary}15` : '#fff',
            cursor: 'pointer', fontSize: 11, color: linked ? T.primary : T.textLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >⛓</button>
        <SpacingField side="right"  val={right}  onChange={handleChange} max={max} />
        <div /><SpacingField side="bottom" val={bottom} onChange={handleChange} max={max} /><div />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ImageUploadField — upload + URL paste for background images
// ─────────────────────────────────────────────────────────────────────────────
function ImageUploadField({ val, set }) {
  const fileRef = useRef();
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {val && (
        <div style={{ position: 'relative' }}>
          <img src={val} alt="bg" style={{ width: '100%', height: 72, objectFit: 'cover', borderRadius: 7, border: `1.5px solid ${T.border}`, display: 'block' }} />
          <button
            onClick={() => set('')}
            style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <button
          onClick={() => fileRef.current?.click()}
          style={{ padding: '7px 0', fontSize: 11, fontWeight: 600, border: `1.5px solid ${T.primary}`, borderRadius: 7, cursor: 'pointer', background: `${T.primary}12`, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 4l3-3 3 3M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Upload
        </button>
        <button
          onClick={() => { const url = prompt('Paste image URL:'); if (url) set(url); }}
          style={{ padding: '7px 0', fontSize: 11, fontWeight: 600, border: `1.5px solid ${T.border}`, borderRadius: 7, cursor: 'pointer', background: T.light, color: T.textMid, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        >
          🔗 URL
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      <RInput val={val || ''} set={set} placeholder="or paste image URL…" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GradientDirectionPicker — 360° wheel with smooth drag + degree input
// ─────────────────────────────────────────────────────────────────────────────
function GradientDirectionPicker({ val, set }) {
  const deg = parseInt(val) || 135;
  const isDragging = useRef(false);
  const svgRef = useRef(null);

  const calcAngle = (e, svgEl) => {
    const rect = svgEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const raw = Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI + 90;
    return ((Math.round(raw) % 360) + 360) % 360;
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    set(`${calcAngle(e, svgRef.current)}deg`);

    const onMove = (ev) => {
      if (!isDragging.current) return;
      set(`${calcAngle(ev, svgRef.current)}deg`);
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const presets = [
    { deg: 0, l: '↑' }, { deg: 45, l: '↗' }, { deg: 90, l: '→' }, { deg: 135, l: '↘' },
    { deg: 180, l: '↓' }, { deg: 225, l: '↙' }, { deg: 270, l: '←' }, { deg: 315, l: '↖' },
  ];

  const rad = (deg - 90) * Math.PI / 180;
  const CX = 22, CY = 22, R = 15;
  const dotX = CX + R * Math.cos(rad);
  const dotY = CY + R * Math.sin(rad);

  return (
    <div>
      <FL>Direction</FL>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Draggable wheel */}
        <svg
          ref={svgRef}
          width="44" height="44" viewBox="0 0 44 44"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'grab', flexShrink: 0, userSelect: 'none' }}
        >
          <defs>
            <linearGradient id="wheel-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={T.primary} />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {/* Outer ring */}
          <circle cx={CX} cy={CY} r="20" fill={`${T.primary}12`} stroke={`${T.primary}40`} strokeWidth="1.5" />
          {/* Tick marks */}
          {[0,45,90,135,180,225,270,315].map(t => {
            const tr = (t - 90) * Math.PI / 180;
            return (
              <line
                key={t}
                x1={CX + 16 * Math.cos(tr)} y1={CY + 16 * Math.sin(tr)}
                x2={CX + 19 * Math.cos(tr)} y2={CY + 19 * Math.sin(tr)}
                stroke={`${T.primary}50`} strokeWidth="1.5" strokeLinecap="round"
              />
            );
          })}
          {/* Direction line */}
          <line x1={CX} y1={CY} x2={dotX} y2={dotY} stroke={T.primary} strokeWidth="2" strokeLinecap="round" />
          {/* Dot handle */}
          <circle cx={dotX} cy={dotY} r="4" fill={T.primary} stroke="#fff" strokeWidth="1.5" />
          {/* Center */}
          <circle cx={CX} cy={CY} r="2.5" fill={T.primary} />
        </svg>

        {/* Degree number input */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${T.border}`, borderRadius: 7, overflow: 'hidden', background: '#fff' }}>
            <input
              type="number"
              min={0} max={359} step={1}
              value={deg}
              onChange={e => set(`${((+e.target.value % 360) + 360) % 360}deg`)}
              style={{ flex: 1, padding: '6px 8px', fontSize: 12, color: T.text, border: 'none', outline: 'none', background: 'transparent', width: 0 }}
            />
            <span style={{ padding: '0 8px', fontSize: 11, color: T.textLight, background: T.light, display: 'flex', alignItems: 'center', borderLeft: `1px solid ${T.border}`, height: '100%' }}>°</span>
          </div>
        </div>
      </div>

      {/* Quick preset buttons */}
      <div style={{ display: 'flex', gap: 3, marginTop: 6, flexWrap: 'wrap' }}>
        {presets.map(p => (
          <button
            key={p.deg}
            onClick={() => set(`${p.deg}deg`)}
            title={`${p.deg}°`}
            style={{
              width: 28, height: 28, fontSize: 12, border: `1.5px solid ${deg === p.deg ? T.primary : T.border}`,
              borderRadius: 6, cursor: 'pointer', background: deg === p.deg ? `${T.primary}15` : '#fff',
              color: deg === p.deg ? T.primary : T.textMid, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.1s',
            }}
          >
            {p.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BackgroundEditor — full bg section with upload + 360° gradient
// ─────────────────────────────────────────────────────────────────────────────
export function BackgroundEditor({ s, up }) {
  const handleBgTypeChange = (v) => {
    up('bgType', v);
    // Initialize gradient defaults so canvas immediately shows gradient
    if (v === 'gradient') {
      if (!s.gradientFrom) up('gradientFrom', '#6366f1');
      if (!s.gradientTo)   up('gradientTo',   '#8b5cf6');
      if (!s.gradientDir)  up('gradientDir',  '135deg');
    }
  };

  const fromColor = s.gradientFrom || '#6366f1';
  const toColor   = s.gradientTo   || '#8b5cf6';
  const gradDir   = s.gradientDir  || '135deg';

  return (
    <PropSec title="Background">
      <SegCtrl
        label="Type"
        val={s.bgType || 'color'}
        set={handleBgTypeChange}
        opts={[
          { v: 'color',    l: 'Solid' },
          { v: 'gradient', l: 'Gradient' },
          { v: 'image',    l: 'Image' },
          { v: 'none',     l: 'None' },
        ]}
      />

      {(!s.bgType || s.bgType === 'color') && (
        <ColorPick label="Color" val={s.bg || ''} set={v => up('bg', v)} />
      )}

      {s.bgType === 'gradient' && (
        <>
          {/* From / To row with equal columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignItems: 'start', minWidth: 0, overflow: 'hidden' }}>
            <div   style={{ minWidth: 0 }}>
              <FL>From</FL>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 7, padding: '3px 6px', boxSizing: 'border-box' }}>
                <div style={{ position: 'relative', width: 26, height: 26, borderRadius: 5, overflow: 'hidden', border: `1px solid ${T.border}`, flexShrink: 0 }}>
                  <input
                    type="color"
                    value={fromColor.startsWith('#') ? fromColor.slice(0,7) : '#6366f1'}
                    onChange={e => up('gradientFrom', e.target.value)}
                    style={{ position: 'absolute', inset: -4, width: 'calc(100%+8px)', height: 'calc(100%+8px)', cursor: 'pointer', border: 'none', padding: 0 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: fromColor, borderRadius: 4, pointerEvents: 'none' }} />
                </div>
                <input
                  type="text"
                  value={fromColor}
                  onChange={e => up('gradientFrom', e.target.value)}
                  style={{ flex: 1, padding: '4px 2px', fontSize: 11, color: T.text, border: 'none', outline: 'none', background: 'transparent', minWidth: 0 }}
                />
              </div>
            </div>
            <div  style={{ minWidth: 0 }}>
              <FL>To</FL>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 7, padding: '3px 6px', boxSizing: 'border-box' }}>
                <div style={{ position: 'relative', width: 26, height: 26, borderRadius: 5, overflow: 'hidden', border: `1px solid ${T.border}`, flexShrink: 0 }}>
                  <input
                    type="color"
                    value={toColor.startsWith('#') ? toColor.slice(0,7) : '#8b5cf6'}
                    onChange={e => up('gradientTo', e.target.value)}
                    style={{ position: 'absolute', inset: -4, width: 'calc(100%+8px)', height: 'calc(100%+8px)', cursor: 'pointer', border: 'none', padding: 0 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: toColor, borderRadius: 4, pointerEvents: 'none' }} />
                </div>
                <input
                  type="text"
                  value={toColor}
                  onChange={e => up('gradientTo', e.target.value)}
                  style={{ flex: 1, padding: '4px 2px', fontSize: 11, color: T.text, border: 'none', outline: 'none', background: 'transparent', minWidth: 0 }}
                />
              </div>
            </div>
          </div>
          {/* Live gradient preview */}
          <div style={{
            height: 32, borderRadius: 7, border: `1px solid ${T.border}`,
            background: `linear-gradient(${gradDir}, ${fromColor}, ${toColor})`,
            transition: 'background 0.2s ease',
          }} />
          <GradientDirectionPicker val={gradDir} set={v => up('gradientDir', v)} />
        </>
      )}

      {s.bgType === 'image' && (
        <>
          <ImageUploadField val={s.bgImage || ''} set={v => up('bgImage', v)} />
          <SegCtrl
            label="Fit"
            val={s.bgSize || 'cover'}
            set={v => up('bgSize', v)}
            opts={[{ v: 'cover', l: 'Cover' }, { v: 'contain', l: 'Contain' }, { v: 'auto', l: 'Original' }]}
          />
          <SegCtrl
            label="Position"
            val={s.bgPos || 'center'}
            set={v => up('bgPos', v)}
            opts={[{ v: 'top', l: '↑ Top' }, { v: 'center', l: '⊙ Ctr' }, { v: 'bottom', l: '↓ Bot' }]}
          />
        </>
      )}
    </PropSec>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BorderEditor — reusable border section
// ─────────────────────────────────────────────────────────────────────────────
export function BorderEditor({ s, up }) {
  const hasBorder = s.borderStyle && s.borderStyle !== 'none';
  return (
    <PropSec title="Border & Radius">
      <SegCtrl
        label="Border Style"
        val={s.borderStyle || 'none'}
        set={v => up('borderStyle', v)}
        opts={[
          { v: 'none',   l: 'None' },
          { v: 'solid',  l: 'Solid' },
          { v: 'dashed', l: 'Dashed' },
          { v: 'dotted', l: '·····' },
        ]}
      />
      {hasBorder && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <NumberInput label="Width" val={+(s.borderWidth ?? 1)} set={v => up('borderWidth', v)} min={1} max={12} unit="px" />
            <NumberInput label="Radius" val={+(s.radius ?? 0)} set={v => up('radius', v)} min={0} max={80} unit="px" />
          </div>
          <ColorPick label="Color" val={s.borderColor || '#e2e8f0'} set={v => up('borderColor', v)} />
        </>
      )}
      {!hasBorder && (
        <NumberInput label="Border Radius" val={+(s.radius ?? 0)} set={v => up('radius', v)} min={0} max={80} unit="px" />
      )}
    </PropSec>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ShadowEditor — shadow preset picker
// ─────────────────────────────────────────────────────────────────────────────
export function ShadowEditor({ s, up }) {
  return (
    <PropSec title="Shadow">
      <SegCtrl
        val={s.shadow || 'none'}
        set={v => up('shadow', v)}
        opts={[
          { v: 'none', l: 'None' },
          { v: 'sm',   l: 'SM' },
          { v: 'md',   l: 'MD' },
          { v: 'lg',   l: 'LG' },
          { v: 'xl',   l: 'XL' },
        ]}
      />
      {s.shadow && s.shadow !== 'none' && (
        <ColorPick label="Tint" val={s.shadowColor || ''} set={v => up('shadowColor', v)} />
      )}
    </PropSec>
  );
}
