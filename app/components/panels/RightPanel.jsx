'use client';
import { PropSec, FL, RInput, ColorPick, SliderInput, SegCtrl, Toggle } from '../shared/ui';
import { 
  X, Trash2, Layout, Layers, Columns, 
  MousePointer2, Settings 
} from 'lucide-react';

// ── 0. STYLES & ASSETS ──────────────────────────────────────
const PANEL_WIDTH = 300; // একটু চওড়া করলাম যাতে কঞ্জেসটেড না লাগে

const STYLES = {
  panel: {
    width: PANEL_WIDTH, flexShrink: 0, display: 'flex', flexDirection: 'column',
    borderLeft: '1px solid #E2E8F0', background: '#FFFFFF', height: '100%',
    fontFamily: 'Inter, sans-serif', boxShadow: '-4px 0 24px rgba(0,0,0,0.02)'
  },
  header: {
    padding: '16px 20px', borderBottom: '1px solid #E2E8F0', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#FFFFFF', zIndex: 10
  },
  // 🔥 FIX: এখানে প্যাডিং যোগ করা হয়েছে যাতে বর্ডারের সাথে লেগে না থাকে
  body: {
    flex: 1, overflowY: 'auto', padding: '20px', 
    scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent',
    display: 'flex', flexDirection: 'column', gap: '24px' // সেকশনগুলোর মাঝে গ্যাপ
  },
  // 🔥 FIX: ইনপুটগুলোর মাঝে ফাঁকা রাখার জন্য স্টাইল
  group: {
    display: 'flex', flexDirection: 'column', gap: '14px'
  }
};

// Helper for Icon based on mode
const ModeIcon = ({ mode, color }) => {
  const style = { color: '#fff' };
  const size = 16;
  
  const icons = {
    section: <Layout size={size} style={style} />,
    row: <Layers size={size} style={style} />,
    col: <Columns size={size} style={style} />,
    element: <MousePointer2 size={size} style={style} />,
  };

  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 2px 8px ${color}40`
    }}>
      {icons[mode] || icons.element}
    </div>
  );
};

// ── 1. COMPONENT PROPS WRAPPERS ─────────────────────────────

function SectionProps({ section, onChange }) {
  const s = section.settings || {};
  const up = (k, v) => onChange({ ...s, [k]: v });

  return (
    <>
      <PropSec title="General">
        <div style={STYLES.group}>
          <RInput val={s.label || ''} set={v => up('label', v)} placeholder="Section Label" />
          <Toggle val={s.visible !== false} set={v => up('visible', v)} label="Visible" />
        </div>
      </PropSec>
      
      <PropSec title="Background">
        <div style={STYLES.group}>
          <div>
            <FL>Fill Type</FL>
            <SegCtrl val={s.bgType || 'color'} set={v => up('bgType', v)}
              opts={[{ v: 'color', l: 'Solid' }, { v: 'gradient', l: 'Grad.' }, { v: 'image', l: 'Img' }]} />
          </div>
          
          {(!s.bgType || s.bgType === 'color') && (
            <ColorPick label="Solid Color" val={s.bg || '#ffffff'} set={v => up('bg', v)} />
          )}

          {s.bgType === 'gradient' && (
            <>
              <ColorPick label="Start Color" val={s.gradientFrom || '#6366f1'} set={v => up('gradientFrom', v)} />
              <ColorPick label="End Color" val={s.gradientTo || '#a855f7'} set={v => up('gradientTo', v)} />
              <div>
                <FL>Direction</FL>
                <SegCtrl val={s.gradientDir || '135deg'} set={v => up('gradientDir', v)}
                  opts={[{ v: '90deg', l: '→' }, { v: '135deg', l: '↘' }, { v: '180deg', l: '↓' }]} />
              </div>
            </>
          )}

          {s.bgType === 'image' && (
            <RInput val={s.bgImage || ''} set={v => up('bgImage', v)} placeholder="Image URL (https://...)" />
          )}
        </div>
      </PropSec>

      <PropSec title="Dimensions">
        <div style={STYLES.group}>
          <SliderInput label="Vertical Padding" val={+(s.padV || 0)} set={v => up('padV', v)} min={0} max={200} unit="px" />
          <SliderInput label="Side Padding" val={+(s.padH || 0)} set={v => up('padH', v)} min={0} max={100} unit="px" />
        </div>
      </PropSec>
    </>
  );
}

function RowProps({ row, onChange }) {
  const s = row.settings || {};
  const up = (k, v) => onChange({ ...s, [k]: v });

  return (
    <>
      <PropSec title="Layout Config">
        <div style={STYLES.group}>
          <RInput val={s.label || ''} set={v => up('label', v)} placeholder="Row Label" />
          <div>
            <FL>Container Width</FL>
            <SegCtrl val={s.widthMode || 'boxed'} set={v => up('widthMode', v)}
              opts={[{ v: 'boxed', l: 'Boxed' }, { v: 'full', l: 'Full Width' }]} />
          </div>
        </div>
      </PropSec>

      <PropSec title="Dimensions">
        <div style={STYLES.group}>
          <SliderInput label="Min Height" val={+(s.height || 80)} set={v => up('height', v)} min={40} max={800} unit="px" />
          {(s.widthMode === 'boxed' || !s.widthMode) && (
            <SliderInput label="Max Width" val={+(s.maxWidth || 1280)} set={v => up('maxWidth', v)} min={600} max={1920} unit="px" />
          )}
          <SliderInput label="Gutter Space" val={+(s.colGap || 20)} set={v => up('colGap', v)} min={0} max={100} unit="px" />
        </div>
      </PropSec>

      <PropSec title="Background">
        <div style={STYLES.group}>
          <ColorPick label="Fill Color" val={s.bg || '#ffffff'} set={v => up('bg', v)} />
        </div>
      </PropSec>
    </>
  );
}

function ColPropsPanel({ col, onChange }) {
  const s = col.settings || {};
  const up = (k, v) => onChange({ ...s, [k]: v });

  return (
    <>
      <PropSec title="Alignment">
        <div style={STYLES.group}>
          <div>
            <FL>Horizontal Align</FL>
            <SegCtrl val={s.align || 'flex-start'} set={v => up('align', v)}
              opts={[{ v: 'flex-start', l: 'Start' }, { v: 'center', l: 'Center' }, { v: 'flex-end', l: 'End' }, { v: 'space-between', l: 'Space' }]} />
          </div>
          <div>
            <FL>Vertical Align</FL>
            <SegCtrl val={s.valign || 'center'} set={v => up('valign', v)}
              opts={[{ v: 'flex-start', l: 'Top' }, { v: 'center', l: 'Middle' }, { v: 'flex-end', l: 'Bottom' }]} />
          </div>
        </div>
      </PropSec>

      <PropSec title="Spacing & Style">
        <div style={STYLES.group}>
          <ColorPick label="Background" val={s.bg || ''} set={v => up('bg', v)} />
          <SliderInput label="Inner Padding" val={+(s.padV || 8)} set={v => up('padV', v)} min={0} max={100} unit="px" />
          <SliderInput label="Item Gap" val={+(s.gap || 12)} set={v => up('gap', v)} min={0} max={80} unit="px" />
        </div>
      </PropSec>
    </>
  );
}

// ── 2. ELEMENT PROPS ────────────────────────────────────────
function ElementPropsPanel({ el, elementMap, onChange }) {
  const def = elementMap?.[el.type];
  const p = el.props || {};
  const up = (k, v) => onChange({ [k]: v });

  const TypographySection = () => (
    <PropSec title="Typography">
      <div style={STYLES.group}>
        <SliderInput label="Size" val={+(p.fontSize || 16)} set={v => up('fontSize', v)} min={10} max={120} unit="px" />
        <ColorPick label="Text Color" val={p.color || '#0f172a'} set={v => up('color', v)} />
        <div>
          <FL>Alignment</FL>
          <SegCtrl val={p.textAlign || 'left'} set={v => up('textAlign', v)}
            opts={[{ v: 'left', l: 'Left' }, { v: 'center', l: 'Center' }, { v: 'right', l: 'Right' }]} />
        </div>
        <div>
          <FL>Weight</FL>
          <SegCtrl val={String(p.fontWeight || '400')} set={v => up('fontWeight', v)}
            opts={[{ v: '400', l: 'Reg' }, { v: '600', l: 'Semi' }, { v: '700', l: 'Bold' }]} />
        </div>
      </div>
    </PropSec>
  );

  switch (el.type) {
    case 'heading':
    case 'text':
      return (
        <>
          <PropSec title="Content">
            <div style={STYLES.group}>
              <textarea
                value={p.content || ''}
                onChange={e => up('content', e.target.value)}
                rows={4}
                placeholder="Type your content here..."
                style={{ 
                  width: '100%', padding: '10px', fontSize: 13, lineHeight: 1.5,
                  border: '1px solid #E2E8F0', borderRadius: 6, resize: 'vertical', 
                  outline: 'none', fontFamily: 'inherit', color: '#334155', background: '#F8FAFC' 
                }}
              />
              {el.type === 'heading' && (
                <div>
                  <FL>HTML Tag</FL>
                  <SegCtrl val={p.tag || 'h2'} set={v => up('tag', v)}
                    opts={[{ v: 'h1', l: 'H1' }, { v: 'h2', l: 'H2' }, { v: 'h3', l: 'H3' }, { v: 'p', l: 'P' }]} />
                </div>
              )}
            </div>
          </PropSec>
          <TypographySection />
        </>
      );

    case 'image':
      return (
        <>
          <PropSec title="Source">
            <div style={STYLES.group}>
              <RInput val={p.src || ''} set={v => up('src', v)} placeholder="Image URL" />
              <RInput val={p.alt || ''} set={v => up('alt', v)} placeholder="Alt description" />
            </div>
          </PropSec>
          <PropSec title="Dimensions">
            <div style={STYLES.group}>
              <RInput val={p.width || '100%'} set={v => up('width', v)} placeholder="Width (e.g. 100%)" />
              <div>
                <FL>Fit Mode</FL>
                <SegCtrl val={p.objectFit || 'cover'} set={v => up('objectFit', v)}
                  opts={[{ v: 'cover', l: 'Cover' }, { v: 'contain', l: 'Contain' }, { v: 'fill', l: 'Fill' }]} />
              </div>
            </div>
          </PropSec>
          <PropSec title="Style">
            <div style={STYLES.group}>
              <SliderInput label="Radius" val={+(p.borderRadius || 8)} set={v => up('borderRadius', v)} min={0} max={100} unit="px" />
            </div>
          </PropSec>
        </>
      );

    case 'button':
    case 'cta':
      return (
        <>
          <PropSec title="Action">
             <div style={STYLES.group}>
               <RInput val={p.text || ''} set={v => up('text', v)} placeholder="Button Label" />
               {el.type === 'button' && <RInput val={p.href || '#'} set={v => up('href', v)} placeholder="Link URL" />}
             </div>
          </PropSec>
          <PropSec title="Appearance">
            <div style={STYLES.group}>
              <ColorPick label="Background" val={p.bg || '#6366f1'} set={v => up('bg', v)} />
              <ColorPick label="Text Color" val={p.color || '#ffffff'} set={v => up('color', v)} />
              <SliderInput label="Corner Radius" val={+(p.borderRadius || 8)} set={v => up('borderRadius', v)} min={0} max={40} unit="px" />
            </div>
          </PropSec>
          <PropSec title="Size">
             <div style={STYLES.group}>
               <SliderInput label="Text Size" val={+(p.fontSize || 14)} set={v => up('fontSize', v)} min={10} max={32} unit="px" />
               <SliderInput label="H. Padding" val={+(p.padH || 24)} set={v => up('padH', v)} min={8} max={80} unit="px" />
               <SliderInput label="V. Padding" val={+(p.padV || 12)} set={v => up('padV', v)} min={4} max={40} unit="px" />
             </div>
          </PropSec>
        </>
      );

    case 'nav':
      return (
        <>
          <PropSec title="Menu Styling">
            <div style={STYLES.group}>
              <SliderInput label="Item Gap" val={+(p.gap || 28)} set={v => up('gap', v)} min={8} max={100} unit="px" />
              <SliderInput label="Font Size" val={+(p.fontSize || 14)} set={v => up('fontSize', v)} min={10} max={24} unit="px" />
              <ColorPick label="Text Color" val={p.color || '#334155'} set={v => up('color', v)} />
            </div>
          </PropSec>
          <PropSec title="Menu Links">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(p.items || []).map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <RInput val={item.label} set={v => {
                    const items = [...(p.items || [])];
                    items[i] = { ...item, label: v };
                    up('items', items);
                  }} placeholder="Name" />
                  <RInput val={item.href} set={v => {
                    const items = [...(p.items || [])];
                    items[i] = { ...item, href: v };
                    up('items', items);
                  }} placeholder="URL" />
                </div>
              ))}
            </div>
          </PropSec>
        </>
      );

    default:
      return (
        <div style={{ padding: 20, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
          <Settings size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
          <p>No properties available for this element.</p>
        </div>
      );
  }
}

// ── 3. MAIN RIGHT PANEL ─────────────────────────────────────

const MODE_META = {
  section: { color: '#8B5CF6', label: 'Section' },
  row:     { color: '#10B981', label: 'Row' },
  col:     { color: '#3B82F6', label: 'Column' },
  element: { color: '#6366F1', label: 'Element' },
};

export function RightPanel({ store, elementMap, onClose }) {
  const selectedId = store(s => s.selectedId);
  const selectionMeta = store(s => s.selectionMeta);
  const sections = store(s => s.sections);
  const updateSection = store(s => s.updateSection);
  const updateRow = store(s => s.updateRow);
  const updateColumn = store(s => s.updateColumn);
  const updateElement = store(s => s.updateElement);
  const deleteElement = store(s => s.deleteElement);

  if (!selectedId || !selectionMeta) return null;

  const mode = selectionMeta.mode;
  const meta = MODE_META[mode] || MODE_META.element;

  // Find selection logic
  let selectedItem = null;
  let sectionData = null, rowData = null, colData = null, elemData = null;

  for (const sec of sections) {
    if (mode === 'section' && sec.id === selectedId) { sectionData = sec; break; }
    for (const row of sec.rows || []) {
      if (mode === 'row' && row.id === selectedId) { rowData = row; sectionData = sec; break; }
      for (const col of row.columns || []) {
        if (mode === 'col' && col.id === selectedId) { colData = col; rowData = row; sectionData = sec; break; }
        for (const el of col.elements || []) {
          if (mode === 'element' && el.id === selectedId) { elemData = { el, col, row, sec }; break; }
        }
      }
    }
  }

  return (
    <div style={STYLES.panel}>
      
      {/* ── HEADER ── */}
      <div style={STYLES.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ModeIcon mode={mode} color={meta.color} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              {meta.label}
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, color: '#64748B' }}>
              Properties
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {mode === 'element' && elemData && (
            <button
              onClick={() => { deleteElement(selectedId); onClose?.(); }}
              title="Delete Element"
              style={{
                width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
                background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
              onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            title="Close Panel"
            style={{
              width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
              background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B'; }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={STYLES.body}>
        {mode === 'section' && sectionData && (
          <SectionProps section={sectionData} onChange={(s) => updateSection(sectionData.id, s)} />
        )}
        {mode === 'row' && rowData && (
          <RowProps row={rowData} onChange={(s) => updateRow(rowData.id, s)} />
        )}
        {mode === 'col' && colData && rowData && sectionData && (
          <ColPropsPanel col={colData} onChange={(s) => updateColumn(sectionData.id, rowData.id, colData.id, s)} />
        )}
        {mode === 'element' && elemData && (
          <ElementPropsPanel
            el={elemData.el}
            elementMap={elementMap}
            onChange={(patch) => updateElement(elemData.el.id, patch)}
          />
        )}
        
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}