'use client';
import { PropSec, RInput, SliderInput, NumberInput, Toggle, ColorPick, SegCtrl } from '../../../../../shared/ui';

export function AddToCartProps({ el, onChange }) {
  const p = el.props || {};
  const up = (k, v) => onChange({ [k]: v });
  return (
    <>
      <PropSec title="Content">
        <RInput label="Button Text" val={p.text || 'Add to Cart'} set={v => up('text', v)} />
        <Toggle val={p.showIcon !== false} set={v => up('showIcon', v)} label="Show Cart Icon" />
        <Toggle val={p.fullWidth || false} set={v => up('fullWidth', v)} label="Full Width" />
        <Toggle val={p.disabled || false} set={v => up('disabled', v)} label="Disabled State" />
      </PropSec>
      <PropSec title="Style">
        <ColorPick label="Background" val={p.bg || '#6366f1'} set={v => up('bg', v)} />
        <ColorPick label="Text Color" val={p.color || '#ffffff'} set={v => up('color', v)} />
        <SliderInput label="Font Size" val={+(p.fontSize || 15)} set={v => up('fontSize', v)} min={11} max={24} unit="px" />
        <SliderInput label="Border Radius" val={+(p.borderRadius || 8)} set={v => up('borderRadius', v)} min={0} max={50} unit="px" />
        <NumberInput label="V Padding" val={+(p.padV || 14)} set={v => up('padV', v)} min={4} max={40} unit="px" />
        <NumberInput label="H Padding" val={+(p.padH || 28)} set={v => up('padH', v)} min={4} max={80} unit="px" />
        <Toggle val={p.outline || false} set={v => up('outline', v)} label="Outline Style" />
      </PropSec>
    </>
  );
}
