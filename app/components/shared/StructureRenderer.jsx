/**
 * StructureRenderer.jsx — Renders section/row/col structure for preview & live view.
 *
 * Uses colSettingsToStyle() from lib/ — same function as CanvasColumn edit mode.
 * DRY: no style duplication between edit and preview.
 */
'use client';
import { colSettingsToStyle } from '../../lib/colSettingsToStyle';
import { resolveBgStyle } from '../../lib/bgStyle';


// ── Grid responsive CSS injection (once per grid) ─────────────────────────────
function buildColTemplate(colTemplate, cols) {
  if (colTemplate && colTemplate.length === cols)
    return colTemplate.map(f => `${f}fr`).join(' ');
  return `repeat(${cols}, 1fr)`;
}

function injectGridResponsiveCSS(gridId, desktopCols, tabletCols, mobileCols, colTemplate) {
  if (typeof document === 'undefined') return;
  const id = `sr-grid-${gridId}`;
  let tag = document.getElementById(id);
  if (!tag) { tag = document.createElement('style'); tag.id = id; document.head.appendChild(tag); }
  const desktopTemplate = buildColTemplate(colTemplate, desktopCols);
  tag.textContent = `
    .hb-grid-${gridId} { grid-template-columns: ${desktopTemplate}; }
    @media (max-width: 1024px) {
      .hb-grid-${gridId} { grid-template-columns: repeat(${tabletCols}, 1fr) !important; }
      .hb-grid-${gridId} > * { grid-column: auto !important; grid-row: auto !important; }
    }
    @media (max-width: 640px) {
      .hb-grid-${gridId} { grid-template-columns: repeat(${mobileCols}, 1fr) !important; }
      .hb-grid-${gridId} > * { grid-column: 1 / -1 !important; grid-row: auto !important; }
    }
  `;
}

function GridCellView({ cell, elementMap }) {
  const cs = cell.settings || {};
  const hasBorder = cs.borderStyle && cs.borderStyle !== 'none';
  const shadowMap = { none:'none', sm:'0 1px 3px rgba(0,0,0,0.1)', md:'0 4px 12px rgba(0,0,0,0.1)', lg:'0 10px 24px rgba(0,0,0,0.12)', xl:'0 20px 40px rgba(0,0,0,0.14)' };
  return (
    <div style={{
      gridColumn: `${cell.colStart} / ${cell.colEnd}`,
      gridRow: `${cell.rowStart} / ${cell.rowEnd}`,
      background: cs.bg || undefined,
      paddingTop:    `${cs.padTop ?? 16}px`,
      paddingBottom: `${cs.padBottom ?? 16}px`,
      paddingLeft:   `${cs.padLeft ?? 16}px`,
      paddingRight:  `${cs.padRight ?? 16}px`,
      borderRadius:  cs.radius ? `${cs.radius}px` : undefined,
      boxShadow:     shadowMap[cs.shadow] || 'none',
      border:        hasBorder ? `${cs.borderWidth||1}px ${cs.borderStyle} ${cs.borderColor||'#e2e8f0'}` : undefined,
      minHeight:     cs.minHeight ? `${cs.minHeight}px` : undefined,
      display:       'flex', flexDirection: 'column',
      alignItems:    cs.align || 'flex-start',
      gap:           `${cs.gap ?? 10}px`,
      boxSizing:     'border-box',
    }}>
      {(cell.elements || []).map(el => {
        const def = elementMap?.[el.type];
        if (!def) return null;
        const Comp = def.component;
        return <Comp key={el.id} el={el} />;
      })}
    </div>
  );
}

function GridView({ grid, mode, elementMap }) {
  const s = grid.settings || {};
  if (!s.visible && s.visible !== undefined && mode === 'view') return null;

  injectGridResponsiveCSS(grid.id, s.columns||3, s.tabletColumns ?? 2, s.mobileColumns ?? 1, s.colTemplate);

  const innerStyle = s.widthMode === 'full'
    ? { width: '100%' }
    : { maxWidth: `${s.maxWidth || 1280}px`, margin: '0 auto', width: '100%' };

  return (
    <div style={{
      background: s.bg || undefined,
      paddingTop:    `${s.padTop ?? 16}px`,
      paddingBottom: `${s.padBottom ?? 16}px`,
      paddingLeft:   `${s.padLeft ?? 16}px`,
      paddingRight:  `${s.padRight ?? 16}px`,
      boxSizing: 'border-box',
    }}>
      <div
        className={`hb-grid-${grid.id}`}
        style={{
          display: 'grid',
          gridTemplateColumns: buildColTemplate(s.colTemplate, s.columns||3),
          gridTemplateRows: `repeat(${s.rows || 2}, auto)`,
          gap: `${s.rowGap ?? 16}px ${s.colGap ?? 16}px`,
          ...innerStyle,
        }}
      >
        {(grid.cells || []).map(cell => (
          <GridCellView key={cell.id} cell={cell} elementMap={elementMap} />
        ))}
      </div>
    </div>
  );
}

export function StructureRenderer({ data, mode = 'view', elementMap, selectedId, onSelectEl }) {
  if (!data?.sections) return null;
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

  // Inject custom CSS into <head> for this section
  const styleId = `sr-custom-${section.id}`;
  if (typeof document !== 'undefined') {
    let tag = document.getElementById(styleId);
    if (s.customCss && s.customClass) {
      if (!tag) { tag = document.createElement('style'); tag.id = styleId; document.head.appendChild(tag); }
      tag.textContent = s.customCss;
    } else {
      tag?.remove();
    }
  }

  const extraClass = s.customClass ? ` ${s.customClass}` : '';

  return (
    <section
      className={`hb-section${extraClass}`}
      style={{
        ...sectionBgStyle(s),
        paddingTop:    `${s.padTop    ?? s.padV ?? 0}px`,
        paddingBottom: `${s.padBottom ?? s.padV ?? 0}px`,
        paddingLeft:   `${s.padLeft  ?? s.padH ?? 0}px`,
        paddingRight:  `${s.padRight ?? s.padH ?? 0}px`,
        marginTop:    s.marginTop    ? `${s.marginTop}px`    : undefined,
        marginBottom: s.marginBottom ? `${s.marginBottom}px` : undefined,
        minHeight: s.minHeight ? `${s.minHeight}px` : undefined,
        borderRadius: s.radius ? `${s.radius}px` : undefined,
        border: s.borderStyle && s.borderStyle !== 'none'
          ? `${s.borderWidth || 1}px ${s.borderStyle} ${s.borderColor || '#e2e8f0'}`
          : undefined,
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        width: '100%',
        color: s.theme === 'dark' ? '#f1f5f9' : undefined,
      }}
    >
      {(section.rows || []).map(row =>
        row.type === 'grid'
          ? <GridView key={row.id} grid={row} mode={mode} elementMap={elementMap} />
          : <RowView key={row.id} row={row} mode={mode} elementMap={elementMap} selectedId={selectedId} onSelectEl={onSelectEl} />
      )}
    </section>
  );
}

function RowView({ row, mode, elementMap, selectedId, onSelectEl }) {
  const s = row.settings || {};
  if (!s.visible && mode === 'view') return null;

  // Width
  let innerMaxW;
  if (s.widthMode === 'full') innerMaxW = '100%';
  else if (s.widthMode === 'custom') innerMaxW = `${s.customWidth || 900}px`;
  else innerMaxW = `min(${s.maxWidth || 1280}px, 100%)`;

  // Padding (new 4-side, fallback to old padH/padV)
  const pt = +(s.padTop    ?? s.padV ?? 0);
  const pb = +(s.padBottom ?? s.padV ?? 0);
  const pl = +(s.padLeft   ?? s.padH ?? 32);
  const pr = +(s.padRight  ?? s.padH ?? 32);

  // Margin
  const mt = +(s.marginTop    ?? 0);
  const mb = +(s.marginBottom ?? 0);
  const ml = +(s.marginLeft   ?? 0);
  const mr = +(s.marginRight  ?? 0);

  // Vertical align
  const valignMap = { top: 'flex-start', middle: 'center', bottom: 'flex-end', stretch: 'stretch' };
  const alignItems = valignMap[s.valign || 'middle'] || 'center';

  // Inject custom CSS
  const styleId = `sr-row-custom-${row.id}`;
  if (typeof document !== 'undefined') {
    let tag = document.getElementById(styleId);
    if (s.customCss && s.customClass) {
      if (!tag) { tag = document.createElement('style'); tag.id = styleId; document.head.appendChild(tag); }
      tag.textContent = s.customCss;
    } else { tag?.remove(); }
  }

  const extraClass = s.customClass ? ` ${s.customClass}` : '';

  const wrapStyle = {
    ...rowBgStyle(s),
    position: 'relative', boxSizing: 'border-box', width: '100%',
    borderRadius: s.radius ? `${s.radius}px` : undefined,
    border: s.borderStyle && s.borderStyle !== 'none'
      ? `${s.borderWidth || 1}px ${s.borderStyle} ${s.borderColor || '#e2e8f0'}` : undefined,
    marginTop:    mt ? `${mt}px` : undefined,
    marginBottom: mb ? `${mb}px` : undefined,
    marginLeft:   ml ? `${ml}px` : undefined,
    marginRight:  mr ? `${mr}px` : undefined,
  };

  return (
    <div className={`hb-row-wrap${extraClass}${s.forceColsMobile ? ' hb-force-cols-row' : ''}`} style={wrapStyle}>
      <div
        className="hb-row-inner"
        style={{
          width: innerMaxW, margin: '0 auto',
          paddingTop: `${pt}px`, paddingBottom: `${pb}px`,
          paddingLeft: `${pl}px`, paddingRight: `${pr}px`,
          minHeight: s.height || 'auto',
          display: 'flex', alignItems,
          justifyContent: s.halign || 'center',
          boxSizing: 'border-box',
        }}
      >
        {(row.columns || []).length === 0 ? null : (
          <div
            className={`hb-cols-wrap${s.forceColsMobile ? ' hb-force-cols' : ''}`}
            style={{ gap: s.colGap ?? 12, display: 'flex', flexDirection: 'row', width: '100%' }}
          >
            {row.columns.map((col, i) => {
              const w = row.colWidths?.[i] ?? (100 / row.columns.length);
              const isLast = i === row.columns.length - 1;
              return (
                <div
                  key={col.id}
                  className="hb-col-item"
                  style={{
                    flex: w, minWidth: 0,
                    borderRight: (s.colStyle === 'divided' || s.colStyle === 'dash') && !isLast
                      ? `1.5px ${s.colStyle === 'dash' ? 'dashed' : 'solid'} ${s.colDividerColor || '#e2e8f0'}`
                      : undefined,
                    paddingRight: (s.colStyle === 'divided' || s.colStyle === 'dash') && !isLast
                      ? `${(s.colGap ?? 12) / 2}px` : undefined,
                    paddingLeft: (s.colStyle === 'divided' || s.colStyle === 'dash') && i > 0
                      ? `${(s.colGap ?? 12) / 2}px` : undefined,
                  }}
                >
                  <ColView col={col} depth={0} mode={mode}
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

/**
 * Recursive ColView — mirrors CanvasColumn structure.
 * Applies colSettingsToStyle() for consistent preview styling.
 */
function ColView({ col, depth, mode, elementMap, selectedId, onSelectEl }) {
  const s     = col.settings || {};
  const isHRow = Array.isArray(col.columns) && col.columns.length > 0;
  const isVRows = !isHRow && Array.isArray(col.subRows) && col.subRows.length > 0;

  const style = colSettingsToStyle(s, { depth, isRow: isHRow });

  // Horizontal sub-cols
  if (isHRow) {
    return (
      <div className="hb-col-inner hb-cols-wrap" style={{ ...style, display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: s.gap ?? 8, width: '100%', padding: `${Math.max(2, 6 - depth)}px` }}>
        {col.columns.map((subCol, i) => {
          const w = col.colWidths?.[i] ?? (100 / col.columns.length);
          return (
            <div key={subCol.id} className="hb-col-item" style={{ flex: w }}>
              <ColView col={subCol} depth={depth + 1} mode={mode} elementMap={elementMap} selectedId={selectedId} onSelectEl={onSelectEl} />
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical sub-rows
  if (isVRows) {
    return (
      <div className="hb-col-inner hb-subrows" style={{ ...style, display: 'flex', flexDirection: 'column', width: '100%', gap: 0, padding: 0 }}>
        {col.subRows.map(sr => (
          <div key={sr.id} className="hb-subrow" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            {(sr.columns || []).map((subCol, i) => {
              const w = sr.colWidths?.[i] ?? (100 / sr.columns.length);
              return (
                <div key={subCol.id} style={{ flex: w, minWidth: 0 }}>
                  <ColView col={subCol} depth={depth + 1} mode={mode} elementMap={elementMap} selectedId={selectedId} onSelectEl={onSelectEl} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // Leaf column — render elements
  return (
    <div className="hb-col-inner" style={{ ...style, display: 'flex', flexDirection: 'column', alignItems: s.valign === 'center' ? 'center' : s.valign === 'bottom' ? 'flex-end' : (s.align || 'flex-start') }}>
      {(col.elements || []).map(el => {
        if (!elementMap) return null;
        const def  = elementMap[el.type];
        if (!def) return null;
        const Comp = def.component;
        return (
          <div key={el.id} className="hb-el-wrap" style={{ width: '100%' }}>
            <Comp props={el.props} mode={mode} isSelected={selectedId === el.id} onSelect={() => onSelectEl?.(el.id)} />
          </div>
        );
      })}
    </div>
  );
}

// ── Background helpers (for section & row) ────────────────────────────────────
function sectionBgStyle(s) {
  return resolveBgStyle(s, 'transparent');
}

function rowBgStyle(s) {
  return resolveBgStyle(s, '#ffffff');
}
