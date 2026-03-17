'use client';
import { PropSec, RInput, SliderInput, Toggle, ColorPick } from '../../../../../shared/ui';

export function PriceTagProps({ el, onChange }) {
  const p = el.props || {};
  const up = (k, v) => onChange({ [k]: v });
  return (
    <>
      <PropSec title="Prices">
        <RInput label="Currency Symbol" val={p.currency || '$'} set={v => up('currency', v)} />
        <RInput label="Regular Price" val={p.price || ''} set={v => up('price', v)} placeholder="49.99" />
        <RInput label="Original Price (strikethrough)" val={p.originalPrice || ''} set={v => up('originalPrice', v)} placeholder="79.99" />
        <RInput label="Sale Price" val={p.salePrice || ''} set={v => up('salePrice', v)} placeholder="34.99" />
        <Toggle val={p.showDiscount || false} set={v => up('showDiscount', v)} label="Show Discount Badge" />
      </PropSec>
      <PropSec title="Style">
        <SliderInput label="Font Size" val={+(p.priceSize || 28)} set={v => up('priceSize', v)} min={14} max={60} unit="px" />
        <ColorPick label="Regular Price Color" val={p.priceColor || '#0f172a'} set={v => up('priceColor', v)} />
        <ColorPick label="Sale Price Color" val={p.salePriceColor || '#ef4444'} set={v => up('salePriceColor', v)} />
      </PropSec>
    </>
  );
}
