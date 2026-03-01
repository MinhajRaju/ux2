'use client';
/**
 * RowProps.jsx — Right-panel options for a selected Row.
 *
 * Sections:
 *  1. General        — label, visible
 *  2. Columns        — spacing (None/S/M/L), style (Normal/Divided/Dash)
 *  3. Background     — color, gradient, image
 *  4. Layout         — width mode, vertical/horizontal align, min-height
 *  5. Border & Radius
 *  6. Spacing        — padding (SpacingBox), margin (SpacingBox)
 *  7. Effects        — column depth on hover
 *  8. Custom CSS     — class name + smart CSS editor
 */
import { useRef, useState } from 'react';
import {
  PropSec, FL, RInput, NumberInput, ColorPick,
  SliderInput, SegCtrl, Toggle, SelectInput, SpacingBox,
  Divider, BackgroundEditor,
} from '../../../../shared/ui';
import { T } from '../../../../../constants/theme';

/* ─── CSS autocomplete ─────────────────────────────────────────────────────── */
const CSS_PROPS = [
  'background','background-color','background-image','background-size','background-position',
  'color','font-size','font-weight','font-family','font-style',
  'text-align','text-transform','text-decoration','letter-spacing','line-height',
  'padding','padding-top','padding-bottom','padding-left','padding-right',
  'margin','margin-top','margin-bottom','margin-left','margin-right',
  'border','border-radius','border-color','border-width','border-style',
  'width','height','min-height','max-width','max-height',
  'display','flex','flex-direction','align-items','justify-content','gap',
  'position','top','left','right','bottom','z-index',
  'opacity','box-shadow','transform','transition','overflow','cursor',
];
const CSS_VALUES = {
  'display':         ['flex','grid','block','inline-block','inline','none'],
  'flex-direction':  ['row','column','row-reverse','column-reverse'],
  'align-items':     ['flex-start','flex-end','center','stretch','baseline'],
  'justify-content': ['flex-start','flex-end','center','space-between','space-around'],
  'text-align':      ['left','center','right','justify'],
  'font-weight':     ['400','500','600','700','800','900','bold','normal'],
  'text-transform':  ['none','uppercase','lowercase','capitalize'],
  'overflow':        ['hidden','visible','auto','scroll'],
  'cursor':          ['pointer','default','not-allowed','grab'],
  'position':        ['static','relative','absolute','fixed','sticky'],
  'border-style':    ['solid','dashed','dotted','none'],
  'background-size': ['cover','contain','auto','100%'],
};

function autoImportant(css) {
  return css.split('\n').map(line => {
    const t = line.trim();
    if (!t || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*') ||
        t.startsWith('@') || t.includes('{') || t === '}') return line;
    const ci = t.indexOf(':');
    if (ci === -1) return line;
    const prop = t.slice(0, ci).trim();
    if (!prop || /\s/.test(prop) || /[.#&>~+\[\]]/.test(prop)) return line;
    let r = line;
    if (!r.includes('!important')) r = r.replace(/;?\s*$/, ' !important');
    if (!r.trimEnd().endsWith(';')) r = r.trimEnd() + ';';
    return r;
  }).join('\n');
}

function CssCodeEditor({ cls, val, set }) {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestPos,  setSuggestPos]  = useState({ top: 0, left: 0, width: 200 });
  const [activeSug,   setActiveSug]   = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [isValueMode, setIsValueMode] = useState(false);
  const [currentProp, setCurrentProp] = useState('');
  const taRef = useRef();

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSug(i => Math.min(i+1, suggestions.length-1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveSug(i => Math.max(i-1, 0)); }
    if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); applySuggestion(suggestions[activeSug]); }
    if (e.key === 'Escape') setSuggestions([]);
  };

  const applySuggestion = (sug) => {
    const ta = taRef.current;
    if (!ta) return;
    const pos = ta.selectionStart, text = ta.value;
    const start = pos - currentWord.length;
    const suffix = isValueMode ? ';' : ': ';
    set(text.slice(0, start) + sug + suffix + text.slice(pos));
    setSuggestions([]);
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = start + sug.length + suffix.length; }, 0);
  };

  const computeSuggestions = (ta) => {
    const pos = ta.selectionStart, before = ta.value.slice(0, pos);
    const lastBreak = Math.max(before.lastIndexOf('\n'), before.lastIndexOf('{'));
    const lineStr   = before.slice(lastBreak + 1);
    const colonIdx  = lineStr.lastIndexOf(':'), semiIdx = lineStr.lastIndexOf(';');
    let word = '', valueMode = false, propName = '';
    if (colonIdx > semiIdx && colonIdx !== -1) {
      word = lineStr.slice(colonIdx + 1).trimStart().split(/\s/).pop() || '';
      propName = lineStr.slice(0, colonIdx).trim().toLowerCase();
      valueMode = true;
    } else { word = lineStr.trim().split(/\s/).pop() || ''; }
    setCurrentWord(word); setIsValueMode(valueMode); setCurrentProp(propName); setActiveSug(0);
    if (!word) { setSuggestions([]); return; }
    const pool = valueMode ? (CSS_VALUES[propName] || []) : CSS_PROPS;
    const filtered = pool.filter(p => p.startsWith(word) && p !== word).slice(0, 8);
    setSuggestions(filtered);
    if (!filtered.length) return;
    const taRect = ta.getBoundingClientRect();
    const mirror = document.createElement('div');
    const cs = window.getComputedStyle(ta);
    ['fontFamily','fontSize','fontWeight','lineHeight','paddingTop','paddingLeft','borderTopWidth','boxSizing','whiteSpace','wordWrap']
      .forEach(p => { mirror.style[p] = cs[p]; });
    Object.assign(mirror.style, { position:'fixed',visibility:'hidden',pointerEvents:'none',zIndex:'-1', top:taRect.top+'px',left:taRect.left+'px',width:taRect.width+'px',height:taRect.height+'px',overflow:'hidden',whiteSpace:'pre-wrap',wordWrap:'break-word' });
    mirror.textContent = before;
    const sentinel = document.createElement('span'); sentinel.textContent = '\u200b'; mirror.appendChild(sentinel);
    document.body.appendChild(mirror);
    const sr = sentinel.getBoundingClientRect(); document.body.removeChild(mirror);
    const dh = Math.min(filtered.length * 32 + 30, 300);
    const dropTop = (window.innerHeight - sr.bottom) > dh ? sr.bottom + 2 : sr.top - dh - 2;
    setSuggestPos({ top: dropTop, left: Math.min(sr.left, window.innerWidth-220), width: Math.max(200, taRect.width*0.6) });
  };

  return (
    <div>
      <textarea
        ref={taRef} value={val}
        onChange={e => { set(e.target.value); computeSuggestions(e.target); }}
        onKeyDown={handleKeyDown}
        placeholder={cls ? `.${cls} {\n  padding: 20px;\n}\n\n.${cls}:hover {\n  box-shadow: 0 8px 24px rgba(0,0,0,0.1);\n}` : ''}
        rows={8} spellCheck={false} autoComplete="off" autoCorrect="off"
        style={{ width:'100%', boxSizing:'border-box', padding:'10px', fontSize:12, fontFamily:'"Fira Code","Consolas",monospace', color:'#1e293b', border:`1.5px solid ${T.border}`, borderRadius:7, outline:'none', resize:'vertical', background:'#f8fafc', lineHeight:1.8 }}
        onFocus={e => (e.target.style.borderColor = T.primary)}
        onBlur={e => { e.target.style.borderColor = T.border; setTimeout(() => setSuggestions([]), 150); }}
      />
      {suggestions.length > 0 && (
        <div style={{ position:'fixed', top:suggestPos.top, left:suggestPos.left, width:suggestPos.width, background:'#fff', border:`1.5px solid ${T.border}`, borderRadius:8, boxShadow:'0 8px 28px rgba(0,0,0,0.15)', zIndex:99999, overflow:'hidden' }}>
          <div style={{ fontSize:9, color:T.textLight, padding:'4px 10px', background:T.light, borderBottom:`1px solid ${T.border}`, fontWeight:700, textTransform:'uppercase' }}>
            {isValueMode ? `values for ${currentProp}` : 'css properties'} · Tab to insert
          </div>
          {suggestions.map((sg,i) => (
            <div key={sg} onMouseDown={e=>{e.preventDefault();applySuggestion(sg);}}
              style={{ padding:'6px 12px', fontSize:12, cursor:'pointer', fontFamily:'monospace', color:i===activeSug?T.primary:T.text, background:i===activeSug?T.primaryLight:'transparent', fontWeight:i===activeSug?700:400 }}>
              {sg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomCssEditor({ s, up }) {
  const cls = s.customClass || '';
  return (
    <PropSec title="Custom CSS">
      <RInput label="CSS Class Name" val={cls} set={v => up('customClass', v.replace(/[^a-zA-Z0-9_-]/g, ''))} placeholder="e.g. my-hero-row" />
      {cls && (
        <>
          <div style={{ background: T.primaryLight, borderRadius:6, padding:'5px 10px', display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontFamily:'monospace', color:T.primary, fontWeight:700, fontSize:12 }}>.{cls}</span>
            <span style={{ fontSize:10, color:T.textLight }}>applied to this row</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <FL>CSS Editor</FL>
            <span style={{ fontSize:10, color:'#10b981', fontWeight:600 }}>✓ !important auto-added</span>
          </div>
          <CssCodeEditor cls={cls} val={s.customCss || ''} set={v => up('customCss', autoImportant(v))} />
          <div style={{ fontSize:10, color:T.textLight, lineHeight:1.6 }}>
            Tab/Enter to accept · <code style={{ background:T.light, padding:'1px 4px', borderRadius:3 }}>.{cls}:hover {'{}'}</code> for hover styles
          </div>
        </>
      )}
    </PropSec>
  );
}

/* ─── RowProps (root export) ─────────────────────────────────────────────────── */
export function RowProps({ row, onChange }) {
  const s  = row.settings || {};
  const up = (k, v) => onChange({ [k]: v });

  return (
    <>
      {/* 1 — General */}
      <PropSec title="General">
        <RInput label="Row Label" val={s.label || ''} set={v => up('label', v)} placeholder="e.g. Hero Row, CTA…" />
        <Toggle val={s.visible !== false} set={v => up('visible', v)} label="Visible" />
      </PropSec>

      {/* 2 — Columns */}
      <PropSec title="Columns">
        <FL>Column Spacing</FL>
        <SegCtrl
          val={s.colSpacing || 'normal'}
          set={v => { const m={collapse:0,small:6,normal:12,large:24}; up('colSpacing',v); up('colGap',m[v]); }}
          opts={[{v:'collapse',l:'None'},{v:'small',l:'S'},{v:'normal',l:'M'},{v:'large',l:'L'}]}
        />
        <FL>Column Style</FL>
        <SegCtrl
          val={s.colStyle || 'normal'}
          set={v => up('colStyle', v)}
          opts={[{v:'normal',l:'Normal'},{v:'divided',l:'Divided'},{v:'dash',l:'Dash'}]}
        />
        {(s.colStyle === 'divided' || s.colStyle === 'dash') && (
          <ColorPick label="Divider Color" val={s.colDividerColor || '#e2e8f0'} set={v => up('colDividerColor', v)} />
        )}
      </PropSec>

      {/* 3 — Background */}
      <BackgroundEditor s={s} up={up} />

      {/* 4 — Layout */}
      <PropSec title="Layout">
        <SegCtrl
          label="Width"
          val={s.widthMode || 'boxed'}
          set={v => up('widthMode', v)}
          opts={[{v:'boxed',l:'Boxed'},{v:'full',l:'Full'},{v:'custom',l:'Custom'}]}
        />
        {(s.widthMode === 'boxed' || !s.widthMode) && (
          <NumberInput label="Max Width" val={s.maxWidth != null ? +s.maxWidth : ''} set={v => up('maxWidth', v)} min={0} max={9999} unit="px" />
        )}
        {s.widthMode === 'custom' && (
          <NumberInput label="Row Width" val={s.customWidth != null ? +s.customWidth : ''} set={v => up('customWidth', v)} min={0} max={9999} unit="px" />
        )}
        <Divider />
        <FL>Vertical Align</FL>
        <SegCtrl
          val={s.valign || 'middle'}
          set={v => up('valign', v)}
          opts={[{v:'top',l:'↑ Top'},{v:'middle',l:'⊕ Mid'},{v:'bottom',l:'↓ Bot'},{v:'stretch',l:'↕ Eq'}]}
        />
        <FL>Horizontal Align</FL>
        <SegCtrl
          val={s.halign || 'center'}
          set={v => up('halign', v)}
          opts={[{v:'flex-start',l:'← Left'},{v:'center',l:'⊙ Ctr'},{v:'flex-end',l:'→ Right'}]}
        />
        <NumberInput label="Min Height" val={s.height != null ? +s.height : ''} set={v => up('height', v)} min={0} max={1200} unit="px" />
      </PropSec>

      {/* 5 — Border & Radius */}
      <PropSec title="Border & Radius">
        <NumberInput label="Border Radius" val={+(s.radius || 0)} set={v => up('radius', v)} min={0} max={100} unit="px" />
        <Divider />
        <SelectInput
          label="Border Style"
          val={s.borderStyle || 'none'}
          set={v => up('borderStyle', v)}
          opts={[{v:'none',l:'None'},{v:'solid',l:'Solid'},{v:'dashed',l:'Dashed'},{v:'dotted',l:'Dotted'}]}
        />
        {s.borderStyle && s.borderStyle !== 'none' && (
          <>
            <ColorPick label="Border Color" val={s.borderColor || '#e2e8f0'} set={v => up('borderColor', v)} />
            <NumberInput label="Border Width" val={+(s.borderWidth || 1)} set={v => up('borderWidth', v)} min={1} max={16} unit="px" />
          </>
        )}
      </PropSec>

      {/* 6 — Spacing */}
      <PropSec title="Spacing">
        <SpacingBox
          label="Padding"
          top={+(s.padTop    ?? s.padV ?? 0)}
          right={+(s.padRight  ?? s.padH ?? 32)}
          bottom={+(s.padBottom ?? s.padV ?? 0)}
          left={+(s.padLeft   ?? s.padH ?? 32)}
          setTop={v    => up('padTop',    v)}
          setRight={v  => up('padRight',  v)}
          setBottom={v => up('padBottom', v)}
          setLeft={v   => up('padLeft',   v)}
        />
        <Divider />
        <SpacingBox
          label="Margin"
          top={+(s.marginTop    ?? 0)}
          right={+(s.marginRight  ?? 0)}
          bottom={+(s.marginBottom ?? 0)}
          left={+(s.marginLeft   ?? 0)}
          setTop={v    => up('marginTop',    v)}
          setRight={v  => up('marginRight',  v)}
          setBottom={v => up('marginBottom', v)}
          setLeft={v   => up('marginLeft',   v)}
        />
      </PropSec>

      {/* 7 — Effects */}
      <PropSec title="Effects">
        <Toggle val={s.colDepthHover || false} set={v => up('colDepthHover', v)} label="Column Depth on Hover" />
        {s.colDepthHover && (
          <SliderInput label="Shadow Intensity" val={+(s.colDepthIntensity ?? 40)} set={v => up('colDepthIntensity', v)} min={10} max={100} unit="%" />
        )}
      </PropSec>

      {/* 8 — Mobile */}
      <PropSec title="Mobile">
        <FL>By default, columns automatically stack vertically on mobile screens. Enable the option below to keep the desktop column layout on mobile.</FL>
        <Toggle
          val={s.forceColsMobile || false}
          set={v => up('forceColsMobile', v)}
          label="Force columns layout on mobile"
        />
        {s.forceColsMobile && (
          <div style={{ fontSize: 11, color: '#f59e0b', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '6px 10px', marginTop: 4 }}>
            ⚠️ Columns will not stack on mobile. Content may appear cramped on small screens.
          </div>
        )}
      </PropSec>

      {/* 9 — Custom CSS */}
      <CustomCssEditor s={s} up={up} />
    </>
  );
}
