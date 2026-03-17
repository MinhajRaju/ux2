'use client';
/**
 * CardDesignerModal — Builder-exact canvas UI for product card design.
 * FIXES:
 *  - Overlay delete bug: overlays section always visible when pd-image exists
 *  - "Add Overlay" button persistent on image columns
 *  - All typography + spacing using shared ui.jsx components
 *  - Clean right panel matching builder style
 */
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, Undo2, Redo2, Plus, Trash2, GripVertical, Copy } from 'lucide-react';
import { useCardDesignerStore } from '../../../store/useCardDesignerStore';
import { pdElementMap, PD_GROUPS, MOCK_PRODUCT, PdImageElement } from './pdElementMap';
import PdElementProps from './PdElementProps';
import { PropSec, ColorPick, SliderInput, Toggle, SegCtrl } from '../../../components/shared/ui';
import { T, depthPalette } from '../../../constants/theme';

// ─────────────────────────────────────────────────────────────────────────────
// LEFT PANEL
// ─────────────────────────────────────────────────────────────────────────────
const GROUP_META = {
  Media:   { icon: '🖼',  accent: '#10b981' },
  Info:    { icon: '📝',  accent: '#6366f1' },
  Actions: { icon: '👆',  accent: '#f59e0b' },
  Overlay: { icon: '🏷️', accent: '#ef4444' },
  Layout:  { icon: '⬜',  accent: '#94a3b8' },
};

function PdChip({ type, def }) {
  const [hover, setHover] = useState(false);
  return (
    <div draggable
      onDragStart={e => { e.dataTransfer.setData('hb-drag', JSON.stringify({ newType: type })); e.dataTransfer.effectAllowed = 'copy'; }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '12px 6px', borderRadius: 10, cursor: 'grab', background: '#fff', border: hover ? `1px solid ${def.color||T.primary}` : '1px solid #e2e8f0', boxShadow: hover ? `0 4px 12px ${def.color||T.primary}20` : '0 1px 2px rgba(0,0,0,0.02)', transform: hover ? 'translateY(-2px)' : 'none', transition: 'all 0.18s', userSelect: 'none', position: 'relative' }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 7, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: hover ? (def.color||T.primary)+'18' : '#f8fafc', color: def.color||'#64748b' }}>{def.icon}</div>
      <span style={{ fontSize: 9, fontWeight: 600, color: '#334155', textAlign: 'center', lineHeight: 1.3 }}>{def.label}</span>
      {def.canOverlay && <span style={{ position: 'absolute', top: 3, right: 3, fontSize: 6, fontWeight: 800, color: '#d97706', background: '#fef3c7', padding: '1px 3px', borderRadius: 2 }}>OV</span>}
    </div>
  );
}

function LeftPanel() {
  return (
    <div style={{ width: 210, flexShrink: 0, background: '#fff', borderRight: `1px solid ${T.border}`, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 12px 2px', fontSize: 10, fontWeight: 800, color: T.textLight, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Elements</div>
      <div style={{ padding: '4px 12px 8px', fontSize: 9, color: T.textLight, lineHeight: 1.5 }}>Drag to card · OV = image overlay</div>
      {PD_GROUPS.map(group => {
        const items = Object.entries(pdElementMap).filter(([, d]) => d.group === group);
        if (!items.length) return null;
        const meta = GROUP_META[group] || { icon: '•', accent: '#64748b' };
        return (
          <div key={group} style={{ padding: '0 12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7, paddingBottom: 4, borderBottom: `1.5px solid ${meta.accent}20` }}>
              <span style={{ fontSize: 11 }}>{meta.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: meta.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{group}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              {items.map(([type, def]) => <PdChip key={type} type={type} def={def} />)}
            </div>
          </div>
        );
      })}
      <div style={{ margin: '0 12px 14px', padding: '8px 10px', background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a', fontSize: 9, color: '#78350f', lineHeight: 1.6 }}>
        <b>OV items</b>: image-এর উপর drag করলে overlay হবে
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLBAR helpers (exact builder dark floating toolbar)
// ─────────────────────────────────────────────────────────────────────────────
function TBBtn({ onClick, title, children, danger, green }) {
  return (
    <button onMouseDown={e => { e.stopPropagation(); e.preventDefault(); onClick?.(); }} title={title}
      style={{ width: 22, height: 22, border: 'none', background: 'transparent', color: danger ? 'rgba(255,100,100,0.7)' : 'rgba(255,255,255,0.65)', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.25)' : green ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = danger ? '#fca5a5' : green ? '#6ee7b7' : '#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = danger ? 'rgba(255,100,100,0.7)' : 'rgba(255,255,255,0.65)'; }}
    >{children}</button>
  );
}
function TBDiv() { return <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />; }

// ─────────────────────────────────────────────────────────────────────────────
// ELEMENT IN CANVAS — exact builder ElementWrapper
// ─────────────────────────────────────────────────────────────────────────────
function ElementInCanvas({ el, colId, rowId, isSelected, overlays, selectedOverlayId, onSelectOverlay, onSelect, onDelete, onMoveUp, onMoveDown, onDuplicate }) {
  const [hovered, setHovered] = useState(false);
  const tbRef = useRef(null);
  const bdRef = useRef(null);
  const def   = pdElementMap[el.type];
  if (!def) return null;
  const Comp = def.component;
  const p = el.props || {};
  const alignFlex = p._align === 'center' ? 'center' : p._align === 'right' ? 'flex-end' : 'flex-start';
  const showCtrl  = hovered || isSelected;

  const onGripStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('hb-drag', JSON.stringify({ elId: el.id, fromColId: colId, fromRowId: rowId }));
    const g = document.createElement('div');
    g.textContent = `⠿ ${def.label}`;
    Object.assign(g.style, { position:'fixed',top:'-200px',left:'-200px',background:'rgba(15,23,42,0.88)',color:'#fff',padding:'4px 10px',borderRadius:'6px',fontSize:'11px',fontWeight:'700',pointerEvents:'none' });
    document.body.appendChild(g);
    e.dataTransfer.setDragImage(g, 0, 10);
    setTimeout(() => g.remove(), 0);
    if (tbRef.current) tbRef.current.style.opacity = '0';
    if (bdRef.current) bdRef.current.style.opacity = '0.35';
  };
  const onGripEnd = () => { if (tbRef.current) tbRef.current.style.opacity = ''; if (bdRef.current) bdRef.current.style.opacity = ''; };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ position: 'relative', width: '100%', minWidth: 0 }}>
      <div ref={tbRef} style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', zIndex: 200, display: showCtrl ? 'flex' : 'none', alignItems: 'center', gap: 2, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '3px 6px', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'auto' }}>
        <div draggable onDragStart={onGripStart} onDragEnd={onGripEnd} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, cursor: 'grab', color: 'rgba(255,255,255,0.55)', borderRight: '1px solid rgba(255,255,255,0.10)', paddingRight: 5, marginRight: 3, flexShrink: 0 }}><GripVertical size={12}/></div>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', paddingRight: 5, borderRight: '1px solid rgba(255,255,255,0.10)', marginRight: 3 }}>{def.label}</span>
        {onMoveUp   && <TBBtn onClick={onMoveUp}   title="Move Up">↑</TBBtn>}
        {onMoveDown && <TBBtn onClick={onMoveDown} title="Move Down">↓</TBBtn>}
        {onDuplicate && <><TBDiv/><TBBtn onClick={onDuplicate} title="Duplicate" green><Copy size={11}/></TBBtn></>}
        {onDelete   && <><TBDiv/><TBBtn onClick={onDelete}   title="Delete" danger><Trash2 size={11}/></TBBtn></>}
      </div>
      <div ref={bdRef} onClick={e => { e.stopPropagation(); onSelect(); }}
        style={{ display: 'flex', justifyContent: alignFlex, paddingTop: (p._padTop ?? 0) + 'px', paddingBottom: (p._padBottom ?? 0) + 'px', paddingLeft: (p._padLeft ?? 0) + 'px', paddingRight: (p._padRight ?? 0) + 'px', cursor: 'default', position: 'relative', width: '100%', outline: isSelected ? `2px solid ${T.primary}` : hovered ? `1.5px dashed ${T.primary}55` : 'none', outlineOffset: 1, borderRadius: 4, transition: 'outline 0.1s', zIndex: isSelected ? 10 : 1, boxSizing: 'border-box' }}
      >
        {el.type === 'pd-image'
          ? <PdImageElement product={MOCK_PRODUCT} props={p} overlays={overlays} onSelectOverlay={onSelectOverlay} selectedOverlayId={selectedOverlayId} designMode />
          : <Comp product={MOCK_PRODUCT} props={p} />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLUMN — COL badge, drop zone, overlay section (always shown if image exists)
// BUG FIX: overlay section shows if hasImage regardless of overlays.length
// ─────────────────────────────────────────────────────────────────────────────
function ColCanvas({ col, colWidth, rowId, totalCols, store, selectedId, selectedIsOverlay }) {
  const [isOver, setIsOver]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const [ovMenuOpen, setOvMenuOpen] = useState(false);
  const p = depthPalette(0);
  const elements = col.elements || [];
  const overlays = col.overlays || [];
  // BUG FIX: show overlay section whenever a pd-image element is in this column
  const hasImage = elements.some(e => e.type === 'pd-image');

  const processDrop = (e, afterIdx) => {
    try {
      const raw = e.dataTransfer.getData('hb-drag');
      if (!raw) return;
      const payload = JSON.parse(raw);
      if (payload.newType) {
        const def = pdElementMap[payload.newType];
        if (!def) return;
        if (def.canOverlay && hasImage && e.altKey) {
          store.addOverlay(rowId, col.id, payload.newType, def.defaultProps || {});
        } else {
          const id = store.addElementAt(rowId, col.id, payload.newType, def.defaultProps || {}, afterIdx ?? elements.length);
          store.setSelected(id, false);
        }
      }
    } catch {}
  };

  const addOverlayType = (type) => {
    const def = pdElementMap[type];
    if (!def) return;
    store.addOverlay(rowId, col.id, type, def.defaultProps || {});
    setOvMenuOpen(false);
  };

  let outline = 'none';
  if (isOver) outline = `2px dashed ${p.accent}`;
  else if (hovered) outline = `1px solid ${p.accent}40`;

  return (
    <div style={{ position: 'relative', flex: `0 0 ${colWidth}%`, maxWidth: `${colWidth}%`, minWidth: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* COL badge */}
      {hovered && (
        <div style={{ position: 'absolute', top: 3, right: 3, zIndex: 400, display: 'flex', alignItems: 'center', gap: 3, fontSize: 8, fontWeight: 800, color: p.accent, background: p.light, border: `1px solid ${p.accent}40`, padding: '2px 5px', borderRadius: 4, userSelect: 'none', lineHeight: 1.4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', pointerEvents: 'none' }}>
          COL {col._ci != null ? col._ci + 1 : ''}
        </div>
      )}
      <div
        onDragOver={e => { e.preventDefault(); e.stopPropagation(); setIsOver(true); }}
        onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setIsOver(false); }}
        onDrop={e => { e.preventDefault(); e.stopPropagation(); setIsOver(false); processDrop(e, elements.length); }}
        style={{ display: 'flex', flexDirection: 'column', gap: (col.settings?.gap ?? 0) + 'px', paddingTop: col.settings?.padTop ?? 0, paddingBottom: col.settings?.padBottom ?? 0, paddingLeft: col.settings?.padLeft ?? 0, paddingRight: col.settings?.padRight ?? 0, minHeight: 48, background: col.settings?.bg || (isOver ? `${p.accent}05` : 'transparent'), outline, outlineOffset: -2, borderRadius: 8, transition: 'outline 0.15s', boxSizing: 'border-box' }}
      >
        {/* ── Overlay strip (always shown when hasImage) ─── BUG FIX ── */}
        {hasImage && (
          <div style={{ background: '#fffbeb', border: '1px dashed #f59e0b', borderRadius: 6, padding: '5px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#92400e' }}>📌 Image Overlays</span>
              <div style={{ position: 'relative' }}>
                <button onClick={e => { e.stopPropagation(); setOvMenuOpen(v => !v); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 6px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 4, fontSize: 8, fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={8}/> Add
                </button>
                {ovMenuOpen && (
                  <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '100%', right: 0, marginTop: 3, background: '#fff', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', zIndex: 600, minWidth: 140 }}>
                    {Object.entries(pdElementMap).filter(([, d]) => d.canOverlay).map(([type, def]) => (
                      <button key={type} onClick={() => addOverlayType(type)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, color: '#334155', textAlign: 'left' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      ><span style={{ color: def.color }}>{def.icon}</span>{def.label}</button>
                    ))}
                    <button onClick={() => setOvMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '5px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 10, color: '#94a3b8', borderTop: '1px solid #f1f5f9' }}>✕ Close</button>
                  </div>
                )}
              </div>
            </div>
            {overlays.length === 0
              ? <div style={{ fontSize: 9, color: '#b45309', fontStyle: 'italic' }}>Alt+Drop or click "+ Add" to place overlay</div>
              : overlays.map(ov => {
                  const ovDef = pdElementMap[ov.type];
                  const isSel = selectedIsOverlay && selectedId === ov.id;
                  return (
                    <div key={ov.id} onClick={e => { e.stopPropagation(); store.setSelected(ov.id, true); }}
                      style={{ marginTop: 3, padding: '3px 6px', borderRadius: 4, background: isSel ? `${T.primary}15` : '#fff', border: `1px solid ${isSel ? T.primary : '#fde68a'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: T.text }}
                    >
                      <span>{ovDef?.icon}</span>
                      <span style={{ flex: 1 }}>{ovDef?.label}</span>
                      <button onClick={e => { e.stopPropagation(); store.deleteOverlay(ov.id); if (selectedId === ov.id) store.clearSelected(); }}
                        style={{ width: 14, height: 14, border: 'none', background: '#fee2e2', color: '#ef4444', borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>✕</button>
                    </div>
                  );
                })
            }
          </div>
        )}

        {/* Elements */}
        {elements.length === 0 ? (
          <div style={{ minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${isOver ? p.accent : '#cbd5e1'}`, borderRadius: 8, background: isOver ? `${p.accent}08` : 'transparent', transition: 'all 0.18s', fontSize: 11, color: isOver ? p.accent : '#94a3b8', fontWeight: isOver ? 600 : 400 }}>
            {isOver ? '+ Drop here' : '· Empty ·'}
          </div>
        ) : (
          elements.map((el, idx, arr) => (
            <ElementInCanvas
              key={el.id} el={el} colId={col.id} rowId={rowId}
              isSelected={!selectedIsOverlay && selectedId === el.id}
              overlays={el.type === 'pd-image' ? overlays : []}
              selectedOverlayId={selectedIsOverlay ? selectedId : null}
              onSelectOverlay={id => store.setSelected(id, true)}
              onSelect={() => store.setSelected(el.id, false)}
              onDelete={() => { store.deleteElement(el.id); store.clearSelected(); }}
              onMoveUp={idx > 0 ? () => store.reorderElementsByIndex(rowId, col.id, idx, idx-1) : null}
              onMoveDown={idx < arr.length-1 ? () => store.reorderElementsByIndex(rowId, col.id, idx, idx+1) : null}
              onDuplicate={() => store.duplicateElementAt(rowId, col.id, el, idx)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW — exact builder RowCornerToolbar style
// ─────────────────────────────────────────────────────────────────────────────
function RowCanvas({ row, rowIdx, totalRows, store, selectedId, selectedIsOverlay, isDense }) {
  const [hov, setHov]     = useState(false);
  const [exp, setExp]     = useState(false);
  const rs = row.settings || {};
  const pT = isDense ? Math.max(0,(rs.padTop??0)-4)  : (rs.padTop??0);
  const pB = isDense ? Math.max(0,(rs.padBottom??0)-4): (rs.padBottom??0);
  const pL = rs.padLeft ?? rs.padH ?? 0;
  const pR = rs.padRight ?? rs.padH ?? 0;

  const IB = (color, bg) => ({ width:22, height:22, border:'none', background: bg||`${color}18`, color, borderRadius:5, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.08)', transition:'transform 0.1s' });

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', borderBottom: rowIdx < totalRows-1 ? `1px dashed ${hov ? '#10b98140' : '#f1f5f9'}` : 'none', transition: 'border-color 0.15s' }}
    >
      {/* ROW toolbar */}
      {hov && (
        <div style={{ position:'absolute', top:4, right:4, zIndex:500, display:'flex', alignItems:'center', gap:2 }} onClick={e => e.stopPropagation()} onMouseEnter={() => setExp(true)} onMouseLeave={() => setExp(false)}>
          <div style={{ display:'flex', alignItems:'center', gap:2, overflow:'hidden', maxWidth: exp ? 220 : 0, opacity: exp ? 1 : 0, transition:'max-width 0.18s ease, opacity 0.14s ease', pointerEvents: exp ? 'auto' : 'none' }}>
            <button onClick={() => store.splitRowColumn(row.id)} title="Add Column" style={IB(T.primary,`${T.primary}12`)} onMouseEnter={e => e.currentTarget.style.transform='scale(1.12)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}><Plus size={10}/></button>
            {row.columns.length > 1 && <button onClick={() => store.deleteColumn(row.id, row.columns[row.columns.length-1].id)} title="Remove Last Col" style={IB('#f59e0b','#fffbeb')} onMouseEnter={e => e.currentTarget.style.transform='scale(1.12)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}><span style={{fontSize:14,lineHeight:1}}>−</span></button>}
            <button onClick={() => store.addRowBelow(row.id)} title="Add Row Below" style={IB('#10b981','#f0fdf4')} onMouseEnter={e => e.currentTarget.style.transform='scale(1.12)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}><Plus size={10}/></button>
            <div style={{width:1,height:14,background:'#e2e8f0',margin:'0 1px'}}/>
            {totalRows > 1 && <button onClick={() => store.deleteRow(row.id)} title="Delete Row" style={IB('#ef4444','#fee2e2')} onMouseEnter={e => e.currentTarget.style.transform='scale(1.12)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}><Trash2 size={10}/></button>}
          </div>
          <span style={{ fontSize:8, fontWeight:800, color:'#10b981', background:'#ecfdf5', border:'1px solid #10b98130', padding:'2px 6px', borderRadius:4, cursor:'default', userSelect:'none', whiteSpace:'nowrap', lineHeight:1.4, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>ROW {rowIdx+1} · {row.columns.length}col</span>
        </div>
      )}
      <div style={{ display:'flex', flexDirection:'row', gap:(rs.colGap||0)+'px', paddingTop: pT, paddingBottom: pB, paddingLeft: pL, paddingRight: pR }}>
        {row.columns.map((col, ci) => (
          <ColCanvas key={col.id} col={{ ...col, _ci: ci }} colWidth={row.colWidths?.[ci]??100} rowId={row.id} totalCols={row.columns.length} store={store} selectedId={selectedId} selectedIsOverlay={selectedIsOverlay} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function CardCanvas({ template, store, selectedId, selectedIsOverlay, isDense }) {
  if (!template?.rows?.length) return (
    <div style={{ padding: 28, textAlign: 'center', border: `2px dashed ${T.border}`, borderRadius: 12 }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>📋</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 8 }}>Empty Card</div>
      <button onClick={store.addRow} style={{ padding: '7px 16px', background: T.primary, color: '#fff', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}><Plus size={11}/> Add Row</button>
    </div>
  );
  return (
    <div style={{ background: template.cardBg||'#ffffff', borderRadius: (template.cardRadius??12)+'px', border: `1px solid ${template.cardBorder||'#e2e8f0'}`, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'visible', display: 'flex', flexDirection: 'column' }}>
      {template.rows.map((row, idx) => (
        <RowCanvas key={row.id} row={row} rowIdx={idx} totalRows={template.rows.length} store={store} selectedId={selectedId} selectedIsOverlay={selectedIsOverlay} isDense={isDense} />
      ))}
      <button onClick={store.addRow} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'7px 0', margin:'4px 8px 8px', fontSize:10, fontWeight:700, color:T.primary, background:`${T.primary}08`, border:`1.5px dashed ${T.primary}50`, borderRadius:7, cursor:'pointer' }} onMouseEnter={e => e.currentTarget.style.background=`${T.primary}15`} onMouseLeave={e => e.currentTarget.style.background=`${T.primary}08`}><Plus size={10}/> Add Row</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RIGHT PANEL — builder-exact style, using shared PropSec, ColorPick, SliderInput
// ─────────────────────────────────────────────────────────────────────────────
function RightPanelContent({ template, selectedEl, selectedIsOverlay, store }) {
  // Card-level settings (nothing selected)
  if (!selectedEl) return (
    <div style={{ overflowY: 'auto', flex: 1 }}>
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 700, color: T.text, background: '#fff', position: 'sticky', top: 0 }}>Card Settings</div>
      <div style={{ padding: '14px' }}>
        <PropSec title="Style Density">
          <div style={{ display: 'flex', gap: 6 }}>
            {['normal','dense'].map(m => (
              <button key={m} onClick={() => store.updateCard({ density: m })} style={{ flex: 1, padding: '7px 0', borderRadius: 7, fontSize: 11, fontWeight: 600, border: `1.5px solid ${(template.density||'normal')===m ? T.primary : T.border}`, background: (template.density||'normal')===m ? `${T.primary}12` : '#fff', color: (template.density||'normal')===m ? T.primary : T.textMid, cursor: 'pointer' }}>
                {m === 'dense' ? '⊠ Dense' : '☐ Normal'}
              </button>
            ))}
          </div>
        </PropSec>
        <PropSec title="Card Style">
          <ColorPick label="Background" val={template.cardBg||'#ffffff'} set={v => store.updateCard({ cardBg: v })} />
          <ColorPick label="Border Color" val={template.cardBorder||'#e2e8f0'} set={v => store.updateCard({ cardBorder: v })} />
          <SliderInput label="Border Radius" val={template.cardRadius??12} set={v => store.updateCard({ cardRadius: v })} min={0} max={32} unit="px" />
        </PropSec>
        <div style={{ padding: '10px 12px', background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd', fontSize: 10, color: '#0369a1', lineHeight: 1.6 }}>
          💡 Card-এ কোনো element click করো প্রপস দেখতে
        </div>
      </div>
    </div>
  );

  const def = pdElementMap[selectedEl.type];
  return (
    <div style={{ overflowY: 'auto', flex: 1 }}>
      {/* Sticky header */}
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ fontSize: 18 }}>{def?.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{def?.label}</div>
          <div style={{ fontSize: 9, color: T.textLight }}>{selectedIsOverlay ? '📌 Overlay on image' : '📦 Column element'}</div>
        </div>
        <button onClick={() => { selectedIsOverlay ? store.deleteOverlay(selectedEl.id) : store.deleteElement(selectedEl.id); store.clearSelected(); }} style={{ width: 24, height: 24, border: 'none', background: '#fee2e2', color: '#ef4444', borderRadius: 5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={12}/></button>
      </div>
      <div style={{ padding: '10px 14px' }}>
        <PdElementProps
          elementType={selectedEl.type}
          props={selectedEl.props}
          onChange={patch => selectedIsOverlay ? store.updateOverlay(selectedEl.id, patch) : store.updateElement(selectedEl.id, patch)}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MODAL
// ─────────────────────────────────────────────────────────────────────────────
export default function CardDesignerModal({ onSave }) {
  const store = useCardDesignerStore();
  const { open, template, selectedId, selectedIsOverlay } = store;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const h = e => {
      if ((e.ctrlKey||e.metaKey) && e.key==='z' && !e.shiftKey) { e.preventDefault(); store.undo(); }
      if ((e.ctrlKey||e.metaKey) && (e.key==='y'||(e.shiftKey&&e.key==='z'))) { e.preventDefault(); store.redo(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, store]);

  // Find selected element
  let selectedEl = null;
  if (selectedId && template?.rows) {
    outer: for (const row of template.rows) {
      for (const col of row.columns) {
        if (selectedIsOverlay) {
          const ov = (col.overlays||[]).find(o => o.id === selectedId);
          if (ov) { selectedEl = ov; break outer; }
        } else {
          const el = col.elements.find(e => e.id === selectedId);
          if (el) { selectedEl = el; break outer; }
        }
      }
    }
  }

  const isDense = (template?.density||'normal') === 'dense';
  if (!open || !mounted) return null;

  return createPortal(
    <div style={{ position:'fixed', inset:0, zIndex:10000, display:'flex', flexDirection:'column', background:T.bg }} onClick={() => store.clearSelected()}>

      {/* Top bar */}
      <div style={{ height:52, flexShrink:0, background:'#fff', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', padding:'0 16px', gap:8, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', zIndex:50 }}>
        <button onClick={() => store.closeDesigner()} style={{ display:'flex', alignItems:'center', gap:6, border:'none', background:'transparent', color:T.textLight, fontSize:12, fontWeight:600, cursor:'pointer', padding:'5px 8px', borderRadius:6 }} onMouseEnter={e => e.currentTarget.style.background=T.light} onMouseLeave={e => e.currentTarget.style.background='transparent'}><ChevronLeft size={14}/> Back</button>
        <div style={{ width:1, height:22, background:T.border }}/>
        <span style={{ fontSize:10, padding:'2px 8px', borderRadius:5, background:'#fdf2f8', color:'#9d174d', fontWeight:800 }}>🎨 CARD</span>
        <span style={{ fontSize:13, fontWeight:700, color:T.text }}>Product Card Designer</span>
        <div style={{ flex:1 }}/>
        <button onClick={store.undo} disabled={!store.past.length} style={{ width:32, height:32, border:'none', background:store.past.length?T.light:'transparent', color:store.past.length?T.textMid:'#cbd5e1', borderRadius:7, cursor:store.past.length?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center' }}><Undo2 size={14}/></button>
        <button onClick={store.redo} disabled={!store.future.length} style={{ width:32, height:32, border:'none', background:store.future.length?T.light:'transparent', color:store.future.length?T.textMid:'#cbd5e1', borderRadius:7, cursor:store.future.length?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center' }}><Redo2 size={14}/></button>
        <div style={{ width:1, height:22, background:T.border }}/>
        <button onClick={store.resetTemplate} style={{ padding:'6px 12px', background:T.light, color:'#d97706', border:`1.5px solid #fde68a`, borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:600 }}>↺ Reset</button>
        <button onClick={() => { (store._onSave||onSave)?.(template); store.closeDesigner(); }} style={{ padding:'6px 18px', background:T.primary, color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:5 }}>✓ Save Design</button>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }} onClick={e => e.stopPropagation()}>
        <LeftPanel/>

        {/* Canvas area */}
        <div style={{ flex:1, overflowY:'auto', padding:32, background:'#f0f2f5', display:'flex', justifyContent:'center' }} onClick={() => store.clearSelected()}>
          <div style={{ background:'#ffffff', borderRadius:12, boxShadow:'0 4px 24px rgba(0,0,0,0.09)', width:'100%', maxWidth:420, padding:24, alignSelf:'flex-start' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:10, fontWeight:800, color:T.textLight, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
              Card Canvas
              <span style={{ fontSize:9, padding:'2px 6px', background: isDense?'#fef3c7':'#f0fdf4', color: isDense?'#92400e':'#065f46', borderRadius:4, fontWeight:700, marginLeft:'auto' }}>
                {isDense ? '⊠ Dense' : '☐ Normal'}
              </span>
            </div>
            <CardCanvas template={template} store={store} selectedId={selectedId} selectedIsOverlay={selectedIsOverlay} isDense={isDense}/>
            <div style={{ marginTop:12, fontSize:9, color:T.textLight, textAlign:'center', lineHeight:1.7 }}>
              Click to select · Drag to add · Image col: "+ Add" for overlay
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width:264, flexShrink:0, background:'#fff', borderLeft:`1px solid ${T.border}`, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <RightPanelContent template={template} selectedEl={selectedEl} selectedIsOverlay={selectedIsOverlay} store={store}/>
        </div>
      </div>
    </div>,
    document.body
  );
}
