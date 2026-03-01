'use client';
import { useEffect, useRef, useState } from 'react';
import { Trash2, Plus, Columns3, Minus, Eye, EyeOff, Copy } from 'lucide-react';
import { T } from '../../constants/theme';
import { resolveBgStyle } from '../../lib/bgStyle';
import { CanvasColumn } from './CanvasColumn';
import { ResizableGrid } from './ResizableGrid';

// ── inject custom CSS from row.settings once per class ──────────────────────
function useRowCss(rowId, className, css) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const id = `row-custom-${rowId}`;
    let tag = document.getElementById(id);
    if (!css || !className) { tag?.remove(); return; }
    if (!tag) { tag = document.createElement('style'); tag.id = id; document.head.appendChild(tag); }
    tag.textContent = css;
    return () => { document.getElementById(id)?.remove(); };
  }, [rowId, className, css]);
}

// ── TinyBtn ───────────────────────────────────────────────────────────────────
function TinyBtn({ onClick, title, color, bg, children }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      title={title}
      style={{ width:22, height:22, border:'none', background:bg||'#f1f5f9', color:color||'#64748b', borderRadius:5, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 1px 3px rgba(0,0,0,0.08)', transition:'transform 0.1s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}
function Divider() {
  return <div style={{ width:1, height:14, background:'#e2e8f0', margin:'0 1px', flexShrink:0 }} />;
}

// ── RowCornerToolbar ──────────────────────────────────────────────────────────
function RowCornerToolbar({ s, row, isFirst, onUpdateRow, onAddCol, onDeleteCol, onDeleteRow, onAddRow, onSelectRow, onDuplicateRow }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{ position:'absolute', top:4, right:4, zIndex:300, display:'flex', alignItems:'center', gap:2 }}
      onClick={e => e.stopPropagation()}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div style={{ display:'flex', alignItems:'center', gap:2, overflow:'hidden', maxWidth:expanded?260:0, opacity:expanded?1:0, transition:'max-width 0.18s ease, opacity 0.14s ease', pointerEvents:expanded?'auto':'none' }}>
        <TinyBtn onClick={() => onUpdateRow?.({ visible: !(s.visible ?? true) })} title={s.visible !== false ? 'Hide Row' : 'Show Row'} color="#64748b" bg="#f1f5f9">
          {s.visible !== false ? <Eye size={11} /> : <EyeOff size={11} />}
        </TinyBtn>
        <Divider />
        <TinyBtn onClick={onAddCol} title="Add Column" color={T.primary} bg={`${T.primary}12`}><Columns3 size={11} /></TinyBtn>
        {row.columns.length > 0 && <TinyBtn onClick={onDeleteCol} title="Remove Last Column" color="#f59e0b" bg="#fffbeb"><Minus size={11} /></TinyBtn>}
        <Divider />
        <TinyBtn onClick={onAddRow} title="Add Row Below" color={T.primary} bg={`${T.primary}12`}><Plus size={11} /></TinyBtn>
        <TinyBtn onClick={onDuplicateRow} title="Duplicate Row" color="#10b981" bg="#f0fdf4"><Copy size={10} /></TinyBtn>
        <Divider />
        {isFirst
          ? <button disabled title="Cannot delete the first row." style={{ width:22, height:22, border:'none', background:'#f1f5f9', color:'#cbd5e1', borderRadius:5, cursor:'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Trash2 size={10} /></button>
          : <TinyBtn onClick={onDeleteRow} title="Delete Row" color="#ef4444" bg="#fee2e2"><Trash2 size={10} /></TinyBtn>
        }
      </div>
      <span
        onClick={e => { e.stopPropagation(); onSelectRow?.(); }}
        title="Select Row"
        style={{ fontSize:8, fontWeight:800, color:'#10b981', background:'#ecfdf5', border:'1px solid #10b98130', padding:'2px 6px', borderRadius:4, cursor:'pointer', userSelect:'none', whiteSpace:'nowrap', lineHeight:1.4, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', transition:'background 0.12s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#d1fae5'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#ecfdf5'; }}
      >
        {s.label ? s.label.toUpperCase().slice(0, 8) : 'ROW'}
      </span>
    </div>
  );
}

// ── ColStyleWrapper — applies divider lines between columns ──────────────────
function ColStyleWrapper({ colStyle, colDividerColor, children }) {
  if (!colStyle || colStyle === 'normal') return <>{children}</>;
  const borderStyle = colStyle === 'dash' ? 'dashed' : 'solid';
  const color = colDividerColor || '#e2e8f0';
  const kids = Array.isArray(children) ? children : [children];
  return (
    <>
      {kids.map((child, i) => (
        <div
          key={i}
          style={{
            flex: 1, minWidth: 0,
            borderRight: i < kids.length - 1 ? `1.5px ${borderStyle} ${color}` : 'none',
            paddingRight: i < kids.length - 1 ? 8 : 0,
          }}
        >
          {child}
        </div>
      ))}
    </>
  );
}

// ── Main CanvasRow ────────────────────────────────────────────────────────────
export function CanvasRow({
  row, secId, selectedId, selectedColId, elementMap,
  onSelectEl, onSelectCol, onSelectRow, onAddRow, onDeleteRow,
  onAddCol, onDeleteCol, onUpdateRow, onDuplicateRow, onResize,
  onAddElement, onMoveEl, onReorderEl, onDuplicateEl, onDeleteEl,
  isFirst, onOpenColModal, onDeleteSubCol, onClearNesting,
  onResizeSubCols, onSelectSubCol, onAddSubRow, onDeleteSubRow,
  onAddSubRowCol, onDeleteSubRowCol, onResizeSubRowCols, onClearSubRows,
  isMobile, onUpdateCol, onUpdateSubCol, onSelectSubRow,
}) {
  const [hovered, setHovered] = useState(false);
  const s = row.settings || {};

  // inject custom CSS
  useRowCss(row.id, s.customClass, s.customCss);

  // ── Width ──
  let innerMaxW;
  if (s.widthMode === 'full') innerMaxW = '100%';
  else if (s.widthMode === 'custom') innerMaxW = `${s.customWidth || 900}px`;
  else innerMaxW = `min(${s.maxWidth || 1280}px, 100%)`;

  // ── Vertical align → alignItems ──
  const valignMap = { top: 'flex-start', middle: 'center', bottom: 'flex-end', stretch: 'stretch' };
  const alignItems = valignMap[s.valign || 'middle'] || 'center';

  // ── Padding (4-side, fallback to old padH/padV) ──
  const pt = +(s.padTop    ?? s.padV ?? 0);
  const pb = +(s.padBottom ?? s.padV ?? 0);
  const pl = +(s.padLeft   ?? s.padH ?? 32);
  const pr = +(s.padRight  ?? s.padH ?? 32);

  // ── Margin ──
  const mt = +(s.marginTop    ?? 0);
  const mb = +(s.marginBottom ?? 0);
  const ml = +(s.marginLeft   ?? 0);
  const mr = +(s.marginRight  ?? 0);

  // ── column depth hover style (injected per-row) ──
  const depthCss = s.colDepthHover ? `
    [data-row-id="${row.id}"] .col-depth-hover:hover {
      box-shadow: 0 ${Math.round(s.colDepthIntensity * 0.2 || 8)}px ${Math.round(s.colDepthIntensity * 0.6 || 24)}px rgba(0,0,0,${(s.colDepthIntensity || 40) / 400});
      transform: translateY(-2px);
      transition: box-shadow 0.2s, transform 0.2s;
    }
  ` : '';

  const rowWrapStyle = {
    ...resolveBgStyle(s, 'transparent'),
    position: 'relative',
    flexShrink: 0,
    borderRadius: s.radius ? `${s.radius}px` : undefined,
    border: s.borderStyle && s.borderStyle !== 'none'
      ? `${s.borderWidth || 1}px ${s.borderStyle} ${s.borderColor || '#E2E8F0'}`
      : undefined,
    marginTop:    mt ? `${mt}px` : undefined,
    marginBottom: mb ? `${mb}px` : 2,
    marginLeft:   ml ? `${ml}px` : undefined,
    marginRight:  mr ? `${mr}px` : undefined,
    outline: hovered ? `1px solid ${T.primary}25` : '1px solid transparent',
    outlineOffset: -1,
    transition: 'outline 0.2s',
    overflow: 'visible',
  };

  const innerStyle = {
    minHeight: s.height || 60,
    width: innerMaxW,
    margin: '0 auto',
    paddingTop:    isMobile ? `${Math.min(pt, 24)}px` : `${pt}px`,
    paddingBottom: isMobile ? `${Math.min(pb, 24)}px` : `${pb}px`,
    paddingLeft:   isMobile ? `${Math.min(pl, 16)}px` : `${pl}px`,
    paddingRight:  isMobile ? `${Math.min(pr, 16)}px` : `${pr}px`,
    display: 'flex',
    alignItems: isMobile && !s.forceColsMobile ? 'flex-start' : alignItems,
    justifyContent: s.halign || 'center',
    flexDirection: isMobile && !s.forceColsMobile ? 'column' : 'row',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1,
  };

  const extraClass = s.customClass || '';

  return (
    <div
      data-row-id={row.id}
      className={extraClass || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(() => setHovered(false), 2000)}
      onClick={e => { e.stopPropagation(); onSelectRow?.(); }}
      style={rowWrapStyle}
    >
      {/* inject col depth hover css */}
      {depthCss && <style>{depthCss}</style>}

      {/* Corner toolbar */}
      {hovered && (
        <RowCornerToolbar
          s={s} row={row} isFirst={isFirst}
          onUpdateRow={onUpdateRow}
          onAddCol={onAddCol}
          onDeleteCol={onDeleteCol}
          onDeleteRow={onDeleteRow}
          onAddRow={onAddRow}
          onSelectRow={onSelectRow}
          onDuplicateRow={onDuplicateRow}
        />
      )}

      {/* Row content */}
      <div style={innerStyle}>
        {row.columns.length === 0 ? (
          <div
            onClick={e => { e.stopPropagation(); onAddCol(); }}
            style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', minHeight:50, border:'2px dashed #cbd5e1', borderRadius:12, background:'#f8fafc', cursor:'pointer', transition:'all 0.2s', color:'#94a3b8', gap:8 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; e.currentTarget.style.background = `${T.primary}05`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }}
          >
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #e2e8f0' }}>
              <Plus size={15} />
            </div>
            <span style={{ fontSize:12, fontWeight:600 }}>Add a Column</span>
          </div>
        ) : s.colStyle && s.colStyle !== 'normal' ? (
          // divided / dash — render columns with divider borders (no resize handles)
          <div style={{ display:'flex', flex:1, width:'100%', gap: isMobile && !s.forceColsMobile ? 0 : (s.colGap ?? 12), flexDirection: isMobile && !s.forceColsMobile ? 'column' : 'row' }}>
            {row.columns.map((col, i) => (
              <div
                key={col.id}
                className={s.colDepthHover ? 'col-depth-hover' : undefined}
                style={{
                  flex: isMobile && !s.forceColsMobile ? 'none' : (row.colWidths?.[i] ?? (100 / row.columns.length)),
                  width: isMobile && !s.forceColsMobile ? '100%' : undefined,
                  minWidth: 0,
                  borderRight: !isMobile && i < row.columns.length - 1
                    ? `1.5px ${s.colStyle === 'dash' ? 'dashed' : 'solid'} ${s.colDividerColor || '#e2e8f0'}`
                    : 'none',
                  paddingRight: !isMobile && i < row.columns.length - 1 ? (s.colGap ?? 12) / 2 : 0,
                  paddingLeft:  !isMobile && i > 0 ? (s.colGap ?? 12) / 2 : 0,
                  marginBottom: isMobile && !s.forceColsMobile ? 16 : 0,
                }}
              >
                <CanvasColumn
                  col={col} rowId={row.id} secId={secId}
                  selectedId={selectedId} selectedColId={selectedColId}
                  elementMap={elementMap}
                  onSelectEl={onSelectEl} onSelectCol={onSelectCol}
                  onAddElement={onAddElement} onMoveEl={onMoveEl}
                  onReorderEl={onReorderEl} onDuplicateEl={onDuplicateEl} onDeleteEl={onDeleteEl}
                  onOpenColModal={onOpenColModal}
                  onDeleteSubCol={onDeleteSubCol} onClearNesting={onClearNesting}
                  onResizeSubCols={onResizeSubCols} onSelectSubCol={onSelectSubCol}
                  onAddSubRow={onAddSubRow} onDeleteSubRow={onDeleteSubRow}
                  onAddSubRowCol={onAddSubRowCol} onDeleteSubRowCol={onDeleteSubRowCol}
                  onResizeSubRowCols={onResizeSubRowCols} onClearSubRows={onClearSubRows}
                  onUpdateCol={onUpdateCol} onUpdateSubCol={onUpdateSubCol}
                  onSelectSubRow={onSelectSubRow}
                />
              </div>
            ))}
          </div>
        ) : isMobile && !s.forceColsMobile ? (
          // Mobile preview: stack columns vertically
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 16 }}>
            {row.columns.map(col => (
              <div key={col.id} className={s.colDepthHover ? 'col-depth-hover' : undefined} style={{ width: '100%' }}>
                <CanvasColumn
                  col={col} rowId={row.id} secId={secId}
                  selectedId={selectedId} selectedColId={selectedColId}
                  elementMap={elementMap}
                  onSelectEl={onSelectEl} onSelectCol={onSelectCol}
                  onAddElement={onAddElement} onMoveEl={onMoveEl}
                  onReorderEl={onReorderEl} onDuplicateEl={onDuplicateEl} onDeleteEl={onDeleteEl}
                  onOpenColModal={onOpenColModal}
                  onDeleteSubCol={onDeleteSubCol} onClearNesting={onClearNesting}
                  onResizeSubCols={onResizeSubCols} onSelectSubCol={onSelectSubCol}
                  onAddSubRow={onAddSubRow} onDeleteSubRow={onDeleteSubRow}
                  onAddSubRowCol={onAddSubRowCol} onDeleteSubRowCol={onDeleteSubRowCol}
                  onResizeSubRowCols={onResizeSubRowCols} onClearSubRows={onClearSubRows}
                  onUpdateCol={onUpdateCol} onUpdateSubCol={onUpdateSubCol}
                  onSelectSubRow={onSelectSubRow}
                />
              </div>
            ))}
          </div>
        ) : (
          <ResizableGrid columns={row.columns} colWidths={row.colWidths} gap={s.colGap ?? 12} onResize={onResize} containerId={row.id}>
            {row.columns.map(col => (
              <div key={col.id} className={s.colDepthHover ? 'col-depth-hover' : undefined} style={{ height:'100%' }}>
                <CanvasColumn
                  col={col} rowId={row.id} secId={secId}
                  selectedId={selectedId} selectedColId={selectedColId}
                  elementMap={elementMap}
                  onSelectEl={onSelectEl} onSelectCol={onSelectCol}
                  onAddElement={onAddElement} onMoveEl={onMoveEl}
                  onReorderEl={onReorderEl} onDuplicateEl={onDuplicateEl} onDeleteEl={onDeleteEl}
                  onOpenColModal={onOpenColModal}
                  onDeleteSubCol={onDeleteSubCol} onClearNesting={onClearNesting}
                  onResizeSubCols={onResizeSubCols} onSelectSubCol={onSelectSubCol}
                  onAddSubRow={onAddSubRow} onDeleteSubRow={onDeleteSubRow}
                  onAddSubRowCol={onAddSubRowCol} onDeleteSubRowCol={onDeleteSubRowCol}
                  onResizeSubRowCols={onResizeSubRowCols} onClearSubRows={onClearSubRows}
                  onUpdateCol={onUpdateCol} onUpdateSubCol={onUpdateSubCol}
                  onSelectSubRow={onSelectSubRow}
                />
              </div>
            ))}
          </ResizableGrid>
        )}
      </div>
    </div>
  );
}
