'use client';
import { PropSec, RInput, NumberInput, SliderInput, Toggle, ColorPick } from '../../../../../shared/ui';

export function CountdownTimerProps({ el, onChange }) {
  const p = el.props || {};
  const up = (k, v) => onChange({ [k]: v });
  return (
    <>
      <PropSec title="Timer Settings">
        <RInput label="Label" val={p.label || ''} set={v => up('label', v)} placeholder="Sale ends in:" />
        <RInput label="Target Date & Time" val={p.targetDate || ''} set={v => up('targetDate', v)} placeholder="2025-12-31T23:59" type="datetime-local" />
        <Toggle val={p.showDays !== false} set={v => up('showDays', v)} label="Show Days" />
        <RInput label="Ended Message" val={p.endText || ''} set={v => up('endText', v)} placeholder="Sale has ended!" />
      </PropSec>
      <PropSec title="Box Style">
        <ColorPick label="Box Background" val={p.boxBg || '#0f172a'} set={v => up('boxBg', v)} />
        <ColorPick label="Number Color" val={p.numColor || '#ffffff'} set={v => up('numColor', v)} />
        <ColorPick label="Label Color" val={p.labelColor || '#64748b'} set={v => up('labelColor', v)} />
        <SliderInput label="Number Size" val={+(p.numSize || 28)} set={v => up('numSize', v)} min={14} max={56} unit="px" />
        <NumberInput label="Box Width" val={+(p.boxSize || 64)} set={v => up('boxSize', v)} min={40} max={120} unit="px" />
        <SliderInput label="Border Radius" val={+(p.boxRadius || 8)} set={v => up('boxRadius', v)} min={0} max={30} unit="px" />
        <SliderInput label="Gap" val={+(p.gap || 10)} set={v => up('gap', v)} min={0} max={40} unit="px" />
        <SliderInput label="Label Size" val={+(p.labelSize || 14)} set={v => up('labelSize', v)} min={10} max={24} unit="px" />
      </PropSec>
    </>
  );
}
