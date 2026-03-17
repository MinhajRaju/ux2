'use client';
import { PropSec, FL, ColorPick, SliderInput, SegCtrl, SpacingBox, Divider } from '../../../../../shared/ui';
import { T } from '../../../../../../constants/theme';

// Default font sizes per tag
const TAG_DEFAULTS = { h1: 48, h2: 36, h3: 28, h4: 22, p: 16 };

// Reusable typography section — used by heading + text props
export function TypographySection({ p, up }) {
  return (
    <PropSec title="Typography">
      <SliderInput label="Size" val={+(p.fontSize || 16)} set={v => up('fontSize', v)} min={8} max={120} unit="px" />
      <ColorPick label="Text Color" val={p.color || ''} set={v => up('color', v)} />
      <ColorPick label="Background Color" val={p.bg || ''} set={v => up('bg', v)} />
      <SegCtrl
        label="Alignment"
        val={p.textAlign || 'left'}
        set={v => up('textAlign', v)}
        opts={[{ v: 'left', l: 'Left' }, { v: 'center', l: 'Center' }, { v: 'right', l: 'Right' }]}
      />
      <SegCtrl
        label="Weight"
        val={String(p.fontWeight || '400')}
        set={v => up('fontWeight', v)}
        opts={[{ v: '400', l: 'Regular' }, { v: '600', l: 'Semi' }, { v: '700', l: 'Bold' }, { v: '800', l: 'Extra' }]}
      />
      <SliderInput label="Line Height" val={+(p.lineHeight || 1.5)} set={v => up('lineHeight', v)} min={1} max={3} step={0.05} unit="×" />
      <SliderInput label="Letter Spacing" val={+(p.letterSpacing || 0)} set={v => up('letterSpacing', v)} min={-2} max={10} step={0.1} unit="px" />
    </PropSec>
  );
}

export function HeadingTextProps({ el, onChange }) {
  const p  = el.props || {};
  const up = (k, v) => onChange({ [k]: v });

  // When tag changes, auto-set a sensible default font size
  const handleTagChange = (tag) => {
    up('tag', tag);
    const prevDefault = TAG_DEFAULTS[p.tag || 'h2'];
    const curSize = +(p.fontSize || prevDefault);
    if (curSize === prevDefault || !p.fontSize) {
      up('fontSize', TAG_DEFAULTS[tag]);
    }
  };

  return (
    <>
      {/* ── Content ── */}
      <PropSec title="Content">
        <textarea
          value={p.content || ''}
          onChange={e => up('content', e.target.value)}
          rows={4}
          placeholder="Type your content here..."
          style={{
            width: '100%', padding: '10px', fontSize: 13, lineHeight: 1.5,
            border: `1.5px solid ${T.border}`, borderRadius: 7, resize: 'vertical',
            outline: 'none', fontFamily: 'inherit', color: T.textMid, background: T.light,
            boxSizing: 'border-box', transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = T.primary)}
          onBlur={e => (e.target.style.borderColor = T.border)}
        />

        {el.type === 'heading' && (
          <>
            <FL>HTML Tag</FL>
            <div style={{ display: 'flex', gap: 4 }}>
              {['h1','h2','h3','h4','p'].map(tag => {
                const active = (p.tag || 'h2') === tag;
                const sizes  = { h1: 18, h2: 16, h3: 13, h4: 12, p: 11 };
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagChange(tag)}
                    title={`${tag.toUpperCase()} — default ${TAG_DEFAULTS[tag]}px`}
                    style={{
                      flex: 1, padding: '6px 4px',
                      fontSize: sizes[tag], fontWeight: tag === 'p' ? 400 : 700,
                      border: `1.5px solid ${active ? T.primary : T.border}`,
                      borderRadius: 7, cursor: 'pointer',
                      background: active ? T.primaryLight : '#fff',
                      color: active ? T.primary : T.textMid,
                      transition: 'all 0.12s', lineHeight: 1,
                    }}
                  >
                    {tag.toUpperCase()}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 10, color: T.textLight, marginTop: -2 }}>
              Default for {(p.tag || 'h2').toUpperCase()}: <strong>{TAG_DEFAULTS[p.tag || 'h2']}px</strong>
            </div>
          </>
        )}
      </PropSec>

      {/* ── Typography ── */}
      <TypographySection p={p} up={up} />

      {/* ── Spacing ── */}
      <PropSec title="Spacing">
        <SpacingBox
          label="Padding"
          top={+(p.padTop    ?? 4)}
          right={+(p.padRight  ?? 0)}
          bottom={+(p.padBottom ?? 4)}
          left={+(p.padLeft   ?? 0)}
          setTop={v    => up('padTop',    v)}
          setRight={v  => up('padRight',  v)}
          setBottom={v => up('padBottom', v)}
          setLeft={v   => up('padLeft',   v)}
        />
        <Divider />
        <SpacingBox
          label="Margin"
          top={+(p.marginTop    ?? 0)}
          right={+(p.marginRight  ?? 0)}
          bottom={+(p.marginBottom ?? 0)}
          left={+(p.marginLeft   ?? 0)}
          setTop={v    => up('marginTop',    v)}
          setRight={v  => up('marginRight',  v)}
          setBottom={v => up('marginBottom', v)}
          setLeft={v   => up('marginLeft',   v)}
        />
      </PropSec>
    </>
  );
}
