'use client';
/**
 * ColProps.jsx — Right-panel options for a selected Column.
 *
 * Sections:
 *  1. General         — label, visible
 *  2. Layout          — H align, V align, offset X/Y, min-height, opacity
 *  3. Divider Lines   — vertical line, horizontal line (with color/width/style)
 *  4. Background      — color, gradient, image
 *  5. Border & Radius
 *  6. Shadow
 *  7. Sticky & Overflow
 *  8. Spacing         — padding (SpacingBox), element gap, margin (SpacingBox)
 *  9. Effects & Anim  — entrance animation, duration, delay, easing
 * 10. Parallax        — parallax depth, hover depth
 * 11. Custom CSS      — class name + smart CSS editor
 */
import { useRef, useState } from 'react';
import {
  PropSec, FL, RInput, NumberInput, ColorPick,
  SliderInput, SegCtrl, Toggle, SelectInput, SpacingBox,
  Divider, BackgroundEditor, BorderEditor, ShadowEditor,
} from '../../../../shared/ui';
import { T, depthPalette } from '../../../../../constants/theme';

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

/* ─── CssCodeEditor ────────────────────────────────────────────────────────── */
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
    const ta = taRef.current; if (!ta) return;
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

/* ─── CustomCssEditor ──────────────────────────────────────────────────────── */
function CustomCssEditor({ s, up }) {
  const cls = s.customClass || '';
  return (
    <PropSec title="Custom CSS">
      <RInput label="CSS Class Name" val={cls} set={v => up('customClass', v.replace(/[^a-zA-Z0-9_-]/g, ''))} placeholder="e.g. my-col" />
      {cls && (
        <>
          <div style={{ background: T.primaryLight, borderRadius:6, padding:'5px 10px', display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontFamily:'monospace', color:T.primary, fontWeight:700, fontSize:12 }}>.{cls}</span>
            <span style={{ fontSize:10, color:T.textLight }}>applied to this column</span>
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

/* ─── ColProps (root export) ─────────────────────────────────────────────────── */
export function ColProps({ col, onChange, isSubCol = false, colDepth = 0 }) {
  const s  = col?.settings || {};
  const up = (k, v) => onChange({ [k]: v });

  const dColor = depthPalette(colDepth).accent;

  return (
    <>
      {/* Depth indicator badge */}
      {isSubCol && (
        <div style={{
          background: `${dColor}15`, borderRadius: 8, padding: '8px 14px',
          marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 11, fontWeight: 700, color: dColor,
          border: `1px solid ${dColor}30`,
        }}>
          {'↳'.repeat(colDepth)} {colDepth === 1 ? 'Sub-Column' : `Nested Column (depth ${colDepth})`}
        </div>
      )}

      {/* 1 — General */}
      <PropSec title="General">
        <RInput label="Column Label" val={s.label || ''} set={v => up('label', v)} placeholder="e.g. Left Content Col…" />
        <Toggle val={s.visible !== false} set={v => up('visible', v)} label="Visible" />
      </PropSec>

      {/* 2 — Layout & Alignment */}
      <PropSec title="Layout">
        <FL>Horizontal Align</FL>
        <SegCtrl
          val={s.align || 'flex-start'}
          set={v => up('align', v)}
          opts={[
            { v: 'flex-start',    l: '← Left' },
            { v: 'center',        l: '⊙ Center' },
            { v: 'flex-end',      l: '→ Right' },
            { v: 'space-between', l: '↔ Space' },
          ]}
        />
        <FL>Vertical Align</FL>
        <SegCtrl
          val={s.valign || 'flex-start'}
          set={v => up('valign', v)}
          opts={[
            { v: 'flex-start', l: '▲ Top' },
            { v: 'center',     l: '● Mid' },
            { v: 'flex-end',   l: '▼ Bot' },
            { v: 'stretch',    l: '↕ Str' },
          ]}
        />
        <Divider />
        <FL>Content Position Offset</FL>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <NumberInput label="Offset X" val={+(s.offsetX ?? 0)} set={v => up('offsetX', v)} min={-200} max={200} unit="px" />
          <NumberInput label="Offset Y" val={+(s.offsetY ?? 0)} set={v => up('offsetY', v)} min={-200} max={200} unit="px" />
        </div>
        <SliderInput label="← X Slide →" val={+(s.offsetX ?? 0)} set={v => up('offsetX', v)} min={-200} max={200} unit="px" />
        <SliderInput label="↑ Y Slide ↓" val={+(s.offsetY ?? 0)} set={v => up('offsetY', v)} min={-200} max={200} unit="px" />
        <Divider />
        <NumberInput label="Min Height" val={s.minHeight != null ? +s.minHeight : ''} set={v => up('minHeight', v)} min={0} max={1200} unit="px" />
        <SliderInput label="Opacity" val={+(s.opacity ?? 100)} set={v => up('opacity', v)} min={0} max={100} unit="%" />
      </PropSec>

      {/* 3 — Divider Lines */}
      <PropSec title="Divider Lines">
        <Toggle val={s.verticalLine || false} set={v => up('verticalLine', v)} label="Vertical Line (Right Border)" />
        {s.verticalLine && (
          <>
            <ColorPick label="Line Color" val={s.verticalLineColor || '#e2e8f0'} set={v => up('verticalLineColor', v)} />
            <NumberInput label="Line Width" val={s.verticalLineWidth != null ? +s.verticalLineWidth : ''} set={v => up('verticalLineWidth', v)} min={1} max={10} unit="px" />
            <SelectInput
              label="Line Style"
              val={s.verticalLineStyle || 'solid'}
              set={v => up('verticalLineStyle', v)}
              opts={[
                { v:'solid',  l:'Solid' },
                { v:'dashed', l:'Dashed' },
                { v:'dotted', l:'Dotted' },
              ]}
            />
          </>
        )}
        <Divider />
        <Toggle val={s.horizontalLine || false} set={v => up('horizontalLine', v)} label="Horizontal Line (Bottom Border)" />
        {s.horizontalLine && (
          <>
            <ColorPick label="Line Color" val={s.horizontalLineColor || '#e2e8f0'} set={v => up('horizontalLineColor', v)} />
            <NumberInput label="Line Width" val={s.horizontalLineWidth != null ? +s.horizontalLineWidth : ''} set={v => up('horizontalLineWidth', v)} min={1} max={10} unit="px" />
            <SelectInput
              label="Line Style"
              val={s.horizontalLineStyle || 'solid'}
              set={v => up('horizontalLineStyle', v)}
              opts={[
                { v:'solid',  l:'Solid' },
                { v:'dashed', l:'Dashed' },
                { v:'dotted', l:'Dotted' },
              ]}
            />
          </>
        )}
      </PropSec>

      {/* 4 — Background */}
      <BackgroundEditor s={s} up={up} />

      {/* 5 — Border & Radius */}
      <BorderEditor s={s} up={up} />

      {/* 6 — Shadow */}
      <ShadowEditor s={s} up={up} />

      {/* 7 — Sticky & Overflow */}
      <PropSec title="Sticky & Overflow">
        <Toggle val={s.sticky || false} set={v => up('sticky', v)} label="Sticky Column" />
        {s.sticky && (
          <NumberInput label="Sticky Top Offset" val={+(s.stickyTop ?? 0)} set={v => up('stickyTop', v)} min={0} max={300} unit="px" />
        )}
        <Divider />
        <SelectInput
          label="Overflow"
          val={s.overflow || 'visible'}
          set={v => up('overflow', v)}
          opts={[
            { v:'visible', l:'Visible' },
            { v:'hidden',  l:'Hidden' },
            { v:'auto',    l:'Auto' },
            { v:'scroll',  l:'Scroll' },
          ]}
        />
      </PropSec>

      {/* 8 — Spacing */}
      <PropSec title="Spacing">
        <SpacingBox
          label="Padding"
          top={+(s.padTop    ?? s.padV ?? 8)}
          right={+(s.padRight  ?? s.padH ?? 12)}
          bottom={+(s.padBottom ?? s.padV ?? 8)}
          left={+(s.padLeft   ?? s.padH ?? 12)}
          setTop={v    => up('padTop',    v)}
          setRight={v  => up('padRight',  v)}
          setBottom={v => up('padBottom', v)}
          setLeft={v   => up('padLeft',   v)}
        />
        <NumberInput label="Element Gap" val={+(s.gap ?? 12)} set={v => up('gap', v)} min={0} max={80} unit="px" />
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

      {/* 9 — Effects & Animation */}
      <PropSec title="Effects & Animation">
        <SelectInput
          label="Entrance Animation"
          val={s.animation || 'none'}
          set={v => up('animation', v)}
          opts={[
            { v: 'none',       l: 'None' },
            { v: 'fadeIn',     l: 'Fade In' },
            { v: 'fadeUp',     l: 'Fade Up' },
            { v: 'fadeDown',   l: 'Fade Down' },
            { v: 'slideLeft',  l: 'Slide from Left' },
            { v: 'slideRight', l: 'Slide from Right' },
            { v: 'zoomIn',     l: 'Zoom In' },
            { v: 'flipX',      l: 'Flip Horizontal' },
          ]}
        />
        {s.animation && s.animation !== 'none' && (
          <>
            <SliderInput label="Duration" val={+(s.animDuration ?? 600)} set={v => up('animDuration', v)} min={100} max={2000} unit="ms" step={50} />
            <SliderInput label="Delay"    val={+(s.animDelay ?? 0)}      set={v => up('animDelay',    v)} min={0}   max={2000} unit="ms" step={50} />
            <SelectInput
              label="Easing"
              val={s.animEasing || 'ease'}
              set={v => up('animEasing', v)}
              opts={[
                { v: 'ease',        l: 'Ease' },
                { v: 'ease-in',     l: 'Ease In' },
                { v: 'ease-out',    l: 'Ease Out' },
                { v: 'ease-in-out', l: 'Ease In-Out' },
                { v: 'linear',      l: 'Linear' },
              ]}
            />
          </>
        )}
      </PropSec>

      {/* 10 — Parallax & Depth */}
      <PropSec title="Parallax & Depth">
        <Toggle val={s.parallax || false} set={v => up('parallax', v)} label="Parallax Effect" />
        {s.parallax && (
          <SliderInput label="Parallax Depth" val={+(s.parallaxDepth ?? 30)} set={v => up('parallaxDepth', v)} min={5} max={100} unit="%" />
        )}
        <Divider />
        <Toggle val={s.depthHover || false} set={v => up('depthHover', v)} label="Depth on Hover" />
        {s.depthHover && (
          <SliderInput label="Hover Shadow Intensity" val={+(s.depthIntensity ?? 40)} set={v => up('depthIntensity', v)} min={10} max={100} unit="%" />
        )}
      </PropSec>

      {/* 11 — Custom CSS */}
      <CustomCssEditor s={s} up={up} />
    </>
  );
}
