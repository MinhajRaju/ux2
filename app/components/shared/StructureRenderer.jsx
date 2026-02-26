'use client';

export function StructureRenderer({ data, mode = 'view', elementMap, selectedId, onSelectEl }) {
  if (!data || !data.sections) return null;

  return (
    <>
      {data.sections.map(section => (
        <SectionView key={section.id} section={section} mode={mode}
          elementMap={elementMap} selectedId={selectedId} onSelectEl={onSelectEl} />
      ))}
    </>
  );
}

function SectionView({ section, mode, elementMap, selectedId, onSelectEl }) {
  const s = section.settings || {};
  if (!s.visible && s.visible !== undefined && mode === 'view') return null;

  const bgStyle = getBgStyle(s);

  return (
    <section style={{
      ...bgStyle,
      padding: `${s.padV || 0}px ${s.padH || 0}px`,
      position: 'relative',
    }}>
      {section.rows.map(row => (
        <RowView key={row.id} row={row} mode={mode}
          elementMap={elementMap} selectedId={selectedId} onSelectEl={onSelectEl} />
      ))}
    </section>
  );
}

function RowView({ row, mode, elementMap, selectedId, onSelectEl }) {
  const s = row.settings || {};
  if (!s.visible && mode === 'view') return null;

  const bgStyle = getBgStyle(s);
  const maxW = s.widthMode === 'full' ? '100%' : `min(${s.maxWidth || 1280}px, 100%)`;

  return (
    <div style={{ ...bgStyle, position: 'relative' }}>
      <div style={{
        width: maxW,
        margin: '0 auto',
        padding: `0 ${s.padH || 32}px`,
        minHeight: s.height || 'auto',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        {row.columns.length === 0 && mode === 'view' ? null : (
          <div style={{
            display: 'flex',
            gap: s.colGap || 20,
            width: '100%',
          }}>
            {row.columns.map((col, i) => {
              const w = row.colWidths?.[i] ?? (100 / row.columns.length);
              return (
                <div key={col.id} style={{ flex: w, minWidth: 0 }}>
                  <ColView col={col} rowSettings={s} mode={mode}
                    elementMap={elementMap} selectedId={selectedId} onSelectEl={onSelectEl} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ColView({ col, rowSettings, mode, elementMap, selectedId, onSelectEl }) {
  const s = col.settings || {};
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: s.valign === 'center' ? 'center' : s.valign === 'bottom' ? 'flex-end' : 'flex-start',
      justifyContent: s.align || 'flex-start',
      gap: s.gap ?? rowSettings?.elGap ?? 12,
      padding: `${s.padV || 0}px ${s.padH || 0}px`,
      background: s.bg || 'transparent',
      minHeight: 1,
    }}>
      {col.elements.map(el => {
        if (!elementMap) return null;
        const def = elementMap[el.type];
        if (!def) return null;
        const Component = def.component;
        return (
          <Component
            key={el.id}
            props={el.props}
            mode={mode}
            isSelected={selectedId === el.id}
            onSelect={() => onSelectEl?.(el.id)}
          />
        );
      })}
    </div>
  );
}

function getBgStyle(s) {
  if (s.bgType === 'gradient') {
    return { background: `linear-gradient(${s.gradientDir || '135deg'}, ${s.gradientFrom || '#6366f1'}, ${s.gradientTo || '#a855f7'})` };
  }
  if (s.bgType === 'image' && s.bgImage) {
    return {
      backgroundImage: `url(${s.bgImage})`,
      backgroundSize: s.bgSize || 'cover',
      backgroundPosition: s.bgPosition || 'center',
      backgroundRepeat: 'no-repeat',
    };
  }
  return { background: s.bg || 'transparent' };
}
