'use client';
import { ElementChip } from './components/ElementChip';
import { LayoutCard } from './components/LayoutCard';

/**
 * "Elements" tab content.
 * Shows two groups:
 *  1. Layout   — clickable layout block cards (Section, Row, etc.)
 *  2. Elements — draggable element chips
 *
 * Props:
 *  elementMap    – { [type]: { label, icon, color } }
 *  searchTerm    – string for filtering elements
 *  onAddSection  – () => void
 *  onAddRow      – () => void — opens the row presets modal
 *  hasSections   – bool — show Row card only if sections exist
 *  singleSection – bool — hides Layout section if true
 */
export function ElementsTab({ elementMap, searchTerm, onAddSection, onAddRow, hasSections, singleSection }) {
  const filtered = Object.entries(elementMap).filter(([, def]) =>
    def.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SectionHeader = ({ color = '#94A3B8', children }) => (
    <div style={{
      fontSize: 10, fontWeight: 700, color,
      textTransform: 'uppercase', letterSpacing: '0.06em',
      marginBottom: 10, marginTop: 4,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {children}
    </div>
  );

  if (searchTerm) {
    return (
      <div style={{ padding: '16px' }}>
        <SectionHeader>Search Results ({filtered.length})</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {filtered.map(([type, def]) => (
            <ElementChip key={type} type={type} def={def} />
          ))}
          {!filtered.length && (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '30px 0', color: '#94A3B8', fontSize: 12 }}>
              No components found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Layout section ── */}
      {!singleSection && (
        <div>
          <SectionHeader color="#8B5CF6">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            Layout
          </SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <LayoutCard
              icon="⬜"
              label="Section"
              description="Full-width page section"
              accentColor="#8B5CF6"
              onClick={onAddSection}
            />
            {hasSections && onAddRow && (
              <LayoutCard
                icon="▤"
                label="Row"
                description="Column layout inside a section"
                accentColor="#6366F1"
                onClick={onAddRow}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Elements section ── */}
      <div>
        <SectionHeader>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="3" width="8" height="8" rx="2" />
            <rect x="14" y="3" width="8" height="8" rx="2" />
            <rect x="2" y="13" width="8" height="8" rx="2" />
            <rect x="14" y="13" width="8" height="8" rx="2" />
          </svg>
          Elements
        </SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {filtered.map(([type, def]) => (
            <ElementChip key={type} type={type} def={def} />
          ))}
        </div>
      </div>

    </div>
  );
}
