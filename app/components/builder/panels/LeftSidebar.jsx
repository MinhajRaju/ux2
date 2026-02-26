// src/components/builder/panels/LeftSidebar.jsx
'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { T } from '@/constants/theme';
import { LAYOUT_BLOCKS, ELEMENT_TYPES, ELEMENT_ICON, ELEMENT_COLOR, getElementTypes } from '@/core/blockRegistry';
import { useBuilderStore } from '@/store/builderStore';

// ── Element chip (draggable) ───────────────────────────────────
function ElemChip({ et }) {
  const [hovered, setHovered] = useState(false);
  const color = ELEMENT_COLOR[et.type] || T.primary;
  const icon  = ELEMENT_ICON[et.type]  || '●';

  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('pb-drag', JSON.stringify({ newType: et.type }));
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        padding: '10px 6px', borderRadius: 10,
        border: `1.5px solid ${hovered ? color : T.border}`,
        background: hovered ? `${color}0a` : T.light,
        cursor: 'grab', transition: 'border-color .15s, background .15s',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: 40, height: 32, borderRadius: 8, background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: hovered ? color : '#64748b', textAlign: 'center', lineHeight: 1.3 }}>
        {et.label}
      </span>
    </div>
  );
}

// ── Layout block button ────────────────────────────────────────
function LayoutBtn({ block, onAction }) {
  const [hovered, setHovered] = useState(false);
  const C = block.color || T.primary;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => block.available && onAction(block.key)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 10, marginBottom: 4,
        cursor: block.available ? 'pointer' : 'not-allowed',
        opacity: block.available ? 1 : 0.4,
        border: `1.5px solid ${hovered && block.available ? C : T.border}`,
        background: hovered && block.available ? `${C}08` : T.light,
        transition: 'all .15s',
      }}
    >
      <div style={{
        width: 38, height: 28, borderRadius: 7, background: hovered && block.available ? `${C}14` : '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: C,
      }}>
        {block.key === 'section' ? '▣' : block.key === 'row' ? '▤' : block.key === 'grid' ? '⊞' : '◫'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{block.label}</div>
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{block.desc}</div>
      </div>
      {block.available ? (
        <div style={{
          width: 20, height: 20, borderRadius: 6,
          background: hovered ? C : '#e2e8f0', color: hovered ? '#fff' : '#94a3b8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, transition: 'background .15s',
        }}>+</div>
      ) : (
        <span style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>SOON</span>
      )}
    </div>
  );
}

// ── Layers tree ────────────────────────────────────────────────
function LayerElem({ el, depth, isSel, onClick }) {
  const [h, setH] = useState(false);
  const color = ELEMENT_COLOR[el.type] || T.primary;
  const icon  = ELEMENT_ICON[el.type]  || '●';
  const label = el.props?.content || el.props?.label || el.props?.text || el.type;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: `4px 8px 4px ${depth}px`,
        borderRadius: 5, marginBottom: 1, cursor: 'pointer',
        background: isSel ? '#eef2ff' : h ? '#f5f3ff' : 'transparent',
      }}
    >
      <span style={{ fontSize: 12, width: 16, textAlign: 'center', color, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 500, color: isSel ? '#4f46e5' : '#64748b', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  );
}

function LayerCol({ col, depth, secId, rowId, selectedId, onSelectCol, onSelectEl }) {
  const [open, setOpen] = useState(true);
  const [h, setH] = useState(false);
  const isSel = selectedId === col.id;
  return (
    <div>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: `4px 8px 4px ${depth}px`,
          cursor: 'pointer', borderRadius: 4, marginBottom: 1,
          background: isSel ? '#dbeafe' : h ? '#eff6ff' : 'transparent',
          borderLeft: isSel ? '2px solid #3b82f6' : h ? '2px solid #93c5fd' : '2px solid transparent',
        }}
        onClick={() => onSelectCol(col.id, { secId, rowId })}
      >
        <span onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
          style={{ fontSize: 10, color: '#94a3b8', width: 12, textAlign: 'center', userSelect: 'none' }}>
          {open ? '▾' : '▸'}
        </span>
        <span style={{ fontSize: 9, background: isSel ? '#3b82f6' : '#dbeafe', color: isSel ? '#fff' : '#3b82f6', padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>Col</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: isSel ? '#1d4ed8' : h ? '#2563eb' : '#64748b' }}>
          Column {col.elements.length > 0 ? `(${col.elements.length})` : ''}
        </span>
      </div>
      {open && col.elements.map(el => (
        <LayerElem key={el.id} el={el} depth={depth + 14} isSel={selectedId === el.id}
          onClick={() => onSelectEl(el.id, { secId, rowId, colId: col.id })} />
      ))}
    </div>
  );
}

function LayerRow({ row, secId, depth, selectedId, onSelectRow, onSelectCol, onSelectEl }) {
  const [open, setOpen] = useState(true);
  const [h, setH] = useState(false);
  const isSel = selectedId === row.id;
  return (
    <div>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: `6px 10px 6px ${depth}px`, cursor: 'pointer',
          background: isSel ? '#eef2ff' : h ? '#f5f3ff' : 'transparent',
          borderLeft: isSel ? '3px solid #6366f1' : '3px solid transparent',
        }}
        onClick={() => onSelectRow(row.id, { secId })}
      >
        <span onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
          style={{ fontSize: 10, color: '#94a3b8', width: 12, textAlign: 'center', userSelect: 'none' }}>
          {open ? '▾' : '▸'}
        </span>
        <span style={{ fontSize: 10, background: isSel ? '#6366f1' : '#818cf8', color: '#fff', padding: '2px 5px', borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>R</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: isSel ? '#4f46e5' : '#64748b', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.settings?.label || 'Row'} {row.columns.length > 0 ? `(${row.columns.length}c)` : ''}
        </span>
      </div>
      {open && row.columns.map(col => (
        <LayerCol key={col.id} col={col} depth={depth + 14} secId={secId} rowId={row.id}
          selectedId={selectedId} onSelectCol={onSelectCol} onSelectEl={onSelectEl} />
      ))}
    </div>
  );
}

function LayersPanel({ sections, selectedId, onSelectSection, onSelectRow, onSelectCol, onSelectEl }) {
  const [collapsed, setCollapsed] = useState({});
  const toggle = id => setCollapsed(p => ({ ...p, [id]: !p[id] }));

  if (!sections || sections.length === 0) {
    return (
      <div style={{ padding: '32px 12px', textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🗂</div>
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>No content yet</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 12, scrollbarWidth: 'thin' }}>
      {sections.map((sec, si) => {
        const secOpen = !collapsed[sec.id];
        const isSel = selectedId === sec.id;
        return (
          <div key={sec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 10px', cursor: 'pointer',
                background: isSel ? '#f8faff' : 'transparent',
                borderLeft: isSel ? '3px solid #6366f1' : '3px solid transparent',
              }}
              onClick={() => onSelectSection(sec.id)}
              onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = '#f8faff'; }}
              onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
            >
              <span onClick={e => { e.stopPropagation(); toggle(sec.id); }}
                style={{ fontSize: 10, color: '#94a3b8', width: 12, textAlign: 'center', cursor: 'pointer', userSelect: 'none' }}>
                {secOpen ? '▾' : '▸'}
              </span>
              <span style={{ fontSize: 10, background: isSel ? '#6366f1' : '#94a3b8', color: '#fff', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>S</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: isSel ? '#4f46e5' : '#334155', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sec.settings?.label || `Section ${si + 1}`}
              </span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>{sec.rows?.length}</span>
            </div>
            {secOpen && (sec.rows || []).map(row => (
              <LayerRow key={row.id} row={row} secId={sec.id} depth={20}
                selectedId={selectedId} onSelectRow={(rowId, meta) => onSelectRow(rowId, meta)}
                onSelectCol={onSelectCol} onSelectEl={onSelectEl} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── MAIN EXPORT ────────────────────────────────────────────────
export function LeftSidebar() {
  const [tab, setTab] = useState('layout');
  const { sections, selectedId, selectedMode, addSection, addRow, select, deselect } = useBuilderStore();

  const contentElements = getElementTypes().filter(e => e.group === 'content');
  const ecommerceElements = getElementTypes().filter(e => e.group === 'ecommerce');

  const handleSelectSection = (secId) => {
    select(secId, 'section', { secId });
  };

  const handleSelectRow = (rowId, meta) => {
    select(rowId, 'row', meta);
  };

  const handleSelectCol = (colId, meta) => {
    select(colId, 'col', meta);
  };

  const handleSelectEl = (elId, meta) => {
    select(elId, 'element', meta);
  };

  return (
    <div style={{
      width: 230, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: '#fff', borderRight: `1px solid ${T.border}`, overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '14px 16px', borderBottom: `1px solid ${T.border}`, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: '#0f172a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,.2)',
        }}>✦</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>Page Builder</div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>Visual Editor</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        {[['layout', 'Layout'], ['elements', 'Elements'], ['layers', 'Layers']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: '10px 2px', fontSize: 11, fontWeight: 600, border: 'none',
            borderBottom: `2px solid ${tab === k ? T.primary : 'transparent'}`,
            background: 'transparent', color: tab === k ? T.primary : '#94a3b8',
            cursor: 'pointer', transition: 'color .15s, border-color .15s',
          }}>{l}</button>
        ))}
      </div>

      {/* Layout tab */}
      {tab === 'layout' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 12, scrollbarWidth: 'thin' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 10 }}>Layout Blocks</div>
          {LAYOUT_BLOCKS.map(b => (
            <LayoutBtn key={b.key} block={b} onAction={k => {
              if (k === 'section') addSection();
              else if (k === 'row') {
                const lastSec = sections[sections.length - 1];
                if (lastSec) addRow(lastSec.id, 1);
                else addSection();
              }
            }} />
          ))}
          <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 10, background: T.light, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Structure</div>
            <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.8 }}>
              <b>Section</b> → page wrapper<br />
              <b>Row</b> → column grid<br />
              <b>Elements</b> → inside columns
            </div>
          </div>
        </div>
      )}

      {/* Elements tab */}
      {tab === 'elements' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 12, scrollbarWidth: 'thin' }}>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: T.light, border: `1px solid ${T.border}`, marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
              <b style={{ color: T.primary }}>Drag</b> elements into any column
            </div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>Content</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6, marginBottom: 16 }}>
            {contentElements.map(et => <ElemChip key={et.type} et={et} />)}
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: T.primary, marginBottom: 8 }}>E-Commerce</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
            {ecommerceElements.map(et => <ElemChip key={et.type} et={et} />)}
          </div>
        </div>
      )}

      {/* Layers tab */}
      {tab === 'layers' && (
        <>
          <div style={{
            padding: '8px 12px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0, background: T.light,
          }}>
            {[
              { badge: 'S', color: '#334155', label: 'Section' },
              { badge: 'R', color: '#6366f1', label: 'Row' },
              { badge: 'Col', color: '#3b82f6', label: 'Column' },
            ].map(({ badge, color, label }) => (
              <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, background: color, color: '#fff', padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>{badge}</span>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{label}</span>
              </div>
            ))}
          </div>
          <LayersPanel
            sections={sections}
            selectedId={selectedId}
            onSelectSection={handleSelectSection}
            onSelectRow={handleSelectRow}
            onSelectCol={handleSelectCol}
            onSelectEl={handleSelectEl}
          />
        </>
      )}
    </div>
  );
}
