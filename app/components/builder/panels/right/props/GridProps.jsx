'use client';
/**
 * GridProps.jsx — Right-panel for a selected Grid module.
 * Sections: General, Layout, Column Widths, Responsive (auto), Spacing, Background
 */
import {
  PropSec, FL, RInput, NumberInput, Toggle,
  SegCtrl, SelectInput, SpacingBox, Divider, BackgroundEditor,
} from '../../../../shared/ui';
import { autoResponsive } from '../../../../canvas/CanvasGrid';
import { T } from '../../../../../constants/theme';

// Visual fr-width bar
function ColWidthBar({ colTemplate, cols }) {
  const tpl   = (colTemplate && colTemplate.length === cols) ? colTemplate : Array(cols).fill(1);
  const total = tpl.reduce((a, b) => a + b, 0);
  const COLORS = ['#6366f1','#8b5cf6','#3b82f6','#06b6d4','#10b981','#f59e0b','#f97316','#ef4444'];
  return (
    <div style={{ display:'flex', gap:2, height:20, borderRadius:6, overflow:'hidden', border:`1px solid ${T.border}` }}>
      {tpl.map((fr, i) => (
        <div key={i} style={{
          flex: fr/total, background: COLORS[i % COLORS.length],
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:9, color:'#fff', fontWeight:700, opacity:0.85, minWidth:0,
        }}>
          {Math.round((fr/total)*100)}%
        </div>
      ))}
    </div>
  );
}

// Responsive preview chips
function ResponsivePreview({ desktopCols, tabletCols, mobileCols }) {
  const item = (icon, label, cols, color) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1 }}>
      <div style={{ fontSize:14 }}>{icon}</div>
      <div style={{ display:'flex', gap:2 }}>
        {Array.from({ length: Math.min(cols, 4) }).map((_, i) => (
          <div key={i} style={{ width:8, height:20, background:color, borderRadius:2, opacity:0.75 }} />
        ))}
        {cols > 4 && <span style={{ fontSize:9, color:'#94a3b8', alignSelf:'center' }}>+{cols-4}</span>}
      </div>
      <div style={{ fontSize:9, fontWeight:700, color, textAlign:'center' }}>{label}<br/>{cols} col</div>
    </div>
  );
  return (
    <div style={{ display:'flex', gap:8, background:'#f8fafc', borderRadius:8, padding:'10px 8px', border:`1px solid ${T.border}` }}>
      {item('🖥', 'Desktop', desktopCols, '#6366f1')}
      <div style={{ width:1, background: T.border }} />
      {item('📱', 'Tablet', tabletCols, '#3b82f6')}
      <div style={{ width:1, background: T.border }} />
      {item('📲', 'Mobile', mobileCols, '#10b981')}
    </div>
  );
}

export function GridProps({ grid, onChange }) {
  const s  = grid.settings || {};
  const up = (k, v) => onChange({ [k]: v });

  const cols     = s.columns || 3;
  const tCols    = s.tabletColumns ?? autoResponsive(cols).tabletColumns;
  const mCols    = s.mobileColumns ?? autoResponsive(cols).mobileColumns;
  const colTpl   = (s.colTemplate && s.colTemplate.length === cols) ? s.colTemplate : Array(cols).fill(1);
  const isCustom = colTpl.some((v, _, arr) => Math.abs(v - arr[0]) > 0.05);

  // When desktop cols change → auto-update tablet/mobile + reset colTemplate
  const handleColsChange = (newCols) => {
    const { tabletColumns, mobileColumns } = autoResponsive(newCols);
    onChange({ columns: newCols, tabletColumns, mobileColumns, colTemplate: Array(newCols).fill(1) });
  };

  const handleTabletChange = v => up('tabletColumns', v);
  const handleMobileChange = v => up('mobileColumns', v);

  return (
    <>
      {/* 1 — General */}
      <PropSec title="General">
        <RInput label="Grid Name" val={s.label||''} set={v=>up('label',v)} placeholder="e.g. Feature Grid"/>
        <Toggle val={s.visible!==false} set={v=>up('visible',v)} label="Visible"/>
      </PropSec>

      {/* 2 — Layout */}
      <PropSec title="Layout">
        <NumberInput label="Columns (Desktop)" val={cols} set={handleColsChange} min={1} max={12} unit="cols"/>
        <NumberInput label="Rows" val={s.rows||2} set={v=>up('rows',v)} min={1} max={12} unit="rows"/>
        <Divider/>
        <NumberInput label="Column Gap" val={s.colGap??16} set={v=>up('colGap',v)} min={0} max={120} unit="px"/>
        <NumberInput label="Row Gap"    val={s.rowGap??16} set={v=>up('rowGap',v)} min={0} max={120} unit="px"/>
        <Divider/>
        <SegCtrl label="Width Mode" val={s.widthMode||'boxed'} set={v=>up('widthMode',v)}
          opts={[{v:'boxed',l:'Boxed'},{v:'full',l:'Full'}]}/>
        {(s.widthMode||'boxed')==='boxed'&&(
          <NumberInput label="Max Width" val={s.maxWidth||1280} set={v=>up('maxWidth',v)} min={320} max={2400} unit="px"/>
        )}
      </PropSec>

      {/* 3 — Column Widths */}
      <PropSec title="Column Widths">
        <div style={{ fontSize:10, color:'#64748b', marginBottom:8, lineHeight:1.5 }}>
          {isCustom
            ? '✏️ Custom widths active. Drag column dividers on canvas to adjust, or reset to equal.'
            : '💡 Drag the column dividers on the canvas to set custom widths.'}
        </div>
        <ColWidthBar colTemplate={colTpl} cols={cols}/>
        {isCustom && (
          <button
            onClick={() => onChange({ colTemplate: Array(cols).fill(1) })}
            style={{ marginTop:8, width:'100%', padding:'6px', fontSize:11, fontWeight:600,
              border:`1.5px solid ${T.border}`, borderRadius:6, background:'#f8fafc',
              color:'#64748b', cursor:'pointer' }}
            onMouseEnter={e=>e.currentTarget.style.background='#f1f5f9'}
            onMouseLeave={e=>e.currentTarget.style.background='#f8fafc'}
          >↺ Reset to Equal Widths</button>
        )}
      </PropSec>

      {/* 4 — Responsive */}
      <PropSec title="Responsive">
        <ResponsivePreview desktopCols={cols} tabletCols={tCols} mobileCols={mCols}/>
        <div style={{ marginTop:10, fontSize:10, color:'#10b981', fontWeight:600,
          background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:6, padding:'6px 10px' }}>
          ✅ Auto-responsive active — when you change Desktop columns,<br/>
          Tablet &amp; Mobile update automatically.
        </div>
        <Divider/>
        <div style={{ fontSize:10, color:'#64748b', marginBottom:4 }}>Override if needed:</div>
        <NumberInput label="Tablet Columns (≤1024px)" val={tCols} set={handleTabletChange} min={1} max={6} unit="cols"/>
        <NumberInput label="Mobile Columns (≤640px)"  val={mCols} set={handleMobileChange} min={1} max={4} unit="cols"/>
        <div style={{ fontSize:10, color:'#94a3b8', marginTop:4, lineHeight:1.5 }}>
          On mobile, cells with large spans automatically become full-width.
        </div>
      </PropSec>

      {/* 5 — Spacing */}
      <PropSec title="Spacing">
        <SpacingBox label="Padding"
          top={+(s.padTop??16)} right={+(s.padRight??16)} bottom={+(s.padBottom??16)} left={+(s.padLeft??16)}
          setTop={v=>up('padTop',v)} setRight={v=>up('padRight',v)}
          setBottom={v=>up('padBottom',v)} setLeft={v=>up('padLeft',v)}
        />
      </PropSec>

      {/* 6 — Background */}
      <BackgroundEditor s={s} up={up}/>
    </>
  );
}
