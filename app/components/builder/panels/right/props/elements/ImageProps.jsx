'use client';
import { PropSec, RInput, SliderInput, SegCtrl } from '../../../../../shared/ui';

export function ImageProps({ el, onChange }) {
  const p  = el.props || {};
  const up = (k, v) => onChange({ [k]: v });

  return (
    <>
      <PropSec title="Source">
        <RInput label="Image URL" val={p.src || ''} set={v => up('src', v)} placeholder="https://..." />
        <RInput label="Alt Text"  val={p.alt || ''} set={v => up('alt', v)} placeholder="Describe the image" />
      </PropSec>
      <PropSec title="Dimensions">
        <RInput label="Width" val={p.width || '100%'} set={v => up('width', v)} placeholder="100% or 400px" />
        <SegCtrl
          label="Fit Mode"
          val={p.objectFit || 'cover'}
          set={v => up('objectFit', v)}
          opts={[{ v: 'cover', l: 'Cover' }, { v: 'contain', l: 'Contain' }, { v: 'fill', l: 'Fill' }]}
        />
      </PropSec>
      <PropSec title="Style">
        <SliderInput label="Border Radius" val={+(p.borderRadius || 8)} set={v => up('borderRadius', v)} min={0} max={100} unit="px" />
        <SliderInput label="Opacity"       val={+(p.opacity      || 100)} set={v => up('opacity', v)}      min={0} max={100} unit="%" />
      </PropSec>
    </>
  );
}
