'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

// ── Preset definitions ────────────────────────────────────────────────────────
export const GRID_PRESETS = [
  {
    group: 'Basic Grids',
    items: [
      {
        id: '2x1', label: '2 Equal', columns: 2, rows: 1,
        cells: [{colStart:1,colEnd:2,rowStart:1,rowEnd:2},{colStart:2,colEnd:3,rowStart:1,rowEnd:2}],
      },
      {
        id: '3x1', label: '3 Equal', columns: 3, rows: 1,
        cells: [{colStart:1,colEnd:2,rowStart:1,rowEnd:2},{colStart:2,colEnd:3,rowStart:1,rowEnd:2},{colStart:3,colEnd:4,rowStart:1,rowEnd:2}],
      },
      {
        id: '4x1', label: '4 Equal', columns: 4, rows: 1,
        cells: [{colStart:1,colEnd:2,rowStart:1,rowEnd:2},{colStart:2,colEnd:3,rowStart:1,rowEnd:2},{colStart:3,colEnd:4,rowStart:1,rowEnd:2},{colStart:4,colEnd:5,rowStart:1,rowEnd:2}],
      },
      {
        id: '2x2', label: '2×2 Grid', columns: 2, rows: 2,
        cells: [
          {colStart:1,colEnd:2,rowStart:1,rowEnd:2},{colStart:2,colEnd:3,rowStart:1,rowEnd:2},
          {colStart:1,colEnd:2,rowStart:2,rowEnd:3},{colStart:2,colEnd:3,rowStart:2,rowEnd:3},
        ],
      },
      {
        id: '3x2', label: '3×2 Grid', columns: 3, rows: 2,
        cells: [
          {colStart:1,colEnd:2,rowStart:1,rowEnd:2},{colStart:2,colEnd:3,rowStart:1,rowEnd:2},{colStart:3,colEnd:4,rowStart:1,rowEnd:2},
          {colStart:1,colEnd:2,rowStart:2,rowEnd:3},{colStart:2,colEnd:3,rowStart:2,rowEnd:3},{colStart:3,colEnd:4,rowStart:2,rowEnd:3},
        ],
      },
      {
        id: '4x2', label: '4×2 Grid', columns: 4, rows: 2,
        cells: [
          {colStart:1,colEnd:2,rowStart:1,rowEnd:2},{colStart:2,colEnd:3,rowStart:1,rowEnd:2},{colStart:3,colEnd:4,rowStart:1,rowEnd:2},{colStart:4,colEnd:5,rowStart:1,rowEnd:2},
          {colStart:1,colEnd:2,rowStart:2,rowEnd:3},{colStart:2,colEnd:3,rowStart:2,rowEnd:3},{colStart:3,colEnd:4,rowStart:2,rowEnd:3},{colStart:4,colEnd:5,rowStart:2,rowEnd:3},
        ],
      },
    ],
  },
  {
    group: 'Magazine Layouts',
    items: [
      {
        id: 'mag-feature', label: 'Feature + Sidebar', columns: 3, rows: 2,
        cells: [
          {colStart:1,colEnd:3,rowStart:1,rowEnd:3},
          {colStart:3,colEnd:4,rowStart:1,rowEnd:2},
          {colStart:3,colEnd:4,rowStart:2,rowEnd:3},
        ],
      },
      {
        id: 'mag-reverse', label: 'Sidebar + Feature', columns: 3, rows: 2,
        cells: [
          {colStart:1,colEnd:2,rowStart:1,rowEnd:2},
          {colStart:1,colEnd:2,rowStart:2,rowEnd:3},
          {colStart:2,colEnd:4,rowStart:1,rowEnd:3},
        ],
      },
      {
        id: 'mag-hero', label: 'Hero + Cards', columns: 3, rows: 3,
        cells: [
          {colStart:1,colEnd:4,rowStart:1,rowEnd:2},
          {colStart:1,colEnd:2,rowStart:2,rowEnd:4},
          {colStart:2,colEnd:3,rowStart:2,rowEnd:3},
          {colStart:3,colEnd:4,rowStart:2,rowEnd:3},
          {colStart:2,colEnd:4,rowStart:3,rowEnd:4},
        ],
      },
      {
        id: 'mag-newspaper', label: 'Newspaper', columns: 4, rows: 3,
        cells: [
          {colStart:1,colEnd:3,rowStart:1,rowEnd:2},
          {colStart:3,colEnd:5,rowStart:1,rowEnd:3},
          {colStart:1,colEnd:2,rowStart:2,rowEnd:4},
          {colStart:2,colEnd:3,rowStart:2,rowEnd:3},
          {colStart:2,colEnd:3,rowStart:3,rowEnd:4},
          {colStart:3,colEnd:5,rowStart:3,rowEnd:4},
        ],
      },
      {
        id: 'mag-editorial', label: 'Editorial', columns: 4, rows: 2,
        cells: [
          {colStart:1,colEnd:3,rowStart:1,rowEnd:3},
          {colStart:3,colEnd:4,rowStart:1,rowEnd:2},
          {colStart:4,colEnd:5,rowStart:1,rowEnd:2},
          {colStart:3,colEnd:5,rowStart:2,rowEnd:3},
        ],
      },
    ],
  },
  {
    group: 'Dashboard Layouts',
    items: [
      {
        id: 'dash-stats', label: 'Stats + Content', columns: 4, rows: 3,
        cells: [
          {colStart:1,colEnd:2,rowStart:1,rowEnd:2},
          {colStart:2,colEnd:3,rowStart:1,rowEnd:2},
          {colStart:3,colEnd:4,rowStart:1,rowEnd:2},
          {colStart:4,colEnd:5,rowStart:1,rowEnd:2},
          {colStart:1,colEnd:4,rowStart:2,rowEnd:4},
          {colStart:4,colEnd:5,rowStart:2,rowEnd:4},
        ],
      },
      {
        id: 'dash-bento', label: 'Bento Box', columns: 4, rows: 3,
        cells: [
          {colStart:1,colEnd:3,rowStart:1,rowEnd:2},
          {colStart:3,colEnd:5,rowStart:1,rowEnd:3},
          {colStart:1,colEnd:2,rowStart:2,rowEnd:3},
          {colStart:2,colEnd:3,rowStart:2,rowEnd:3},
          {colStart:1,colEnd:3,rowStart:3,rowEnd:4},
          {colStart:3,colEnd:5,rowStart:3,rowEnd:4},
        ],
      },
      {
        id: 'dash-analytics', label: 'Analytics', columns: 3, rows: 3,
        cells: [
          {colStart:1,colEnd:3,rowStart:1,rowEnd:2},
          {colStart:3,colEnd:4,rowStart:1,rowEnd:2},
          {colStart:1,colEnd:2,rowStart:2,rowEnd:4},
          {colStart:2,colEnd:3,rowStart:2,rowEnd:3},
          {colStart:3,colEnd:4,rowStart:2,rowEnd:3},
          {colStart:2,colEnd:4,rowStart:3,rowEnd:4},
        ],
      },
      {
        id: 'dash-kanban', label: 'Kanban Board', columns: 3, rows: 1,
        cells: [
          {colStart:1,colEnd:2,rowStart:1,rowEnd:2},
          {colStart:2,colEnd:3,rowStart:1,rowEnd:2},
          {colStart:3,colEnd:4,rowStart:1,rowEnd:2},
        ],
      },
    ],
  },
  {
    group: 'Portfolio / Gallery',
    items: [
      {
        id: 'port-masonry', label: 'Masonry 3', columns: 3, rows: 3,
        cells: [
          {colStart:1,colEnd:2,rowStart:1,rowEnd:3},
          {colStart:2,colEnd:3,rowStart:1,rowEnd:2},
          {colStart:3,colEnd:4,rowStart:1,rowEnd:2},
          {colStart:2,colEnd:4,rowStart:2,rowEnd:3},
          {colStart:1,colEnd:3,rowStart:3,rowEnd:4},
          {colStart:3,colEnd:4,rowStart:3,rowEnd:4},
        ],
      },
      {
        id: 'port-pinterest', label: 'Pinterest', columns: 4, rows: 3,
        cells: [
          {colStart:1,colEnd:2,rowStart:1,rowEnd:3},
          {colStart:2,colEnd:3,rowStart:1,rowEnd:2},
          {colStart:3,colEnd:4,rowStart:1,rowEnd:2},
          {colStart:4,colEnd:5,rowStart:1,rowEnd:3},
          {colStart:2,colEnd:4,rowStart:2,rowEnd:3},
          {colStart:1,colEnd:3,rowStart:3,rowEnd:4},
          {colStart:3,colEnd:5,rowStart:3,rowEnd:4},
        ],
      },
      {
        id: 'port-hero-grid', label: 'Hero Gallery', columns: 3, rows: 2,
        cells: [
          {colStart:1,colEnd:2,rowStart:1,rowEnd:3},
          {colStart:2,colEnd:3,rowStart:1,rowEnd:2},
          {colStart:3,colEnd:4,rowStart:1,rowEnd:2},
          {colStart:2,colEnd:4,rowStart:2,rowEnd:3},
        ],
      },
      {
        id: 'port-featured', label: 'Featured Item', columns: 2, rows: 2,
        cells: [
          {colStart:1,colEnd:2,rowStart:1,rowEnd:3},
          {colStart:2,colEnd:3,rowStart:1,rowEnd:2},
          {colStart:2,colEnd:3,rowStart:2,rowEnd:3},
        ],
      },
    ],
  },
];

// ── Mini grid visual preview ─────────────────────────────────────────────────
const COLORS = [
  '#6366f1','#8b5cf6','#3b82f6','#06b6d4','#10b981',
  '#f59e0b','#f97316','#ef4444','#ec4899','#84cc16',
];

function GridPreview({ preset, hovered }) {
  const { columns, rows, cells } = preset;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: 2,
      width: '100%',
      height: 56,
      background: hovered ? '#eef2ff' : '#f8fafc',
      borderRadius: 6,
      padding: 4,
      boxSizing: 'border-box',
      transition: 'background 0.15s',
    }}>
      {cells.map((c, i) => (
        <div key={i} style={{
          gridColumn: `${c.colStart} / ${c.colEnd}`,
          gridRow: `${c.rowStart} / ${c.rowEnd}`,
          background: hovered ? COLORS[i % COLORS.length] : '#cbd5e1',
          borderRadius: 3,
          opacity: hovered ? 0.85 : 0.7,
          transition: 'background 0.15s, opacity 0.15s',
          minWidth: 0, minHeight: 0,
        }} />
      ))}
    </div>
  );
}

export function GridPresetsModal({ store }) {
  const gridModal   = store(s => s.gridModal);
  const closeModal  = store(s => s.closeGridModal);
  const addGrid     = store(s => s.addGrid);
  const [hovered, setHovered] = useState(null);

  if (!gridModal?.open) return null;

  const handleSelect = (preset) => {
    addGrid(gridModal.secId, preset);
    closeModal();
  };

  return (
    <div
      onClick={closeModal}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          width: 720, maxWidth: '100%',
          maxHeight: '88vh', overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 26px 16px',
          borderBottom: '1px solid #f1f5f9',
          position: 'sticky', top: 0,
          background: '#fff', zIndex: 10,
          borderRadius: '18px 18px 0 0',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>⊞</div>
              <div>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>Choose Grid Layout</h2>
                <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Select a preset to add a CSS Grid module — fully responsive</p>
              </div>
            </div>
          </div>
          <button
            onClick={closeModal}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: 'none', background: '#f1f5f9',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748b',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
          ><X size={15} /></button>
        </div>

        {/* Preset groups */}
        <div style={{ padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {GRID_PRESETS.map(group => (
            <div key={group.group}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>{group.group}</span>
                <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {group.items.map(preset => {
                  const isHov = hovered === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelect(preset)}
                      onMouseEnter={() => setHovered(preset.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        border: `2px solid ${isHov ? '#6366f1' : '#e2e8f0'}`,
                        borderRadius: 12, padding: '10px',
                        cursor: 'pointer',
                        background: isHov ? '#f5f3ff' : '#fff',
                        transform: isHov ? 'translateY(-2px)' : 'none',
                        boxShadow: isHov ? '0 8px 24px rgba(99,102,241,0.18)' : '0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'all 0.15s ease',
                        display: 'flex', flexDirection: 'column', gap: 8,
                      }}
                    >
                      <GridPreview preset={preset} hovered={isHov} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600,
                          color: isHov ? '#4f46e5' : '#64748b',
                          transition: 'color 0.15s',
                        }}>{preset.label}</span>
                        <span style={{
                          fontSize: 9, color: isHov ? '#8b5cf6' : '#94a3b8',
                          background: isHov ? '#ede9fe' : '#f8fafc',
                          padding: '2px 5px', borderRadius: 4, fontWeight: 600,
                        }}>{preset.columns}×{preset.rows}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 26px 22px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>
            💡 After adding, customize columns, gaps, and responsive breakpoints in the right panel
          </span>
          <button
            onClick={closeModal}
            style={{
              padding: '8px 20px', border: '1px solid #e2e8f0',
              borderRadius: 8, background: '#fff', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: '#64748b',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}
