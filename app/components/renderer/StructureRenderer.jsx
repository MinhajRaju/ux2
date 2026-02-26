// src/components/renderer/StructureRenderer.jsx
import { ELEMENT_MAP } from '../builder/elements';
import { rowBgStyle } from '@/lib/propsToStyle';

function renderElement(el) {
  const ElComp = ELEMENT_MAP[el.type];
  if (!ElComp) return null;
  return <ElComp key={el.id} props={el.props} mode="view" />;
}

function renderColumn(col) {
  const s = col.settings || {};
  const gap = s.gap ?? 12;

  let colBg = {};
  if (s.bgType === 'gradient' && s.gradientFrom && s.gradientTo) {
    colBg.background = `linear-gradient(${s.gradientDir || '135deg'}, ${s.gradientFrom}, ${s.gradientTo})`;
  } else if (s.bgType === 'image' && s.bgImage) {
    colBg.backgroundImage = `url(${s.bgImage})`;
    colBg.backgroundSize = s.bgSize || 'cover';
    colBg.backgroundPosition = s.bgPosition || 'center';
  } else if (s.bg) {
    colBg.background = s.bg;
  }

  return (
    <div
      key={col.id}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: s.valign === 'center' ? 'center' : s.valign === 'bottom' ? 'flex-end' : 'flex-start',
        justifyContent: s.align || 'flex-start',
        gap,
        padding: `${s.padV || 0}px ${s.padH || 12}px`,
        boxSizing: 'border-box',
        borderRadius: s.radius ? `${s.radius}px` : 0,
        ...colBg,
      }}
    >
      {col.elements.map(el => renderElement(el))}
    </div>
  );
}

function renderRow(row) {
  const s = row.settings || {};

  if (!s.visible) return null;

  const bg = rowBgStyle(s);
  const maxW = s.widthMode === 'full' ? '100%' : `min(${s.maxWidth || 1280}px, 100%)`;
  const colWidths = row.colWidths || row.columns.map(() => 100 / row.columns.length);

  return (
    <div key={row.id} style={{ ...bg, position: 'relative' }}>
      {/* bg overlay */}
      {s.bgType === 'image' && s.bgOverlay && (
        <div style={{
          position: 'absolute', inset: 0,
          background: s.bgOverlay,
          opacity: (s.bgOverlayOpacity ?? 50) / 100,
          pointerEvents: 'none',
        }} />
      )}
      <div style={{
        width: maxW,
        margin: '0 auto',
        padding: `${s.padV || 16}px ${s.padH || 32}px`,
        display: 'flex',
        alignItems: 'stretch',
        gap: s.colGap || 20,
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}>
        {row.columns.map((col, i) => (
          <div key={col.id} style={{ flex: colWidths[i] || 1, minWidth: 0 }}>
            {renderColumn(col)}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSection(sec) {
  const s = sec.settings || {};

  let sectionBg = {};
  if (s.bgType === 'gradient' && s.gradientFrom && s.gradientTo) {
    sectionBg.background = `linear-gradient(${s.gradientDir || '135deg'}, ${s.gradientFrom}, ${s.gradientTo})`;
  } else if (s.bgType === 'image' && s.bgImage) {
    sectionBg.backgroundImage = `url(${s.bgImage})`;
    sectionBg.backgroundSize = s.bgSize || 'cover';
    sectionBg.backgroundPosition = s.bgPosition || 'center';
    sectionBg.backgroundRepeat = 'no-repeat';
  } else {
    sectionBg.background = s.bg || '#ffffff';
  }

  return (
    <section
      key={sec.id}
      style={{
        ...sectionBg,
        paddingTop: `${s.padTop || 0}px`,
        paddingBottom: `${s.padBottom || 0}px`,
        position: 'relative',
      }}
    >
      {s.bgType === 'image' && s.bgOverlay && (
        <div style={{
          position: 'absolute', inset: 0,
          background: s.bgOverlay,
          opacity: (s.bgOverlayOpacity ?? 40) / 100,
          pointerEvents: 'none',
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {(sec.rows || []).map(row => renderRow(row))}
      </div>
    </section>
  );
}

export function StructureRenderer({ data }) {
  if (!data || !data.sections) return null;
  return <>{data.sections.map(sec => renderSection(sec))}</>;
}
