'use client';
import { ElementChip } from './components/ElementChip';
import { LayoutCard }  from './components/LayoutCard';

/**
 * "Elements" tab — section-wise grouped element chips.
 */
export function ElementsTab({ elementMap, searchTerm, onAddSection, onAddRow, hasSections, singleSection }) {

  // ── Group config (order + icons) ───────────────────────────
  const GROUP_META = {
    Typography:  { icon: '✏️', accent: '#8B5CF6' },
    Media:       { icon: '🖼',  accent: '#10b981' },
    Interactive: { icon: '👆', accent: '#f59e0b' },
    'E-Commerce':{ icon: '🛍', accent: '#6366f1' },
    Layout:      { icon: '⬜', accent: '#94a3b8' },
    Advanced:    { icon: '⚙️', accent: '#64748b' },
  };
  const GROUP_ORDER = Object.keys(GROUP_META);

  const allEntries = Object.entries(elementMap);

  // ── Search mode ────────────────────────────────────────────
  if (searchTerm) {
    const filtered = allEntries.filter(([, def]) =>
      def.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <div style={{ padding: '16px' }}>
        <SectionHeader color="#94A3B8">
          <span>🔍</span> Search Results ({filtered.length})
        </SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {filtered.map(([type, def]) => <ElementChip key={type} type={type} def={def} />)}
          {!filtered.length && (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '30px 0', color: '#94A3B8', fontSize: 12 }}>
              No elements found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Group entries ──────────────────────────────────────────
  const grouped = {};
  for (const [type, def] of allEntries) {
    const g = def.group || 'Other';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push([type, def]);
  }

  // Ordered groups
  const orderedGroups = [
    ...GROUP_ORDER.filter(g => grouped[g]),
    ...Object.keys(grouped).filter(g => !GROUP_ORDER.includes(g)),
  ];

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Layout section ── */}
      {!singleSection && (
        <div>
          <SectionHeader color="#8B5CF6">
            <span>⬛</span> Layout
          </SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <LayoutCard icon="⬜" label="Section" description="Full-width page section" accentColor="#8B5CF6" onClick={onAddSection} />
            {hasSections && onAddRow && (
              <LayoutCard icon="▤" label="Row" description="Column layout inside a section" accentColor="#6366F1" onClick={onAddRow} />
            )}
          </div>
        </div>
      )}

      {/* ── Element groups ── */}
      {orderedGroups.map(groupName => {
        const meta   = GROUP_META[groupName] || { icon: '•', accent: '#64748b' };
        const items  = grouped[groupName] || [];
        if (!items.length) return null;
        return (
          <div key={groupName}>
            <SectionHeader color={meta.accent}>
              <span>{meta.icon}</span> {groupName}
            </SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {items.map(([type, def]) => <ElementChip key={type} type={type} def={def} />)}
            </div>
          </div>
        );
      })}

    </div>
  );
}

function SectionHeader({ color = '#94A3B8', children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color,
      textTransform: 'uppercase', letterSpacing: '0.06em',
      marginBottom: 10, marginTop: 4,
      display: 'flex', alignItems: 'center', gap: 5,
    }}>
      {children}
    </div>
  );
}
