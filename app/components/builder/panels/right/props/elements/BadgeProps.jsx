'use client';
import { PropSec, RInput, NumberInput, SliderInput, SegCtrl, Toggle, ColorPick } from '../../../../../shared/ui';

export function BadgeProps({ el, onChange }) {
  const p = el.props || {};
  const up = (k, v) => onChange({ [k]: v });
  return (
    <>
      <PropSec title="Content">
        <RInput label="Text" val={p.text || ''} set={v => up('text', v)} placeholder="NEW" />
        <RInput label="Icon (emoji)" val={p.icon || ''} set={v => up('icon', v)} placeholder="🔥" />
      </PropSec>
      <PropSec title="Style">
        <SegCtrl label="Variant" val={p.variant || 'solid'} set={v => up('variant', v)} opts={[{v:'solid',l:'Solid'},{v:'outline',l:'Outline'},{v:'soft',l:'Soft'}]} />
        <ColorPick label="Color" val={p.bg || '#10b981'} set={v => up('bg', v)} />
        <SliderInput label="Font Size" val={+(p.fontSize || 11)} set={v => up('fontSize', v)} min={8} max={20} unit="px" />
        <SliderInput label="Border Radius" val={+(p.borderRadius ?? 99)} set={v => up('borderRadius', v)} min={0} max={99} unit="px" />
        <NumberInput label="H Padding" val={+(p.padH || 10)} set={v => up('padH', v)} min={0} max={40} unit="px" />
        <NumberInput label="V Padding" val={+(p.padV || 4)} set={v => up('padV', v)} min={0} max={20} unit="px" />
        <Toggle val={p.uppercase || false} set={v => up('uppercase', v)} label="Uppercase" />
      </PropSec>
    </>
  );
}
