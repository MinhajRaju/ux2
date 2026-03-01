'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

const PRESETS = [
  {
    group: 'Single',
    items: [
      { id: '1', label: '1 Column', cols: 1, widths: [100] },
    ],
  },
  {
    group: '2 Columns',
    items: [
      { id: '2eq',  label: '½ + ½',   cols: 2, widths: [50, 50] },
      { id: '13',   label: '⅓ + ⅔',   cols: 2, widths: [33.33, 66.67] },
      { id: '31',   label: '⅔ + ⅓',   cols: 2, widths: [66.67, 33.33] },
      { id: '14',   label: '¼ + ¾',   cols: 2, widths: [25, 75] },
      { id: '41',   label: '¾ + ¼',   cols: 2, widths: [75, 25] },
    ],
  },
  {
    group: '3 Columns',
    items: [
      { id: '3eq',  label: '⅓ + ⅓ + ⅓',   cols: 3, widths: [33.33, 33.33, 33.33] },
      { id: '121',  label: '¼ + ½ + ¼',     cols: 3, widths: [25, 50, 25] },
      { id: '211',  label: '½ + ¼ + ¼',     cols: 3, widths: [50, 25, 25] },
      { id: '112',  label: '¼ + ¼ + ½',     cols: 3, widths: [25, 25, 50] },
    ],
  },
  {
    group: '4 Columns',
    items: [
      { id: '4eq', label: '4 Equal', cols: 4, widths: [25, 25, 25, 25] },
    ],
  },
];

function PresetVisual({ widths, hovered }) {
  return (
    <div style={{
      display: 'flex', gap: 3, width: '100%', height: 36,
      padding: 5, boxSizing: 'border-box',
      background: hovered ? '#e0f2fe' : '#f8fafc',
      borderRadius: 6, transition: 'background 0.15s',
    }}>
      {widths.map((w, i) => (
        <div key={i} style={{
          flex: w, background: hovered ? '#0ea5e9' : '#cbd5e1',
          borderRadius: 3, minWidth: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}>
          {widths.length <= 3 && (
            <span style={{
              fontSize: 8, fontWeight: 700,
              color: hovered ? 'rgba(255,255,255,0.9)' : '#94a3b8',
              transition: 'color 0.15s',
            }}>
              {Math.round(w)}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * ColPresetsModal — column layout preset picker.
 * Props:
 *   store      – zustand store hook
 *   addSubCols – fn(colId, cols, widths) from store
 */
export function ColPresetsModal({ store, addSubCols }) {
  const colModal   = store(s => s.colModal);
  const closeModal = store(s => s.closeColModal);
  const [hovered, setHovered] = useState(null);

  if (!colModal?.open) return null;

  const handleSelect = (preset) => {
    addSubCols(colModal.colId, preset.cols, preset.widths);
    closeModal();
  };

  return (
    <div
      onClick={closeModal}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.52)',
        backdropFilter: 'blur(5px)',
        zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 18,
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          width: 560, maxWidth: '100%',
          maxHeight: '82vh', overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 26px 14px', borderBottom: '1px solid #f1f5f9',
          position: 'sticky', top: 0, background: '#fff', zIndex: 10,
          borderRadius: '18px 18px 0 0',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>⊞</div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
                Nested Column Layout
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b', paddingLeft: 42 }}>
              Select a layout to nest inside this column
            </p>
          </div>
          <button
            onClick={closeModal}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none',
              background: '#f1f5f9', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748b', flexShrink: 0, transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
          >
            <X size={15} />
          </button>
        </div>

        {/* Presets */}
        <div style={{ padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {PRESETS.map(group => (
            <div key={group.group}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10,
              }}>
                {group.group}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: group.items.length === 1
                  ? '1fr'
                  : 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 10,
              }}>
                {group.items.map(preset => {
                  const isHov = hovered === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelect(preset)}
                      onMouseEnter={() => setHovered(preset.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        border: `2px solid ${isHov ? '#0ea5e9' : '#e2e8f0'}`,
                        borderRadius: 10, padding: '10px', cursor: 'pointer',
                        background: isHov ? '#f0f9ff' : '#fff',
                        transform: isHov ? 'translateY(-2px)' : 'none',
                        boxShadow: isHov ? '0 8px 24px rgba(14,165,233,0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease',
                        display: 'flex', flexDirection: 'column', gap: 8,
                      }}
                    >
                      <PresetVisual widths={preset.widths} hovered={isHov} />
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: isHov ? '#0284c7' : '#64748b',
                        textAlign: 'center', transition: 'color 0.15s',
                      }}>
                        {preset.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '12px 26px 22px',
          display: 'flex', justifyContent: 'flex-end',
          borderTop: '1px solid #f1f5f9',
        }}>
          <button
            onClick={closeModal}
            style={{
              padding: '8px 20px', border: '1px solid #e2e8f0',
              borderRadius: 8, background: '#fff', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: '#64748b',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
