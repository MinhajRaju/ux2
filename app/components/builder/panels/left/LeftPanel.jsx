'use client';
import { useState } from 'react';
import { Icons } from './components/Icons';
import { ElementsTab } from './ElementsTab';
import { LayersPanel } from './LayersPanel';

/**
 * LeftPanel — sidebar with Elements and Layers tabs.
 *
 * Props:
 *  elementMap       – { [type]: def }
 *  sections         – array from store
 *  selectedId       – currently selected id
 *  singleSection    – bool
 *
 *  // Selection callbacks
 *  onSelectSection  – (secId) => void
 *  onSelectElem     – (elId, meta) => void
 *  onSelectCol      – (colId, meta) => void
 *
 *  // Mutation callbacks
 *  onAddSection     – () => void
 *  onDeleteSection  – (secId) => void
 *  onDeleteRow      – (secId, rowId) => void
 *  onDeleteElement  – (elId) => void
 */
export function LeftPanel({
  elementMap,
  sections,
  selectedId,
  singleSection,
  onSelectSection,
  onSelectRow,
  onSelectElem,
  onSelectCol,
  onSelectSubCol,
  onSelectSubRow,
  onAddSection,
  onAddRow,
  onDeleteSection,
  onDeleteRow,
  onDeleteElement,
  onClearNesting,
  onDeleteSubCol,
  onReorderRows,
  onReorderElements,
}) {
  const [tab, setTab] = useState('elements');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);

  const tabs = [
    { id: 'elements', label: 'Elements', icon: <Icons.Components /> },
    { id: 'layers',   label: 'Layers',   icon: <Icons.Layers /> },
  ];

  return (
    <div style={{
      width: 280, height: '100%', background: '#FFFFFF',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid #E2E8F0', fontFamily: 'Inter, sans-serif',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>
          ✦
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Page Builder</h3>
          <p style={{ margin: 0, fontSize: 11, color: '#64748B' }}>Visual Editor</p>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{
          position: 'relative', display: 'flex', alignItems: 'center',
          background: searchFocus ? '#FFFFFF' : '#F1F5F9',
          border: searchFocus ? '1px solid #6366F1' : '1px solid transparent',
          borderRadius: 8, transition: 'all 0.2s ease',
          boxShadow: searchFocus ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
        }}>
          <div style={{ paddingLeft: 10, color: searchFocus ? '#6366F1' : '#94A3B8', display: 'flex' }}>
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            style={{
              width: '100%', padding: '10px 34px 10px 8px',
              border: 'none', background: 'transparent',
              fontSize: 12, outline: 'none', color: '#334155', fontWeight: 500,
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute', right: 8, background: 'none', border: 'none',
                cursor: 'pointer', color: '#94A3B8', display: 'flex', padding: 2, borderRadius: '50%',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
            >
              <Icons.Close />
            </button>
          )}
        </div>
      </div>

      {/* ── Tab switcher ── */}
      <div style={{ padding: '8px 16px' }}>
        <div style={{
          display: 'flex', background: '#F8FAFC', padding: 4,
          borderRadius: 10, border: '1px solid #E2E8F0',
        }}>
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '8px', fontSize: 12, fontWeight: 600,
                  border: 'none', borderRadius: 7, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: active ? '#FFFFFF' : 'transparent',
                  color: active ? '#4F46E5' : '#64748B',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <span style={{ transform: 'scale(0.9)' }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
        {tab === 'elements' ? (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ElementsTab
              elementMap={elementMap}
              searchTerm={searchTerm}
              onAddSection={onAddSection}
              onAddRow={onAddRow}
              hasSections={sections && sections.length > 0}
              singleSection={singleSection}
            />
          </div>
        ) : (
          <>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                DOM Tree
              </span>
            </div>
            <LayersPanel
              sections={sections}
              selectedId={selectedId}
              elementMap={elementMap}
              singleSection={singleSection}
              searchTerm={searchTerm}
              onSelectSection={onSelectSection}
              onSelectRow={onSelectRow}
              onSelectElem={onSelectElem}
              onSelectCol={onSelectCol}
              onSelectSubCol={onSelectSubCol}
              onSelectSubRow={onSelectSubRow}
              onDeleteSection={onDeleteSection}
              onDeleteRow={onDeleteRow}
              onDeleteElement={onDeleteElement}
              onClearNesting={onClearNesting}
              onDeleteSubCol={onDeleteSubCol}
              onReorderRows={onReorderRows}
              onReorderElements={onReorderElements}
            />
          </>
        )}
      </div>
    </div>
  );
}
