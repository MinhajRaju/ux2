'use client';
/**
 * SectionProps.jsx
 * Right-panel options for a selected Section element.
 *
 * Sections:
 *  1. General        — label / visible
 *  2. Background     — image (upload + media-center), color, gradient, overlay
 *  3. Effects        — entrance animations
 *  4. Layout         — theme (light/dark), sticky, mask shape, angle
 *  5. Spacing        — padding (SpacingBox), min-height, margin (SpacingBox)
 *  6. Scroll/Loading — scroll-for-more, loading spinner
 *  7. Shape Dividers — top + bottom
 *  8. Video          — YouTube / MP4, muted, loop
 *  9. Custom CSS     — class name + CSS textarea
 */
import { useRef, useState } from 'react';
import {
  PropSec, FL, RInput, NumberInput, ColorPick,
  SliderInput, SegCtrl, Toggle, SelectInput, SpacingBox, Divider, BackgroundEditor,
} from '../../../../shared/ui';
import { T } from '../../../../../constants/theme';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function btnStyle(color) {
  return {
    padding: '7px 0', fontSize: 11, fontWeight: 600,
    border: `1.5px solid ${color}`, borderRadius: 7,
    cursor: 'pointer', background: `${color}15`, color,
    width: '100%', transition: 'background 0.15s',
  };
}

/* ─── ImageUploadField ─────────────────────────────────────────────────────── */
function ImageUploadField({ label, val, set, onMediaCenter }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {label && <FL>{label}</FL>}
      {val && (
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <img
            src={val}
            alt="bg preview"
            style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 7, border: `1.5px solid ${T.border}` }}
          />
          <button
            onClick={() => set('')}
            title="Remove"
            style={{
              position: 'absolute', top: 4, right: 4, width: 20, height: 20,
              background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: 4,
              color: '#fff', fontSize: 11, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button onClick={() => fileRef.current?.click()} style={btnStyle(T.primary)}>⬆ Upload</button>
        <button onClick={onMediaCenter} style={btnStyle(T.textMid)}>🗂 Media Center</button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      <div style={{ marginTop: 8 }}>
        <RInput val={val || ''} set={set} placeholder="or paste image URL…" />
      </div>
    </div>
  );
}

/* ─── SectionBackgroundEditor — uses shared BackgroundEditor + overlay ─────── */
function SectionBackgroundEditor({ s, up }) {
  return (
    <>
      <BackgroundEditor s={s} up={up} />
      {(s.bgType === 'image' || s.bgType === 'gradient') && (
        <PropSec title="Overlay">
          <Toggle val={s.overlayOn || false} set={v => up('overlayOn', v)} label="Overlay" />
          {s.overlayOn && (
            <>
              <ColorPick label="Overlay Color" val={s.overlayColor || 'rgba(0,0,0,0.4)'} set={v => up('overlayColor', v)} />
              <SliderInput label="Opacity" val={+(s.overlayOpacity ?? 40)} set={v => up('overlayOpacity', v)} min={0} max={100} unit="%" />
            </>
          )}
        </PropSec>
      )}
    </>
  );
}

/* ─── EffectsEditor ─────────────────────────────────────────────────────────── */
function EffectsEditor({ s, up }) {
  return (
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
          <SliderInput label="Delay"    val={+(s.animDelay ?? 0)}      set={v => up('animDelay', v)}    min={0}   max={2000} unit="ms" step={50} />
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
  );
}

/* ─── LayoutEditor ──────────────────────────────────────────────────────────── */
function LayoutEditor({ s, up }) {
  return (
    <PropSec title="Layout">
      <SegCtrl
        label="Theme"
        val={s.theme || 'light'}
        set={v => up('theme', v)}
        opts={[
          { v: 'light', l: '☀ Light' },
          { v: 'dark',  l: '🌙 Dark' },
        ]}
      />
      <Toggle val={s.sticky || false} set={v => up('sticky', v)} label="Sticky Section" />
      <Divider />
      <SelectInput
        label="Mask Shape"
        val={s.maskShape || 'none'}
        set={v => up('maskShape', v)}
        opts={[
          { v: 'none',    l: 'None' },
          { v: 'circle',  l: '⬤ Circle' },
          { v: 'arrow',   l: '➤ Arrow' },
          { v: 'ellipse', l: '⬭ Ellipse' },
        ]}
      />
      <SelectInput
        label="Section Angle"
        val={s.sectionAngle || 'none'}
        set={v => up('sectionAngle', v)}
        opts={[
          { v: 'none',        l: 'None' },
          { v: 'angle-left',  l: '/ Angle Left' },
          { v: 'angle-right', l: '\\ Angle Right' },
          { v: 'angle-both',  l: 'X Angle Both' },
        ]}
      />
    </PropSec>
  );
}

/* ─── SpacingEditor ─────────────────────────────────────────────────────────── */
function SpacingEditor({ s, up }) {
  return (
    <PropSec title="Spacing">
      <SpacingBox
        label="Padding"
        top={+(s.padTop    ?? 0)}
        right={+(s.padRight  ?? 0)}
        bottom={+(s.padBottom ?? 0)}
        left={+(s.padLeft   ?? 0)}
        setTop={v    => up('padTop',    v)}
        setRight={v  => up('padRight',  v)}
        setBottom={v => up('padBottom', v)}
        setLeft={v   => up('padLeft',   v)}
      />
      <NumberInput label="Min Height" val={s.minHeight != null ? +s.minHeight : ''} set={v => up('minHeight', v)} min={0} max={2000} unit="px" />
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
  );
}

/* ─── ScrollLoadingEditor ───────────────────────────────────────────────────── */
function ScrollLoadingEditor({ s, up }) {
  return (
    <PropSec title="Scroll & Loading">
      <Toggle val={s.scrollForMore  || false} set={v => up('scrollForMore',  v)} label="Scroll for More" />
      <Toggle val={s.loadingSpinner || false} set={v => up('loadingSpinner', v)} label="Loading Spinner" />
    </PropSec>
  );
}

/* ─── ShapeDividerEditor ────────────────────────────────────────────────────── */
const DIVIDER_SHAPES = [
  { v: 'none',   l: 'None' },
  { v: 'wave',   l: '〜 Wave' },
  { v: 'curve',  l: '∪ Curve' },
  { v: 'tilt',   l: '/ Tilt' },
  { v: 'arrow',  l: '▼ Arrow' },
  { v: 'zigzag', l: 'zig-zag' },
];

function DividerSide({ label, shapeKey, colorKey, heightKey, flipKey, s, up }) {
  const hasShape = s[shapeKey] && s[shapeKey] !== 'none';
  return (
    <>
      <FL>{label}</FL>
      <SelectInput val={s[shapeKey] || 'none'} set={v => up(shapeKey, v)} opts={DIVIDER_SHAPES} />
      {hasShape && (
        <>
          <ColorPick label="Color"  val={s[colorKey]  || '#ffffff'} set={v => up(colorKey, v)} />
          <NumberInput label="Height" val={s[heightKey] != null ? +s[heightKey] : ''} set={v => up(heightKey, v)} min={10} max={300} unit="px" />
          <Toggle val={s[flipKey] || false} set={v => up(flipKey, v)} label="Flip" />
        </>
      )}
    </>
  );
}

function ShapeDividerEditor({ s, up }) {
  return (
    <PropSec title="Shape Divider">
      <DividerSide label="Top Divider"    shapeKey="dividerTopShape"    colorKey="dividerTopColor"    heightKey="dividerTopHeight"    flipKey="dividerTopFlip"    s={s} up={up} />
      <Divider />
      <DividerSide label="Bottom Divider" shapeKey="dividerBottomShape" colorKey="dividerBottomColor" heightKey="dividerBottomHeight" flipKey="dividerBottomFlip" s={s} up={up} />
    </PropSec>
  );
}

/* ─── VideoEditor ───────────────────────────────────────────────────────────── */
function VideoEditor({ s, up }) {
  return (
    <PropSec title="Video Background">
      <SegCtrl
        label="Source"
        val={s.videoType || 'none'}
        set={v => up('videoType', v)}
        opts={[
          { v: 'none',    l: 'Off' },
          { v: 'youtube', l: 'YouTube' },
          { v: 'mp4',     l: 'MP4' },
        ]}
      />
      {s.videoType === 'youtube' && (
        <RInput label="YouTube URL" val={s.videoUrl || ''} set={v => up('videoUrl', v)} placeholder="https://youtube.com/watch?v=…" />
      )}
      {s.videoType === 'mp4' && (
        <RInput label="MP4 URL" val={s.videoUrl || ''} set={v => up('videoUrl', v)} placeholder="https://example.com/video.mp4" />
      )}
      {s.videoType && s.videoType !== 'none' && (
        <>
          <Toggle val={s.videoMuted !== false} set={v => up('videoMuted', v)} label="Muted" />
          <Toggle val={s.videoLoop  !== false} set={v => up('videoLoop',  v)} label="Loop" />
        </>
      )}
    </PropSec>
  );
}

/* ─── Smart CSS Editor ─────────────────────────────────────────────────────── */

// Common CSS properties for autocomplete
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
  'opacity','box-shadow','transform','transition',
  'overflow','cursor','pointer-events','visibility',
];

const CSS_VALUES = {
  'display':          ['flex','grid','block','inline-block','inline','none'],
  'flex-direction':   ['row','column','row-reverse','column-reverse'],
  'align-items':      ['flex-start','flex-end','center','stretch','baseline'],
  'justify-content':  ['flex-start','flex-end','center','space-between','space-around'],
  'text-align':       ['left','center','right','justify'],
  'font-weight':      ['400','500','600','700','800','900','bold','normal'],
  'text-transform':   ['none','uppercase','lowercase','capitalize'],
  'overflow':         ['hidden','visible','auto','scroll'],
  'cursor':           ['pointer','default','not-allowed','grab'],
  'position':         ['static','relative','absolute','fixed','sticky'],
  'border-style':     ['solid','dashed','dotted','none'],
  'background-size':  ['cover','contain','auto','100%'],
  'background-position': ['center','top','bottom','left','right'],
  'visibility':       ['visible','hidden'],
};

function autoImportant(css) {
  return css.split('\n').map(line => {
    const trimmed = line.trim();

    // Skip: empty, comments, @rules, lines with { or }
    if (
      !trimmed ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('@') ||
      trimmed.includes('{') ||
      trimmed === '}'
    ) return line;

    // Must have a colon to be a property declaration
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) return line;

    // Property name must be a single word (no spaces, no selector chars)
    const propName = trimmed.slice(0, colonIdx).trim();
    if (!propName || /\s/.test(propName) || /[.#&>~+\[\]]/.test(propName)) return line;

    // Ensure !important
    let result = line;
    if (!result.includes('!important')) {
      result = result.replace(/;?\s*$/, ' !important');
    }

    // Always ensure semicolon at end
    if (!result.trimEnd().endsWith(';')) {
      result = result.trimEnd() + ';';
    }

    return result;
  }).join('\n');
}

// Visual quick-controls → generates CSS with !important
function VisualControls({ cls, visualProps, setVisual }) {
  const set = (k, v) => setVisual(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 10, color: T.textLight, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Quick Overrides → auto-generates CSS
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <ColorPick label="Background" val={visualProps.bg || ''} set={v => set('bg', v)} />
        <ColorPick label="Text Color" val={visualProps.color || ''} set={v => set('color', v)} />
      </div>

      <NumberInput label="Border Radius" val={+(visualProps.borderRadius ?? '')} set={v => set('borderRadius', v)} min={0} max={120} unit="px" />
      <SliderInput label="Opacity" val={+(visualProps.opacity ?? 100)} set={v => set('opacity', v)} min={0} max={100} unit="%" />

      <SelectInput
        label="Box Shadow"
        val={visualProps.shadow || 'none'}
        set={v => set('shadow', v)}
        opts={[
          { v: 'none', l: 'None' },
          { v: '0 4px 12px rgba(0,0,0,0.08)', l: 'Soft' },
          { v: '0 8px 24px rgba(0,0,0,0.12)', l: 'Medium' },
          { v: '0 12px 32px rgba(0,0,0,0.18)', l: 'Strong' },
          { v: '0 20px 60px rgba(0,0,0,0.25)', l: 'Heavy' },
          { v: 'inset 0 2px 8px rgba(0,0,0,0.1)', l: 'Inset' },
        ]}
      />
    </div>
  );
}

// Convert visualProps → CSS string with !important
function visualToCSS(cls, vp) {
  if (!cls) return '';
  const lines = [];
  if (vp.bg)           lines.push(`  background: ${vp.bg} !important;`);
  if (vp.color)        lines.push(`  color: ${vp.color} !important;`);
  if (vp.borderRadius) lines.push(`  border-radius: ${vp.borderRadius}px !important;`);
  if (vp.opacity != null && vp.opacity !== 100)
                       lines.push(`  opacity: ${vp.opacity / 100} !important;`);
  if (vp.shadow && vp.shadow !== 'none')
                       lines.push(`  box-shadow: ${vp.shadow} !important;`);
  if (!lines.length) return '';
  return `.${cls} {\n${lines.join('\n')}\n}`;
}

// Code editor with inline autocomplete
function CssCodeEditor({ cls, val, set }) {
  const [suggestions, setSuggestions] = useState([]);
  const [suggestPos, setSuggestPos]   = useState({ top: 0, left: 0, width: 200 });
  const [activeSug, setActiveSug]     = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [isValueMode, setIsValueMode] = useState(false);
  const [currentProp, setCurrentProp] = useState('');
  const taRef = useRef();

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSug(i => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveSug(i => Math.max(i - 1, 0)); }
    if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); applySuggestion(suggestions[activeSug]); }
    if (e.key === 'Escape') setSuggestions([]);
  };

  const applySuggestion = (sug) => {
    const ta = taRef.current;
    if (!ta) return;
    const pos    = ta.selectionStart;
    const text   = ta.value;
    const start  = pos - currentWord.length;
    const suffix = isValueMode ? ';' : ': ';
    set(text.slice(0, start) + sug + suffix + text.slice(pos));
    setSuggestions([]);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + sug.length + suffix.length;
    }, 0);
  };

  const handleChange = (e) => {
    set(e.target.value);
    computeSuggestions(e.target);
  };

  const computeSuggestions = (ta) => {
    const pos    = ta.selectionStart;
    const before = ta.value.slice(0, pos);
    const lastBreak = Math.max(before.lastIndexOf('\n'), before.lastIndexOf('{'));
    const lineStr   = before.slice(lastBreak + 1);
    const colonIdx  = lineStr.lastIndexOf(':');
    const semiIdx   = lineStr.lastIndexOf(';');

    let word = '', valueMode = false, propName = '';
    if (colonIdx > semiIdx && colonIdx !== -1) {
      word      = lineStr.slice(colonIdx + 1).trimStart().split(/\s/).pop() || '';
      propName  = lineStr.slice(0, colonIdx).trim().toLowerCase();
      valueMode = true;
    } else {
      word = lineStr.trim().split(/\s/).pop() || '';
    }

    setCurrentWord(word);
    setIsValueMode(valueMode);
    setCurrentProp(propName);
    setActiveSug(0);

    if (!word) { setSuggestions([]); return; }

    const pool     = valueMode ? (CSS_VALUES[propName] || []) : CSS_PROPS;
    const filtered = pool.filter(p => p.startsWith(word) && p !== word).slice(0, 8);
    setSuggestions(filtered);

    if (!filtered.length) return;

    // Mirror positioned fixed over textarea to get exact caret viewport coords
    const taRect = ta.getBoundingClientRect();
    const mirror = document.createElement('div');
    const cs     = window.getComputedStyle(ta);
    ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing',
     'paddingTop','paddingBottom','paddingLeft','paddingRight',
     'borderTopWidth','borderLeftWidth','boxSizing','whiteSpace',
     'wordWrap','wordBreak'].forEach(p => { mirror.style[p] = cs[p]; });

    Object.assign(mirror.style, {
      position: 'fixed', visibility: 'hidden', pointerEvents: 'none', zIndex: '-1',
      top:    taRect.top  + 'px',
      left:   taRect.left + 'px',
      width:  taRect.width  + 'px',
      height: taRect.height + 'px',
      overflow: 'hidden', whiteSpace: 'pre-wrap', wordWrap: 'break-word',
    });

    mirror.textContent = before;
    const sentinel = document.createElement('span');
    sentinel.textContent = '\u200b';
    mirror.appendChild(sentinel);
    document.body.appendChild(mirror);
    const sr = sentinel.getBoundingClientRect();
    document.body.removeChild(mirror);

    const DROPDOWN_H  = Math.min(filtered.length * 32 + 30, 300);
    const spaceBelow  = window.innerHeight - sr.bottom;
    const dropTop  = spaceBelow > DROPDOWN_H ? sr.bottom + 2 : sr.top - DROPDOWN_H - 2;
    const dropLeft = Math.min(sr.left, window.innerWidth - 220);

    setSuggestPos({ top: dropTop, left: dropLeft, width: Math.max(200, taRect.width * 0.6) });
  };

  const placeholder = cls
    ? `.${cls} {\n  font-size: 18px;\n  text-align: center;\n}\n\n.${cls} h2 {\n  color: #6366f1;\n}`
    : '';

  return (
    <div>
      <textarea
        ref={taRef}
        value={val}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={10}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        style={{
          width: '100%', boxSizing: 'border-box', padding: '10px',
          fontSize: 12, fontFamily: '"Fira Code","Cascadia Code","Consolas",monospace',
          color: '#1e293b', border: `1.5px solid ${T.border}`, borderRadius: 7,
          outline: 'none', resize: 'vertical', background: '#f8fafc',
          lineHeight: 1.8, transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = T.primary)}
        onBlur={e => { e.target.style.borderColor = T.border; setTimeout(() => setSuggestions([]), 150); }}
      />

      {/* Dropdown: position:fixed so scroll/panel nesting never breaks it */}
      {suggestions.length > 0 && (
        <div style={{
          position: 'fixed',
          top:   suggestPos.top,
          left:  suggestPos.left,
          width: suggestPos.width,
          background: '#fff',
          border: `1.5px solid ${T.border}`,
          borderRadius: 8,
          boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
          zIndex: 99999,
          overflow: 'hidden',
        }}>
          <div style={{
            fontSize: 9, color: T.textLight, padding: '4px 10px',
            background: T.light, borderBottom: `1px solid ${T.border}`,
            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {isValueMode ? `values for ${currentProp}` : 'css properties'} · Tab to insert
          </div>
          {suggestions.map((sg, i) => (
            <div
              key={sg}
              onMouseDown={e => { e.preventDefault(); applySuggestion(sg); }}
              style={{
                padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'monospace',
                color:      i === activeSug ? T.primary : T.text,
                background: i === activeSug ? T.primaryLight : 'transparent',
                fontWeight: i === activeSug ? 700 : 400,
              }}
            >
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

  const handleCodeChange = (raw) => {
    up('customCss', autoImportant(raw));
  };

  return (
    <PropSec title="Custom CSS">
      <RInput
        label="CSS Class Name"
        val={cls}
        set={v => up('customClass', v.replace(/[^a-zA-Z0-9_-]/g, ''))}
        placeholder="e.g. my-hero-section"
      />

      {cls && (
        <>
          <div style={{ background: T.primaryLight, borderRadius: 6, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'monospace', color: T.primary, fontWeight: 700, fontSize: 12 }}>.{cls}</span>
            <span style={{ fontSize: 10, color: T.textLight }}>applied to this section</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FL>CSS Editor</FL>
            <span style={{ fontSize: 10, color: T.success, fontWeight: 600 }}>✓ !important auto-added</span>
          </div>

          <CssCodeEditor
            cls={cls}
            val={s.customCss || ''}
            set={handleCodeChange}
          />

          <div style={{ fontSize: 10, color: T.textLight, lineHeight: 1.6 }}>
            Tab/Enter to accept suggestion · <code style={{ background: T.light, padding: '1px 4px', borderRadius: 3 }}>.{cls} h2 {'{ }'}</code> for child elements
          </div>
        </>
      )}
    </PropSec>
  );
}

/* ─── SectionProps (root export) ────────────────────────────────────────────── */
export function SectionProps({ section, onChange }) {
  const s  = section.settings || {};
  const up = (k, v) => onChange({ [k]: v });

  // Dispatch a custom event that the parent app can listen to for the media center
  const handleMediaCenter = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-media-center', {
        detail: { callback: (url) => up('bgImage', url) },
      }));
    }
  };

  return (
    <>
      {/* 1 — General */}
      <PropSec title="General">
        <RInput label="Section Name" val={s.label || ''} set={v => up('label', v)} placeholder="e.g. Hero, About Us…" />
        <Toggle val={s.visible !== false} set={v => up('visible', v)} label="Visible" />
      </PropSec>

      {/* 2 — Background */}
      <SectionBackgroundEditor s={s} up={up} />

      {/* 3 — Effects */}
      <EffectsEditor s={s} up={up} />

      {/* 4 — Layout */}
      <LayoutEditor s={s} up={up} />

      {/* 5 — Spacing */}
      <SpacingEditor s={s} up={up} />

      {/* 6 — Scroll & Loading */}
      <ScrollLoadingEditor s={s} up={up} />

      {/* 7 — Shape Dividers */}
      <ShapeDividerEditor s={s} up={up} />

      {/* 8 — Video Background */}
      <VideoEditor s={s} up={up} />

      {/* 9 — Custom CSS */}
      <CustomCssEditor s={s} up={up} />
    </>
  );
}
