'use client';
import React, { useState } from 'react';

// ── 0. ICONS & ASSETS (Modern SVGs) ─────────────────────────
const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Close: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  ChevronRight: ({ rotate }) => <svg style={{ transform: rotate ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  Layers: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
  Components: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="8" height="8" rx="2"></rect><rect x="14" y="3" width="8" height="8" rx="2"></rect><rect x="2" y="13" width="8" height="8" rx="2"></rect><rect x="14" y="13" width="8" height="8" rx="2"></rect></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
};

// ── 1. CONFIG & STYLES ──────────────────────────────────────
const COLORS = {
  section: { bg: '#F5F3FF', border: '#8B5CF6', badgeBg: '#EDE9FE', badgeTxt: '#7C3AED', label: 'S' },
  row:     { bg: '#ECFDF5', border: '#10B981', badgeBg: '#D1FAE5', badgeTxt: '#059669', label: 'R' },
  col:     { bg: '#EFF6FF', border: '#3B82F6', badgeBg: '#DBEAFE', badgeTxt: '#2563EB', label: 'C' },
  elem:    { bg: '#F8FAFC', border: '#64748B', badgeBg: 'transparent', badgeTxt: '#94A3B8', label: '●' },
  selected: { bg: '#EEF2FF', border: '#6366F1' } // General selection color
};

// ── 2. REUSABLE TREE ITEM ───────────────────────────────────
const TreeItem = ({ type, label, depth, isSel, hasChildren, expanded, onToggle, onClick, icon }) => {
  const [hover, setHover] = useState(false);
  const theme = COLORS[type] || COLORS.elem;
  
  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHover(true)} 
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 8px', marginLeft: depth,
        marginRight: 8, marginTop: 2, marginBottom: 2,
        borderRadius: 6, cursor: 'pointer', userSelect: 'none',
        transition: 'all 0.15s ease',
        background: isSel ? theme.bg : (hover ? '#F1F5F9' : 'transparent'),
        borderLeft: `3px solid ${isSel ? theme.border : 'transparent'}`,
        color: isSel ? '#1E293B' : '#475569',
      }}
    >
      {/* Expander Icon */}
      <div 
        onClick={(e) => { e.stopPropagation(); onToggle && onToggle(); }}
        style={{ 
          width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', 
          cursor: hasChildren ? 'pointer' : 'default', color: '#94A3B8',
          opacity: hasChildren ? 1 : 0
        }}
      >
        <Icons.ChevronRight rotate={expanded} />
      </div>

      {/* Type Badge */}
      <span style={{ 
        width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 700, borderRadius: 4, 
        background: type === 'elem' ? 'transparent' : theme.badgeBg, 
        color: type === 'elem' ? '#94A3B8' : theme.badgeTxt 
      }}>
        {type === 'elem' && icon ? icon : theme.label}
      </span>

      {/* Label Text */}
      <span style={{ 
        fontSize: 12, fontWeight: isSel ? 600 : 500,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
      }}>
        {label}
      </span>
    </div>
  );
};

// ── 3. ELEMENT CHIP (Draggable Card) ─────────────────────────
const ElementChip = ({ type, def }) => {
  const [hover, setHover] = useState(false);
  
  return (
    <div
      draggable
      onDragStart={e => e.dataTransfer.setData('hb-drag', JSON.stringify({ newType: type }))}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '16px 8px', borderRadius: 10, cursor: 'grab',
        background: '#FFF',
        border: hover ? '1px solid #6366F1' : '1px solid #E2E8F0',
        boxShadow: hover ? '0 4px 12px rgba(99, 102, 241, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? '#EEF2FF' : '#F8FAFC', 
        color: def.color || '#64748B', fontSize: 16,
        transition: 'background 0.2s'
      }}>
        {def.icon}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#334155', textAlign: 'center' }}>
        {def.label}
      </span>
    </div>
  );
};

// ── 4. LAYERS PANEL (Tree Logic) ─────────────────────────────
function LayersPanel({ sections = [], selectedId, elementMap, onSelectSection, onSelectElem, onSelectCol }) {
  const [collapsed, setCollapsed] = useState({});
  const toggle = id => setCollapsed(p => ({ ...p, [id]: !p[id] }));

  if (!sections.length) return (
    <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
      <Icons.Layers />
      <span style={{ fontSize: 12, marginTop: 8 }}>No layers yet</span>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
      {sections.map((sec, si) => (
        <div key={sec.id}>
          <TreeItem 
            type="section" label={sec.settings?.label || `Section ${si + 1}`} depth={4} 
            isSel={selectedId === sec.id} hasChildren={(sec.rows || []).length > 0}
            expanded={!collapsed[sec.id]} onToggle={() => toggle(sec.id)} onClick={() => onSelectSection(sec.id)}
          />
          {!collapsed[sec.id] && sec.rows?.map((row, ri) => (
            <div key={row.id}>
              <TreeItem 
                type="row" label={row.settings?.label || `Row ${ri + 1}`} depth={20} 
                isSel={selectedId === row.id} hasChildren={(row.columns || []).length > 0}
                expanded={!collapsed[row.id]} onToggle={() => toggle(row.id)} onClick={() => {}} 
              />
              {!collapsed[row.id] && row.columns?.map((col, ci) => (
                <div key={col.id}>
                  <TreeItem 
                    type="col" label={`Column ${ci + 1}`} depth={36} 
                    isSel={selectedId === col.id} hasChildren={false}
                    onClick={() => onSelectCol?.(col.id, { secId: sec.id, rowId: row.id, colId: col.id })}
                  />
                  {col.elements?.map(el => (
                    <TreeItem 
                      key={el.id} type="elem" label={el.props?.content || el.props?.text || elementMap?.[el.type]?.label || el.type} 
                      depth={52} isSel={selectedId === el.id} icon={elementMap?.[el.type]?.icon || '●'}
                      onClick={() => onSelectElem(el.id, { secId: sec.id, rowId: row.id, colId: col.id })}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── 5. MAIN LEFT PANEL COMPONENT ─────────────────────────────
export function LeftPanel({ elementMap, sections, selectedId, onSelectSection, onSelectElem, onSelectCol, onAddSection, singleSection }) {
  const [tab, setTab] = useState('elements');
  const [term, setTerm] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);

  const filtered = Object.entries(elementMap).filter(([_, def]) => 
    def.label.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <div style={{ 
      width: 280, height: '100%', background: '#FFFFFF', display: 'flex', flexDirection: 'column',
      borderRight: '1px solid #E2E8F0', fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* ── Header ── */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ 
          width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', 
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 
        }}>
          ✦
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Page Builder</h3>
          <p style={{ margin: 0, fontSize: 11, color: '#64748B' }}>v2.0.0</p>
        </div>
      </div>

      {/* ── Search Bar (Modernized) ── */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ 
          position: 'relative', display: 'flex', alignItems: 'center',
          background: searchFocus ? '#FFFFFF' : '#F1F5F9',
          border: searchFocus ? '1px solid #6366F1' : '1px solid transparent',
          borderRadius: 8, transition: 'all 0.2s ease',
          boxShadow: searchFocus ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : 'none'
        }}>
          <div style={{ paddingLeft: 10, color: searchFocus ? '#6366F1' : '#94A3B8', display: 'flex' }}>
            <Icons.Search />
          </div>
          <input 
            type="text" 
            placeholder="Search components..." 
            value={term} 
            onChange={(e) => setTerm(e.target.value)}
            onFocus={() => setSearchFocus(true)} 
            onBlur={() => setSearchFocus(false)}
            style={{
              width: '100%', padding: '10px 34px 10px 8px', border: 'none', background: 'transparent',
              fontSize: 12, outline: 'none', color: '#334155', fontWeight: 500
            }}
          />
          {term && (
            <button 
              onClick={() => setTerm('')}
              style={{ 
                position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer',
                color: '#94A3B8', display: 'flex', padding: 2, borderRadius: '50%'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
            >
              <Icons.Close />
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ padding: '8px 16px' }}>
        <div style={{ 
          display: 'flex', background: '#F8FAFC', padding: 4, borderRadius: 10, border: '1px solid #E2E8F0' 
        }}>
          {[
            { id: 'elements', label: 'Elements', icon: <Icons.Components /> }, 
            { id: 'layers', label: 'Layers', icon: <Icons.Layers /> }
          ].map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '8px', fontSize: 12, fontWeight: 600, border: 'none', borderRadius: 7, 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: active ? '#FFFFFF' : 'transparent', 
                  color: active ? '#4F46E5' : '#64748B',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', 
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                <span style={{ transform: 'scale(0.9)' }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content Area ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
        {tab === 'elements' ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <div style={{ 
              fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 
            }}>
              {term ? `Search Results (${filtered.length})` : 'Core Components'}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {filtered.map(([type, def]) => <ElementChip key={type} type={type} def={def} />)}
              {!filtered.length && (
                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '30px 0', color: '#94A3B8', fontSize: 12 }}>
                   No components found for "{term}"
                </div>
              )}
            </div>

            {!singleSection && !term && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px dashed #E2E8F0' }}>
                 <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                    Structure
                 </div>
                <button
                  onClick={onAddSection}
                  style={{
                    width: '100%', padding: '12px', background: '#FFFFFF', 
                    border: '1px solid #E2E8F0', borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, 
                    cursor: 'pointer', transition: 'all 0.2s',
                    color: '#475569', fontWeight: 600, fontSize: 12
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.borderColor = '#6366F1'; 
                    e.currentTarget.style.color = '#6366F1';
                    e.currentTarget.style.background = '#EEF2FF';
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.borderColor = '#E2E8F0'; 
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  <Icons.Plus />
                  Add New Section
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                DOM Tree
              </span>
            </div>
            <LayersPanel sections={sections} selectedId={selectedId} elementMap={elementMap} onSelectSection={onSelectSection} onSelectElem={onSelectElem} onSelectCol={onSelectCol} />
          </>
        )}
      </div>
    </div>
  );
}