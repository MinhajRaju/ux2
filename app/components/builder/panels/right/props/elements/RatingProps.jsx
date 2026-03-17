'use client';
import { PropSec, RInput, NumberInput, SliderInput, Toggle, ColorPick } from '../../../../../shared/ui';

export function RatingProps({ el, onChange }) {
  const p = el.props || {};
  const up = (k, v) => onChange({ [k]: v });
  return (
    <>
      <PropSec title="Rating">
        <SliderInput label="Rating Value" val={+(p.rating || 4)} set={v => up('rating', v)} min={0} max={+(p.maxRating || 5)} step={0.5} />
        <NumberInput label="Max Stars" val={+(p.maxRating || 5)} set={v => up('maxRating', v)} min={3} max={10} unit="" />
        <NumberInput label="Star Size" val={+(p.size || 18)} set={v => up('size', v)} min={10} max={48} unit="px" />
        <NumberInput label="Gap" val={+(p.gap || 2)} set={v => up('gap', v)} min={0} max={12} unit="px" />
      </PropSec>
      <PropSec title="Colors">
        <ColorPick label="Star Color" val={p.starColor || '#f59e0b'} set={v => up('starColor', v)} />
        <ColorPick label="Empty Color" val={p.emptyColor || '#e2e8f0'} set={v => up('emptyColor', v)} />
      </PropSec>
      <PropSec title="Labels">
        <Toggle val={p.showValue || false} set={v => up('showValue', v)} label="Show Numeric Value" />
        <RInput label="Review Text" val={p.reviewText || ''} set={v => up('reviewText', v)} placeholder="(128 reviews)" />
        <NumberInput label="Text Size" val={+(p.fontSize || 13)} set={v => up('fontSize', v)} min={10} max={24} unit="px" />
      </PropSec>
    </>
  );
}
