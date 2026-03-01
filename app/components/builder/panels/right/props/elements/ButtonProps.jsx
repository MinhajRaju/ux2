'use client';
import { PropSec, RInput, ColorPick, SliderInput, NumberInput, SegCtrl } from '../../../../../shared/ui';

export function ButtonProps({ el, onChange }) {
  const p  = el.props || {};
  const up = (k, v) => onChange({ [k]: v });

  return (
    <>
      <PropSec title="Content">
        <RInput label="Label" val={p.text || p.label || ''} set={v => up('text', v)} placeholder="Button text" />
        {el.type === 'button' && (
          <RInput label="Link URL" val={p.href || '#'} set={v => up('href', v)} placeholder="https://..." />
        )}
      </PropSec>
      <PropSec title="Appearance">
        <ColorPick label="Background" val={p.bg    || '#6366f1'} set={v => up('bg', v)} />
        <ColorPick label="Text Color" val={p.color || '#ffffff'} set={v => up('color', v)} />
        <NumberInput label="Corner Radius" val={+(p.borderRadius || 8)} set={v => up('borderRadius', v)} min={0} max={40} unit="px" />
      </PropSec>
      <PropSec title="Typography">
        <SliderInput label="Font Size"   val={+(p.fontSize   || 14)} set={v => up('fontSize', v)}   min={10} max={32} unit="px" />
        <SegCtrl
          label="Weight"
          val={String(p.fontWeight || '600')}
          set={v => up('fontWeight', v)}
          opts={[{ v: '400', l: 'Regular' }, { v: '600', l: 'Semi' }, { v: '700', l: 'Bold' }]}
        />
      </PropSec>
      <PropSec title="Padding">
        <SliderInput label="Horizontal" val={+(p.padH || 24)} set={v => up('padH', v)} min={4} max={80} unit="px" />
        <SliderInput label="Vertical"   val={+(p.padV || 12)} set={v => up('padV', v)} min={2} max={40} unit="px" />
      </PropSec>
    </>
  );
}
