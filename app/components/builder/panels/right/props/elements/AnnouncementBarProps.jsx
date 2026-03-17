'use client';
import { PropSec, RInput, NumberInput, SliderInput, Toggle, ColorPick, Divider } from '../../../../../shared/ui';

export function AnnouncementBarProps({ el, onChange }) {
  const p = el.props || {};
  const up = (k, v) => onChange({ [k]: v });
  return (
    <>
      <PropSec title="Content">
        <RInput label="Icon / Emoji" val={p.icon || ''} set={v => up('icon', v)} placeholder="🎉" />
        <RInput label="Message Text" val={p.text || ''} set={v => up('text', v)} placeholder="Free shipping on orders over $50" />
        <Divider />
        <RInput label="CTA Text" val={p.ctaText || ''} set={v => up('ctaText', v)} placeholder="Shop Now →" />
        <RInput label="CTA Link" val={p.ctaHref || ''} set={v => up('ctaHref', v)} placeholder="https://…" />
        <ColorPick label="CTA Color" val={p.ctaColor || '#fbbf24'} set={v => up('ctaColor', v)} />
      </PropSec>
      <PropSec title="Style">
        <ColorPick label="Background" val={p.bg || '#0f172a'} set={v => up('bg', v)} />
        <ColorPick label="Text Color" val={p.color || '#ffffff'} set={v => up('color', v)} />
        <SliderInput label="Font Size" val={+(p.fontSize || 13)} set={v => up('fontSize', v)} min={10} max={22} unit="px" />
        <NumberInput label="V Padding" val={+(p.padV || 10)} set={v => up('padV', v)} min={4} max={40} unit="px" />
        <NumberInput label="H Padding" val={+(p.padH || 20)} set={v => up('padH', v)} min={0} max={80} unit="px" />
      </PropSec>
    </>
  );
}
