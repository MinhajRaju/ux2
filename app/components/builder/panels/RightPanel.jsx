// src/components/builder/panels/RightPanel.jsx
'use client';
import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { T } from '@/constants/theme';
import { useBuilderStore } from '@/store/builderStore';
import { getElementType } from '@/core/blockRegistry';

// ── Mini UI components ─────────────────────────────────────────
function Label({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>{children}</div>;
}

function RInput({ val, set, type = 'text', placeholder = '' }) {
  return (
    <input
      type={type}
      value={val ?? ''}
      onChange={e => set(type === 'number' ? +e.target.value : e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '7px 10px', border: `1px solid ${T.border}`,
        borderRadius: 7, fontSize: 12, color: '#334155',
        background: '#fff', outline: 'none', boxSizing: 'border-box',
      }}
    />
  );
}

function ColorPick({ label, val, set }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <Label>{label}</Label>}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          value={val || '#ffffff'}
          onChange={e => set(e.target.value)}
          style={{ width: 36, height: 36, border: `1px solid ${T.border}`, borderRadius: 7, cursor: 'pointer', padding: 2 }}
        />
        <input
          type="text"
          value={val || ''}
          onChange={e => set(e.target.value)}
          placeholder="#000000"
          style={{ flex: 1, padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 7, fontSize: 12, color: '#334155' }}
        />
      </div>
    </div>
  );
}

function SliderInput({ label, val, set, min = 0, max = 100, unit = '' }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <Label>{label}</Label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="range"
          min={min} max={max}
          value={val ?? min}
          onChange={e => set(+e.target.value)}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: 12, color: '#64748b', minWidth: 36, textAlign: 'right' }}>
          {val ?? min}{unit}
        </span>
      </div>
    </div>
  );
}

function SegCtrl({ val, set, opts }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
      {opts.map(o => (
        <button key={o.v} onClick={() => set(o.v)} style={{
          padding: '5px 10px', border: `1px solid ${val === o.v ? T.primary : T.border}`,
          borderRadius: 6, fontSize: 11, fontWeight: 600,
          background: val === o.v ? T.primarySoft : '#fff',
          color: val === o.v ? T.primary : '#64748b',
          cursor: 'pointer', transition: 'all 0.15s',
        }}>{o.l}</button>
      ))}
    </div>
  );
}

function PropSec({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 4, borderBottom: `1px solid ${T.border}` }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 0 8px', cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '.06em' }}>{title}</span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{open ? '▾' : '▸'}</span>
      </div>
      {open && <div style={{ paddingBottom: 12 }}>{children}</div>}
    </div>
  );
}

// ── Element Panels ─────────────────────────────────────────────
function HeadingPanel({ el, onChange }) {
  const p = el.props;
  return (
    <div>
      <PropSec title="Content">
        <Label>Text</Label>
        <textarea
          value={p.content || ''}
          onChange={e => onChange({ content: e.target.value })}
          rows={3}
          style={{ width: '100%', padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 7, fontSize: 12, resize: 'vertical', boxSizing: 'border-box' }}
        />
      </PropSec>
      <PropSec title="Typography">
        <SliderInput label="Font Size" val={p.fontSize || 32} set={v => onChange({ fontSize: v })} min={10} max={80} unit="px" />
        <Label>Font Weight</Label>
        <SegCtrl val={String(p.fontWeight || '700')} set={v => onChange({ fontWeight: v })}
          opts={[{ v: '400', l: 'Normal' }, { v: '600', l: 'Semi' }, { v: '700', l: 'Bold' }, { v: '900', l: 'Black' }]} />
        <ColorPick label="Color" val={p.color} set={v => onChange({ color: v })} />
        <Label>Align</Label>
        <SegCtrl val={p.textAlign || 'left'} set={v => onChange({ textAlign: v })}
          opts={[{ v: 'left', l: '←' }, { v: 'center', l: '↔' }, { v: 'right', l: '→' }]} />
      </PropSec>
      <PropSec title="Spacing">
        <SliderInput label="Pad Top" val={p.padTop || 0} set={v => onChange({ padTop: v })} min={0} max={80} unit="px" />
        <SliderInput label="Pad Bottom" val={p.padBottom || 0} set={v => onChange({ padBottom: v })} min={0} max={80} unit="px" />
      </PropSec>
    </div>
  );
}

function TextPanel({ el, onChange }) {
  const p = el.props;
  return (
    <div>
      <PropSec title="Content">
        <Label>Text</Label>
        <textarea value={p.content || ''} onChange={e => onChange({ content: e.target.value })} rows={5}
          style={{ width: '100%', padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 7, fontSize: 12, resize: 'vertical', boxSizing: 'border-box' }} />
      </PropSec>
      <PropSec title="Typography">
        <SliderInput label="Font Size" val={p.fontSize || 16} set={v => onChange({ fontSize: v })} min={10} max={48} unit="px" />
        <ColorPick label="Color" val={p.color} set={v => onChange({ color: v })} />
        <Label>Align</Label>
        <SegCtrl val={p.textAlign || 'left'} set={v => onChange({ textAlign: v })}
          opts={[{ v: 'left', l: '←' }, { v: 'center', l: '↔' }, { v: 'right', l: '→' }]} />
        <SliderInput label="Line Height" val={p.lineHeight || 1.7} set={v => onChange({ lineHeight: v })} min={1} max={3} unit="×" />
      </PropSec>
    </div>
  );
}

function ImagePanel({ el, onChange }) {
  const p = el.props;
  return (
    <div>
      <PropSec title="Image">
        <Label>URL</Label>
        <RInput val={p.src} set={v => onChange({ src: v })} placeholder="https://..." />
        <Label>Alt Text</Label>
        <RInput val={p.alt} set={v => onChange({ alt: v })} placeholder="Image description" />
      </PropSec>
      <PropSec title="Size">
        <Label>Width</Label>
        <RInput val={p.width} set={v => onChange({ width: v })} placeholder="100%" />
        <SliderInput label="Border Radius" val={p.borderRadius || 0} set={v => onChange({ borderRadius: v })} min={0} max={40} unit="px" />
        <Label>Object Fit</Label>
        <SegCtrl val={p.objectFit || 'cover'} set={v => onChange({ objectFit: v })}
          opts={[{ v: 'cover', l: 'Cover' }, { v: 'contain', l: 'Contain' }, { v: 'fill', l: 'Fill' }]} />
      </PropSec>
    </div>
  );
}

function ButtonPanel({ el, onChange }) {
  const p = el.props;
  return (
    <div>
      <PropSec title="Button">
        <Label>Label</Label>
        <RInput val={p.label} set={v => onChange({ label: v })} placeholder="Click Here" />
        <Label>Link (href)</Label>
        <RInput val={p.href} set={v => onChange({ href: v })} placeholder="#" />
      </PropSec>
      <PropSec title="Style">
        <ColorPick label="Background" val={p.bg} set={v => onChange({ bg: v })} />
        <ColorPick label="Text Color" val={p.color} set={v => onChange({ color: v })} />
        <SliderInput label="Font Size" val={p.fontSize || 14} set={v => onChange({ fontSize: v })} min={10} max={24} unit="px" />
        <SliderInput label="Border Radius" val={p.borderRadius || 8} set={v => onChange({ borderRadius: v })} min={0} max={40} unit="px" />
      </PropSec>
      <PropSec title="Padding">
        <SliderInput label="Top/Bottom" val={p.padTop || 12} set={v => onChange({ padTop: v, padBottom: v })} min={0} max={40} unit="px" />
        <SliderInput label="Left/Right" val={p.padLeft || 24} set={v => onChange({ padLeft: v, padRight: v })} min={0} max={60} unit="px" />
      </PropSec>
    </div>
  );
}

function LogoPanel({ el, onChange }) {
  const p = el.props;
  return (
    <div>
      <PropSec title="Logo">
        <Label>Logo Image URL (optional)</Label>
        <RInput val={p.src} set={v => onChange({ src: v })} placeholder="https://..." />
        <Label>Text (if no image)</Label>
        <RInput val={p.text} set={v => onChange({ text: v })} placeholder="Logo" />
      </PropSec>
      <PropSec title="Style">
        {!p.src && (
          <>
            <SliderInput label="Font Size" val={p.fontSize || 20} set={v => onChange({ fontSize: v })} min={12} max={48} unit="px" />
            <ColorPick label="Color" val={p.color} set={v => onChange({ color: v })} />
          </>
        )}
        {p.src && <SliderInput label="Width" val={p.width || 120} set={v => onChange({ width: v })} min={40} max={300} unit="px" />}
      </PropSec>
    </div>
  );
}

function MenuPanel({ el, onChange }) {
  const p = el.props;
  const items = p.items || [];
  return (
    <div>
      <PropSec title="Menu Items">
        {items.map((item, i) => (
          <div key={item.id} style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
            <input value={item.label} onChange={e => {
              const next = [...items]; next[i] = { ...next[i], label: e.target.value };
              onChange({ items: next });
            }} placeholder="Label" style={{ flex: 1, padding: '6px 8px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 11 }} />
            <input value={item.href} onChange={e => {
              const next = [...items]; next[i] = { ...next[i], href: e.target.value };
              onChange({ items: next });
            }} placeholder="href" style={{ flex: 1, padding: '6px 8px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 11 }} />
            <button onClick={() => onChange({ items: items.filter((_, j) => j !== i) })}
              style={{ border: 'none', background: '#fee2e2', color: '#ef4444', borderRadius: 5, width: 24, height: 24, cursor: 'pointer', fontSize: 12 }}>×</button>
          </div>
        ))}
        <button onClick={() => onChange({ items: [...items, { id: String(Date.now()), label: 'Item', href: '#' }] })}
          style={{ width: '100%', padding: '7px', border: `1px dashed ${T.border}`, borderRadius: 7, background: T.light, color: T.primary, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
          + Add Item
        </button>
      </PropSec>
      <PropSec title="Style">
        <SliderInput label="Font Size" val={p.fontSize || 14} set={v => onChange({ fontSize: v })} min={10} max={24} unit="px" />
        <ColorPick label="Color" val={p.color} set={v => onChange({ color: v })} />
        <SliderInput label="Gap" val={p.gap || 24} set={v => onChange({ gap: v })} min={4} max={60} unit="px" />
      </PropSec>
    </div>
  );
}

function DividerPanel({ el, onChange }) {
  const p = el.props;
  return (
    <div>
      <PropSec title="Divider">
        <ColorPick label="Color" val={p.color} set={v => onChange({ color: v })} />
        <SliderInput label="Thickness" val={p.height || 1} set={v => onChange({ height: v })} min={1} max={10} unit="px" />
        <Label>Style</Label>
        <SegCtrl val={p.style || 'solid'} set={v => onChange({ style: v })}
          opts={[{ v: 'solid', l: 'Solid' }, { v: 'dashed', l: 'Dashed' }, { v: 'dotted', l: 'Dotted' }]} />
      </PropSec>
    </div>
  );
}

function HtmlPanel({ el, onChange }) {
  const p = el.props;
  return (
    <div>
      <PropSec title="Custom HTML">
        <Label>HTML Code</Label>
        <textarea value={p.code || ''} onChange={e => onChange({ code: e.target.value })} rows={8}
          style={{ width: '100%', padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: 7, fontFamily: 'monospace', fontSize: 11, resize: 'vertical', boxSizing: 'border-box' }} />
      </PropSec>
    </div>
  );
}

function IconPanel({ el, onChange }) {
  const p = el.props;
  return (
    <div>
      <PropSec title="Style">
        <ColorPick label="Color" val={p.color} set={v => onChange({ color: v })} />
        <SliderInput label="Size" val={p.size || 22} set={v => onChange({ size: v })} min={12} max={48} unit="px" />
      </PropSec>
    </div>
  );
}

const ELEMENT_PANELS = {
  heading:        HeadingPanel,
  text:           TextPanel,
  image:          ImagePanel,
  button:         ButtonPanel,
  logo:           LogoPanel,
  menu:           MenuPanel,
  divider:        DividerPanel,
  html:           HtmlPanel,
  'cart-icon':    IconPanel,
  'wishlist-icon':IconPanel,
  'user-icon':    IconPanel,
  'search-bar':   IconPanel,
  categories:     IconPanel,
};

// ── Row Settings Panel ─────────────────────────────────────────
function RowSettingsPanel({ rowId, sections }) {
  const { updateRow } = useBuilderStore();
  let row = null;
  let secId = null;
  for (const sec of sections) {
    const r = sec.rows?.find(r => r.id === rowId);
    if (r) { row = r; secId = sec.id; break; }
  }
  if (!row) return null;
  const s = row.settings || {};
  const up = patch => updateRow(secId, rowId, patch);

  return (
    <div>
      <PropSec title="Label">
        <RInput val={s.label || ''} set={v => up({ label: v })} placeholder="Row name" />
      </PropSec>
      <PropSec title="Background">
        <Label>Type</Label>
        <SegCtrl val={s.bgType || 'color'} set={v => up({ bgType: v })}
          opts={[{ v: 'color', l: 'Color' }, { v: 'gradient', l: 'Gradient' }, { v: 'image', l: 'Image' }]} />
        {(!s.bgType || s.bgType === 'color') && <ColorPick label="Color" val={s.bg || '#ffffff'} set={v => up({ bg: v })} />}
        {s.bgType === 'gradient' && (
          <>
            <ColorPick label="From" val={s.gradientFrom || '#6366f1'} set={v => up({ gradientFrom: v })} />
            <ColorPick label="To" val={s.gradientTo || '#a855f7'} set={v => up({ gradientTo: v })} />
          </>
        )}
        {s.bgType === 'image' && (
          <>
            <Label>Image URL</Label>
            <RInput val={s.bgImage || ''} set={v => up({ bgImage: v })} placeholder="https://..." />
          </>
        )}
      </PropSec>
      <PropSec title="Layout">
        <Label>Width Mode</Label>
        <SegCtrl val={s.widthMode || 'boxed'} set={v => up({ widthMode: v })}
          opts={[{ v: 'boxed', l: 'Boxed' }, { v: 'full', l: 'Full' }]} />
        <SliderInput label="Max Width" val={s.maxWidth || 1280} set={v => up({ maxWidth: v })} min={600} max={2000} unit="px" />
        <SliderInput label="Pad H" val={s.padH || 32} set={v => up({ padH: v })} min={0} max={120} unit="px" />
        <SliderInput label="Pad V" val={s.padV || 16} set={v => up({ padV: v })} min={0} max={120} unit="px" />
        <SliderInput label="Col Gap" val={s.colGap || 20} set={v => up({ colGap: v })} min={0} max={80} unit="px" />
      </PropSec>
      <PropSec title="Visibility">
        <Label>Visible</Label>
        <SegCtrl val={String(s.visible !== false)} set={v => up({ visible: v === 'true' })}
          opts={[{ v: 'true', l: 'Show' }, { v: 'false', l: 'Hide' }]} />
      </PropSec>
    </div>
  );
}

// ── Section Settings Panel ─────────────────────────────────────
function SectionSettingsPanel({ secId, sections }) {
  const { updateSection } = useBuilderStore();
  const sec = sections.find(s => s.id === secId);
  if (!sec) return null;
  const s = sec.settings || {};
  const up = patch => updateSection(secId, patch);

  return (
    <div>
      <PropSec title="Label">
        <RInput val={s.label || ''} set={v => up({ label: v })} placeholder="Section name" />
      </PropSec>
      <PropSec title="Background">
        <Label>Type</Label>
        <SegCtrl val={s.bgType || 'color'} set={v => up({ bgType: v })}
          opts={[{ v: 'color', l: 'Color' }, { v: 'gradient', l: 'Gradient' }, { v: 'image', l: 'Image' }]} />
        {(!s.bgType || s.bgType === 'color') && <ColorPick label="Color" val={s.bg || '#ffffff'} set={v => up({ bg: v })} />}
        {s.bgType === 'gradient' && (
          <>
            <ColorPick label="From" val={s.gradientFrom || '#6366f1'} set={v => up({ gradientFrom: v })} />
            <ColorPick label="To" val={s.gradientTo || '#a855f7'} set={v => up({ gradientTo: v })} />
          </>
        )}
        {s.bgType === 'image' && (
          <>
            <Label>Image URL</Label>
            <RInput val={s.bgImage || ''} set={v => up({ bgImage: v })} placeholder="https://..." />
            <ColorPick label="Overlay" val={s.bgOverlay || ''} set={v => up({ bgOverlay: v })} />
            <SliderInput label="Overlay Opacity" val={s.bgOverlayOpacity ?? 40} set={v => up({ bgOverlayOpacity: v })} min={0} max={100} unit="%" />
          </>
        )}
      </PropSec>
      <PropSec title="Spacing">
        <SliderInput label="Pad Top" val={s.padTop || 0} set={v => up({ padTop: v })} min={0} max={200} unit="px" />
        <SliderInput label="Pad Bottom" val={s.padBottom || 0} set={v => up({ padBottom: v })} min={0} max={200} unit="px" />
      </PropSec>
    </div>
  );
}

// ── Col Settings Panel ─────────────────────────────────────────
function ColSettingsPanel({ colId, sections }) {
  const { updateCol } = useBuilderStore();

  let col = null;
  let secId = null;
  let rowId = null;

  for (const sec of sections) {
    for (const row of (sec.rows || [])) {
      const c = row.columns?.find(c => c.id === colId);
      if (c) { col = c; secId = sec.id; rowId = row.id; break; }
    }
    if (col) break;
  }

  if (!col) return null;
  const s = col.settings || {};
  const up = patch => updateCol(secId, rowId, colId, patch);

  return (
    <div>
      <PropSec title="Background">
        <ColorPick label="Color" val={s.bg || ''} set={v => up({ bg: v })} />
      </PropSec>
      <PropSec title="Spacing">
        <SliderInput label="Pad H" val={s.padH || 12} set={v => up({ padH: v })} min={0} max={80} unit="px" />
        <SliderInput label="Pad V" val={s.padV || 8} set={v => up({ padV: v })} min={0} max={80} unit="px" />
        <SliderInput label="Element Gap" val={s.gap || 12} set={v => up({ gap: v })} min={0} max={40} unit="px" />
      </PropSec>
      <PropSec title="Alignment">
        <Label>Vertical Align</Label>
        <SegCtrl val={s.valign || 'center'} set={v => up({ valign: v })}
          opts={[{ v: 'top', l: 'Top' }, { v: 'center', l: 'Mid' }, { v: 'bottom', l: 'Bottom' }]} />
        <Label>Horizontal Align</Label>
        <SegCtrl val={s.align || 'flex-start'} set={v => up({ align: v })}
          opts={[{ v: 'flex-start', l: 'Start' }, { v: 'center', l: 'Center' }, { v: 'flex-end', l: 'End' }]} />
      </PropSec>
    </div>
  );
}

// ── MAIN EXPORT ────────────────────────────────────────────────
export function RightPanel() {
  const { selectedId, selectedMode, selectedMeta, sections, deselect, updateElement, deleteElement } = useBuilderStore();

  if (!selectedId || !selectedMode) return null;

  // Find selected element
  let elemData = null;
  if (selectedMode === 'element') {
    for (const sec of sections) {
      for (const row of (sec.rows || [])) {
        for (const col of (row.columns || [])) {
          const el = col.elements?.find(e => e.id === selectedId);
          if (el) { elemData = { el, secId: sec.id, rowId: row.id, colId: col.id }; break; }
        }
        if (elemData) break;
      }
      if (elemData) break;
    }
  }

  const et = elemData ? getElementType(elemData.el.type) : null;
  const ElemPanel = elemData ? ELEMENT_PANELS[elemData.el.type] : null;

  const modeLabels = {
    element: et?.label || 'Element',
    row: 'Row',
    section: 'Section',
    col: 'Column',
  };
  const modeColors = {
    element: T.primary,
    row: '#6366f1',
    section: '#334155',
    col: '#3b82f6',
  };
  const modeIcons = { element: '◈', row: '▤', section: '▣', col: '▥' };

  const color = modeColors[selectedMode] || T.primary;

  return (
    <div style={{
      width: 272, flexShrink: 0, display: 'flex', flexDirection: 'column',
      borderLeft: `1.5px solid ${T.border}`, background: '#fff', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px', borderBottom: `1.5px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: T.light, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, background: `${color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color, fontWeight: 800,
          }}>
            {modeIcons[selectedMode] || '◈'}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>{modeLabels[selectedMode] || 'Properties'}</div>
            <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>Properties</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {selectedMode === 'element' && elemData && (
            <button
              onClick={() => {
                deleteElement(elemData.secId, elemData.rowId, elemData.colId, elemData.el.id);
                deselect();
              }}
              style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: '#fff1f2', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={13} />
            </button>
          )}
          <button onClick={deselect} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: T.border, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, scrollbarWidth: 'thin' }}>
        {selectedMode === 'element' && elemData && ElemPanel && (
          <ElemPanel el={elemData.el} onChange={p => updateElement(elemData.secId, elemData.rowId, elemData.colId, elemData.el.id, p)} />
        )}
        {selectedMode === 'row' && (
          <RowSettingsPanel rowId={selectedId} sections={sections} />
        )}
        {selectedMode === 'section' && (
          <SectionSettingsPanel secId={selectedId} sections={sections} />
        )}
        {selectedMode === 'col' && (
          <ColSettingsPanel colId={selectedId} sections={sections} />
        )}
      </div>
    </div>
  );
}
