'use client';
/**
 * CanvasGrid.jsx — Advanced CSS Grid Module
 * Features:
 *  1. Drag right-edge  → colSpan resize
 *  2. Drag bottom-edge → rowSpan resize
 *  3. Drag col divider → custom fr widths
 *  4. Auto-responsive  → tablet/mobile auto-computed on desktop change
 *  5. Visual guide lines
 */
import { useState, useRef, useCallback } from 'react';
import { Trash2, Plus, Copy, Grid, Settings } from 'lucide-react';
import { T } from '../../constants/theme';
import { resolveBgStyle } from '../../lib/bgStyle';

// ── Auto-responsive algorithm ─────────────────────────────────────────────────
export function autoResponsive(d) {
  d = Math.max(1, d);
  if (d <= 1) return { tabletColumns:1, mobileColumns:1 };
  if (d <= 2) return { tabletColumns:2, mobileColumns:1 };
  if (d <= 4) return { tabletColumns:2, mobileColumns:1 };
  if (d <= 6) return { tabletColumns:3, mobileColumns:2 };
  return { tabletColumns: Math.ceil(d/2), mobileColumns: Math.ceil(d/3) };
}

function buildColTemplate(colTemplate, cols) {
  if (colTemplate && colTemplate.length === cols)
    return colTemplate.map(f => `${f}fr`).join(' ');
  return `repeat(${cols}, 1fr)`;
}

const SHADOW_MAP = {
  none:'none', sm:'0 1px 3px rgba(0,0,0,0.10)',
  md:'0 4px 12px rgba(0,0,0,0.10)', lg:'0 10px 24px rgba(0,0,0,0.12)',
  xl:'0 20px 40px rgba(0,0,0,0.14)',
};

function cellBoxStyle(cs = {}) {
  const hasBorder = cs.borderStyle && cs.borderStyle !== 'none';
  return {
    ...resolveBgStyle(cs, ''),
    paddingTop:   `${cs.padTop??16}px`, paddingBottom:`${cs.padBottom??16}px`,
    paddingLeft:  `${cs.padLeft??16}px`, paddingRight: `${cs.padRight??16}px`,
    borderRadius: cs.radius ? `${cs.radius}px` : undefined,
    boxShadow:    SHADOW_MAP[cs.shadow] || 'none',
    border:       hasBorder ? `${cs.borderWidth||1}px ${cs.borderStyle} ${cs.borderColor||'#e2e8f0'}` : undefined,
    minHeight:    cs.minHeight ? `${cs.minHeight}px` : undefined,
    display:'flex', flexDirection:'column',
    alignItems:   cs.align||'flex-start',
    justifyContent: {flex_start:'flex-start',center:'center',flex_end:'flex-end'}[cs.valign?.replace('-','_')] || 'flex-start',
    gap:`${cs.gap??10}px`, boxSizing:'border-box', height:'100%',
  };
}

// ── ElementDropdown ────────────────────────────────────────────────────────────
function ElementDropdown({ elementMap, onAdd, onClose }) {
  const [search, setSearch] = useState('');
  const entries = Object.entries(elementMap).filter(([k,v]) =>
    !search || k.toLowerCase().includes(search.toLowerCase()) || (v.label||k).toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div onClick={e=>e.stopPropagation()} style={{
      position:'absolute',top:'100%',left:0,right:0,zIndex:9000,
      background:'#fff',border:`1.5px solid ${T.border}`,borderRadius:10,
      boxShadow:'0 8px 24px rgba(0,0,0,0.12)',maxHeight:240,overflowY:'auto',marginTop:4,
    }}>
      <div style={{padding:'6px 10px',borderBottom:`1px solid ${T.border}`,display:'flex',gap:6,alignItems:'center'}}>
        <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search elements..."
          style={{flex:1,border:'none',background:'transparent',fontSize:11,color:'#334155',outline:'none'}}/>
        <button onClick={onClose} style={{border:'none',background:'none',cursor:'pointer',color:'#94a3b8',fontSize:14}}>✕</button>
      </div>
      {entries.length===0
        ? <div style={{padding:16,textAlign:'center',fontSize:11,color:'#94a3b8'}}>No elements found</div>
        : entries.map(([type,def])=>(
          <div key={type} onClick={()=>{onAdd(type);onClose();}}
            style={{padding:'7px 12px',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}
            onMouseEnter={e=>e.currentTarget.style.background='#f5f3ff'}
            onMouseLeave={e=>e.currentTarget.style.background=''}
          >
            <span style={{fontSize:15}}>{def.icon||'□'}</span>
            <span style={{fontWeight:500}}>{def.label||type}</span>
          </div>
        ))
      }
    </div>
  );
}

function EmptyCell({ isOver, accent, isSelected, elementMap, onAdd }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div style={{width:'100%',position:'relative'}}>
      <div onClick={e=>{e.stopPropagation();if(isSelected)setShowMenu(v=>!v);}}
        style={{
          minHeight:52,display:'flex',alignItems:'center',justifyContent:'center',gap:6,
          border:`2px dashed ${isOver?accent:isSelected?accent:'#cbd5e1'}`,borderRadius:8,
          background:isOver?`${accent}10`:isSelected?`${accent}05`:'transparent',
          transition:'all 0.18s',cursor:isSelected?'pointer':'default',
        }}
      >
        {isOver ? <span style={{fontSize:11,fontWeight:600,color:accent,display:'flex',gap:5,alignItems:'center'}}><Plus size={12}/> Drop Here</span>
          : isSelected ? <span style={{fontSize:11,fontWeight:600,color:accent,display:'flex',gap:5,alignItems:'center'}}><Plus size={12}/> Add Element</span>
          : <span style={{fontSize:11,color:'#94a3b8'}}>· Empty ·</span>
        }
      </div>
      {isSelected && showMenu && elementMap && (
        <ElementDropdown elementMap={elementMap} onAdd={onAdd} onClose={()=>setShowMenu(false)}/>
      )}
    </div>
  );
}

function CellElement({ el, elementMap, selectedId, onSelectEl, onDelete, secId, gridId, cellId }) {
  const [hovered, setHovered] = useState(false);
  const def = elementMap[el.type]; if(!def) return null;
  const Comp = def.component; const isSel = selectedId===el.id;
  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      onClick={e=>{e.stopPropagation();onSelectEl(el.id,{mode:'element',secId,rowId:gridId,colId:cellId});}}
      style={{position:'relative',outline:isSel?`2px solid ${T.primary}`:hovered?`1px dashed ${T.primary}60`:'none',borderRadius:6,transition:'outline 0.15s'}}
    >
      {(hovered||isSel)&&(
        <div style={{position:'absolute',top:-24,right:0,zIndex:300,display:'flex',gap:3,background:'rgba(255,255,255,0.95)',borderRadius:6,border:`1px solid ${T.border}`,padding:'2px 4px',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
          <button onClick={e=>{e.stopPropagation();onDelete(el.id);}} style={{width:20,height:20,border:'none',background:'none',cursor:'pointer',color:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center'}}><Trash2 size={11}/></button>
        </div>
      )}
      <Comp el={el}/>
    </div>
  );
}

// ── CanvasGridCell ─────────────────────────────────────────────────────────────
function CanvasGridCell({ cell, grid, secId, isMobile, selectedId, selectedCellId, elementMap,
  onSelectEl, onSelectCell, onAddElementToCell, onDeleteElement, onDeleteCell,
  onResizeCellCol, onResizeCellRow }) {

  const [isOver, setIsOver]   = useState(false);
  const [hovered,setHovered]  = useState(false);
  const cellRef = useRef(null);
  const cs      = cell.settings||{};
  const s       = grid.settings||{};
  const isSel   = selectedCellId===cell.id;
  const accent  = '#6366f1';
  const maxCols = s.columns||3;
  const maxRows = s.rows||2;
  const colSpan = (cell.colEnd||2)-(cell.colStart||1);
  const rowSpan = (cell.rowEnd||2)-(cell.rowStart||1);

  const handleDrop = e => {
    e.preventDefault(); e.stopPropagation(); setIsOver(false);
    try {
      const p = JSON.parse(e.dataTransfer.getData('hb-drag'));
      if(p.newType) onAddElementToCell(secId,grid.id,cell.id,p.newType);
    } catch {}
  };

  // Right-edge drag → colEnd
  const handleColDrag = e => {
    e.preventDefault(); e.stopPropagation();
    const gridEl = cellRef.current?.closest('[data-grid-container]');
    if(!gridEl) return;
    const gRect = gridEl.getBoundingClientRect();
    const colW  = gRect.width / maxCols;
    const start = { x:e.clientX, colEnd: cell.colEnd||2 };
    const onMove = ev => {
      const delta = Math.round((ev.clientX-start.x)/colW);
      const ne = Math.min(maxCols+1, Math.max((cell.colStart||1)+1, start.colEnd+delta));
      onResizeCellCol(cell.id, ne);
    };
    const onUp = ()=>{ window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); };
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);
  };

  // Bottom-edge drag → rowEnd
  const handleRowDrag = e => {
    e.preventDefault(); e.stopPropagation();
    const gridEl = cellRef.current?.closest('[data-grid-container]');
    if(!gridEl) return;
    const gRect  = gridEl.getBoundingClientRect();
    const rowH   = gRect.height / maxRows;
    const start  = { y:e.clientY, rowEnd: cell.rowEnd||2 };
    const onMove = ev => {
      const delta = Math.round((ev.clientY-start.y)/rowH);
      const ne = Math.min(maxRows+1, Math.max((cell.rowStart||1)+1, start.rowEnd+delta));
      onResizeCellRow(cell.id, ne);
    };
    const onUp = ()=>{ window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); };
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);
  };

  const gridColStyle = isMobile
    ? {gridColumn:'1 / -1',gridRow:'auto'}
    : {gridColumn:`${cell.colStart}/${cell.colEnd}`,gridRow:`${cell.rowStart}/${cell.rowEnd}`};

  return (
    <div ref={cellRef} style={{...gridColStyle,position:'relative',
      outline:isSel?`2px solid ${accent}`:hovered?`1px dashed ${accent}80`:`1px dashed ${T.border}40`,
      borderRadius:cs.radius?`${cs.radius}px`:6,transition:'outline 0.15s',minHeight:80,
    }}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      onClick={e=>{e.stopPropagation();onSelectCell(cell.id);}}
      onDragOver={e=>{e.preventDefault();setIsOver(true);}}
      onDragLeave={()=>setIsOver(false)}
      onDrop={handleDrop}
    >
      <div style={{...cellBoxStyle(cs),position:'relative',minHeight:80}}>
        {(cell.elements||[]).length===0 ? (
          <EmptyCell isOver={isOver} accent={accent} isSelected={isSel} elementMap={elementMap}
            onAdd={type=>onAddElementToCell(secId,grid.id,cell.id,type)}/>
        ) : (
          <>
            {(cell.elements||[]).map(el=>(
              <CellElement key={el.id} el={el} elementMap={elementMap} selectedId={selectedId}
                onSelectEl={onSelectEl} secId={secId} gridId={grid.id} cellId={cell.id}
                onDelete={id=>onDeleteElement(id)}/>
            ))}
            {isSel&&<div style={{position:'relative'}}><EmptyCell isOver={false} accent={accent} isSelected={isSel} elementMap={elementMap} onAdd={type=>onAddElementToCell(secId,grid.id,cell.id,type)}/></div>}
          </>
        )}
      </div>

      {/* Badge */}
      {(hovered||isSel)&&(
        <div style={{position:'absolute',top:3,left:3,zIndex:200,display:'flex',alignItems:'center',gap:3,background:'rgba(255,255,255,0.95)',borderRadius:5,border:`1px solid ${T.border}`,padding:'2px 6px',pointerEvents:'auto'}}>
          <span style={{fontSize:8,fontWeight:800,color:accent,textTransform:'uppercase',userSelect:'none'}}>
            {colSpan>1||rowSpan>1?`${colSpan}×${rowSpan}`:'CELL'}
          </span>
          <button onClick={e=>{e.stopPropagation();onDeleteCell(cell.id);}} style={{width:14,height:14,border:'none',background:'none',cursor:'pointer',color:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}><Trash2 size={9}/></button>
        </div>
      )}

      {/* Right handle (col resize) */}
      {(hovered||isSel)&&!isMobile&&(cell.colEnd||2)<=maxCols&&(
        <div onMouseDown={handleColDrag} title="Drag → resize column span"
          style={{position:'absolute',right:-6,top:'50%',transform:'translateY(-50%)',width:12,height:36,zIndex:500,cursor:'ew-resize',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{width:4,height:32,borderRadius:2,background:isSel?accent:'#94a3b8',opacity:0.85,boxShadow:isSel?`0 0 6px ${accent}80`:'none'}}/>
        </div>
      )}

      {/* Bottom handle (row resize) */}
      {(hovered||isSel)&&!isMobile&&(cell.rowEnd||2)<=maxRows&&(
        <div onMouseDown={handleRowDrag} title="Drag ↓ resize row span"
          style={{position:'absolute',bottom:-6,left:'50%',transform:'translateX(-50%)',height:12,width:36,zIndex:500,cursor:'ns-resize',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{height:4,width:32,borderRadius:2,background:isSel?accent:'#94a3b8',opacity:0.85,boxShadow:isSel?`0 0 6px ${accent}80`:'none'}}/>
        </div>
      )}
    </div>
  );
}

// ── Column dividers for fr-width drag ─────────────────────────────────────────
function ColDividers({ cols, colTemplate, onUpdate, containerRef }) {
  const dragRef = useRef(null);

  const handleDown = (e, idx) => {
    e.preventDefault(); e.stopPropagation();
    dragRef.current = { idx, startX: e.clientX, tpl: [...colTemplate] };
    const onMove = ev => {
      if(!dragRef.current) return;
      const el = containerRef.current; if(!el) return;
      const W = el.getBoundingClientRect().width;
      const totalFr = dragRef.current.tpl.reduce((a,b)=>a+b,0);
      const pxPerFr = W/totalFr;
      const dx = ev.clientX - dragRef.current.startX;
      const delta = dx/pxPerFr;
      const t = [...dragRef.current.tpl];
      t[idx]   = Math.max(0.25, t[idx]+delta);
      t[idx+1] = Math.max(0.25, t[idx+1]-delta);
      dragRef.current.startX = ev.clientX;
      dragRef.current.tpl = t;
      onUpdate(t.map(v=>Math.round(v*100)/100));
    };
    const onUp = ()=>{ dragRef.current=null; window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); };
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);
  };

  const totalFr = colTemplate.reduce((a,b)=>a+b,0);
  let cum = 0;
  return (
    <>
      {colTemplate.slice(0,-1).map((fr,i)=>{
        cum += fr;
        const pct = (cum/totalFr)*100;
        return (
          <div key={i} onMouseDown={e=>handleDown(e,i)} title="Drag to adjust column width"
            style={{position:'absolute',top:0,bottom:0,left:`calc(${pct}% - 5px)`,width:10,zIndex:300,cursor:'col-resize',display:'flex',alignItems:'stretch',justifyContent:'center'}}>
            <div style={{width:2,background:'rgba(99,102,241,0.3)',borderRadius:1,transition:'background 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,0.8)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(99,102,241,0.3)'}
            />
          </div>
        );
      })}
    </>
  );
}

// ── CanvasGrid ─────────────────────────────────────────────────────────────────
export function CanvasGrid({
  grid, secId, isMobile,
  selectedId, selectedCellId, elementMap,
  onSelectGrid, onSelectCell, onSelectEl,
  onUpdateGrid, onDeleteGrid, onDuplicateGrid,
  onAddElementToCell, onDeleteElement, onDeleteCell, onAddCell,
  onUpdateGridCellSpan,
}) {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null);
  const s    = grid.settings||{};
  const cols = s.columns||3;
  const rows = s.rows||2;

  const colTemplate = (s.colTemplate&&s.colTemplate.length===cols) ? s.colTemplate : Array(cols).fill(1);
  const templateStr = buildColTemplate(colTemplate, cols);

  const handleUpdateTemplate = tpl => onUpdateGrid({ colTemplate: tpl });

  const gridStyle = {
    display:'grid',
    gridTemplateColumns: isMobile ? `repeat(${s.mobileColumns||1},1fr)` : templateStr,
    gridTemplateRows: isMobile ? undefined : `repeat(${rows},auto)`,
    gap:`${s.rowGap??16}px ${s.colGap??16}px`,
    position:'relative',
    ...(s.widthMode==='full' ? {width:'100%'} : {maxWidth:`${s.maxWidth||1280}px`,margin:'0 auto',width:'100%'}),
  };

  return (
    <div style={{
      position:'relative',
      padding:`${s.padTop||16}px ${s.padRight||16}px ${s.padBottom||16}px ${s.padLeft||16}px`,
      ...resolveBgStyle(s,'transparent'),
      boxShadow:hovered?'0 0 0 2px #8b5cf6':undefined,
      transition:'box-shadow 0.2s', marginBottom:2,
    }}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      onClick={e=>{e.stopPropagation();onSelectGrid();}}
    >
      {/* Toolbar */}
      <div style={{
        position:'absolute',top:0,left:0,zIndex:100,
        display:'flex',alignItems:'center',gap:3,padding:'5px 8px',
        background:'rgba(255,255,255,0.92)',backdropFilter:'blur(8px)',
        borderRadius:'0 0 10px 0',border:'1px solid rgba(226,232,240,0.6)',
        opacity:hovered?1:0, pointerEvents:hovered?'auto':'none', transition:'opacity 0.2s',
      }}>
        <span style={{fontSize:10,fontWeight:700,color:'#6366f1',paddingRight:8,borderRight:'1px solid #e2e8f0',marginRight:2,textTransform:'uppercase',letterSpacing:'0.05em',userSelect:'none',display:'flex',alignItems:'center',gap:4}}>
          <Grid size={10}/> {s.label||'Grid'} {cols}×{rows}
        </span>
        <button onClick={e=>{e.stopPropagation();onAddCell();}} style={{display:'flex',alignItems:'center',gap:4,padding:'4px 10px',fontSize:11,fontWeight:600,background:'#6366f1',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}>
          <Plus size={11}/> Cell
        </button>
        <button onClick={e=>{e.stopPropagation();onSelectGrid();}} style={{width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',border:'none',background:'#f0f9ff',color:'#0ea5e9',borderRadius:6,cursor:'pointer'}}><Settings size={12}/></button>
        <button onClick={e=>{e.stopPropagation();onDuplicateGrid?.();}} style={{width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',border:'none',background:'#f0fdf4',color:'#10b981',borderRadius:6,cursor:'pointer'}}><Copy size={12}/></button>
        <button onClick={e=>{e.stopPropagation();onDeleteGrid();}} style={{width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',border:'none',background:'#fff1f2',color:'#ef4444',borderRadius:6,cursor:'pointer'}}><Trash2 size={12}/></button>
      </div>

      {/* Mobile badge */}
      {isMobile&&<div style={{position:'absolute',top:4,right:8,zIndex:101,fontSize:9,fontWeight:700,color:'#8b5cf6',background:'#ede9fe',borderRadius:4,padding:'2px 6px'}}>📱 {s.mobileColumns||1} col</div>}

      {/* Responsive hint */}
      {hovered&&!isMobile&&(
        <div style={{position:'absolute',bottom:4,right:8,zIndex:101,fontSize:9,fontWeight:600,color:'#64748b',background:'rgba(248,250,252,0.95)',borderRadius:4,padding:'2px 7px',border:`1px solid ${T.border}`,pointerEvents:'none'}}>
          🖥 {cols} → 📱 {s.tabletColumns||2} → 📱 {s.mobileColumns||1}
        </div>
      )}

      {/* Empty state */}
      {(grid.cells||[]).length===0 ? (
        <div onClick={e=>{e.stopPropagation();onAddCell();}}
          style={{margin:'32px 0',padding:'32px',border:'2px dashed #cbd5e1',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',gap:8,color:'#94a3b8',cursor:'pointer',background:'rgba(248,250,252,0.8)',transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='#6366f1';e.currentTarget.style.color='#6366f1';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='#cbd5e1';e.currentTarget.style.color='#94a3b8';}}
        >
          <Plus size={18}/><span style={{fontSize:13,fontWeight:600}}>Add First Cell</span>
        </div>
      ) : (
        <div style={{position:'relative'}} ref={containerRef}>
          {hovered&&!isMobile&&cols>1&&(
            <ColDividers cols={cols} colTemplate={colTemplate} onUpdate={handleUpdateTemplate} containerRef={containerRef}/>
          )}
          <div data-grid-container style={gridStyle}>
            {(grid.cells||[]).map(cell=>(
              <CanvasGridCell key={cell.id}
                cell={cell} grid={grid} secId={secId} isMobile={isMobile}
                selectedId={selectedId} selectedCellId={selectedCellId} elementMap={elementMap}
                onSelectEl={onSelectEl} onSelectCell={onSelectCell}
                onAddElementToCell={onAddElementToCell}
                onDeleteElement={onDeleteElement} onDeleteCell={onDeleteCell}
                onResizeCellCol={(cellId,ne)=>onUpdateGridCellSpan?.(grid.id,cellId,{colEnd:ne})}
                onResizeCellRow={(cellId,ne)=>onUpdateGridCellSpan?.(grid.id,cellId,{rowEnd:ne})}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
