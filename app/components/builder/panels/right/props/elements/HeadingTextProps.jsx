'use client';
import { PropSec, FL, ColorPick, SliderInput, SegCtrl } from '../../../../../shared/ui';

// Reusable typography section — used by heading + text props
export function TypographySection({ p, up }) {
  return (
    <PropSec title="Typography">
      <SliderInput label="Size" val={+(p.fontSize || 16)} set={v => up('fontSize', v)} min={8} max={120} unit="px" />
      <ColorPick label="Color" val={p.color || '#0f172a'} set={v => up('color', v)} />
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
    </PropSec>
  );
}

export function HeadingTextProps({ el, onChange }) {
  const p  = el.props || {};
  const up = (k, v) => onChange({ [k]: v });

  return (
    <>
      <PropSec title="Content">
        <textarea
          value={p.content || ''}
          onChange={e => up('content', e.target.value)}
          rows={4}
          placeholder="Type your content here..."
          style={{
            width: '100%', padding: '10px', fontSize: 13, lineHeight: 1.5,
            border: '1.5px solid #E2E8F0', borderRadius: 7, resize: 'vertical',
            outline: 'none', fontFamily: 'inherit', color: '#334155', background: '#F8FAFC',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = '#6366f1')}
          onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
        />
        {el.type === 'heading' && (
          <SegCtrl
            label="HTML Tag"
            val={p.tag || 'h2'}
            set={v => up('tag', v)}
            opts={[{ v: 'h1', l: 'H1' }, { v: 'h2', l: 'H2' }, { v: 'h3', l: 'H3' }, { v: 'h4', l: 'H4' }, { v: 'p', l: 'P' }]}
          />
        )}
      </PropSec>
      <TypographySection p={p} up={up} />
      <PropSec title="Spacing">
        <SliderInput label="Padding Top"    val={+(p.padTop    || 4)} set={v => up('padTop', v)}    min={0} max={80} unit="px" />
        <SliderInput label="Padding Bottom" val={+(p.padBottom || 4)} set={v => up('padBottom', v)} min={0} max={80} unit="px" />
      </PropSec>
    </>
  );
}
