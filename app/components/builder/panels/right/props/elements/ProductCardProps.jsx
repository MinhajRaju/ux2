'use client';
import { useRef } from 'react';
import { PropSec, FL, RInput, NumberInput, SliderInput, SegCtrl, Toggle, Divider, ColorPick, SelectInput } from '../../../../../shared/ui';
import { T } from '../../../../../../constants/theme';

function ImageField({ val, set, label }) {
  const ref = useRef();
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <FL>{label}</FL>
      {val ? (
        <div style={{ position: 'relative', marginBottom: 6 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={val} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, border: `1px solid ${T.border}` }} />
          <button onClick={() => set('')} style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 4, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer' }}>✕</button>
        </div>
      ) : (
        <div onClick={() => ref.current?.click()} style={{ height: 60, background: T.light, border: `2px dashed ${T.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, color: T.textLight, marginBottom: 6 }}>
          + Upload Image
        </div>
      )}
      <RInput val={val || ''} set={set} placeholder="or paste URL…" />
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

export function ProductCardProps({ el, onChange }) {
  const p = el.props || {};
  const up = (k, v) => onChange({ [k]: v });

  return (
    <>
      <PropSec title="Product Image">
        <ImageField val={p.imageSrc || ''} set={v => up('imageSrc', v)} label="Product Image" />
        <NumberInput label="Image Height" val={+(p.imageHeight || 220)} set={v => up('imageHeight', v)} min={80} max={600} unit="px" />
      </PropSec>

      <PropSec title="Product Info">
        <RInput label="Title" val={p.title || ''} set={v => up('title', v)} placeholder="Product name…" />
        <RInput label="Category" val={p.category || ''} set={v => up('category', v)} placeholder="e.g. Electronics" />
        <RInput label="Currency" val={p.currency || '$'} set={v => up('currency', v)} />
        <NumberInput label="Price" val={+(p.price || 0)} set={v => up('price', v)} min={0} max={999999} unit="" step={0.01} />
        <NumberInput label="Sale Price" val={+(p.salePrice || 0)} set={v => up('salePrice', v)} min={0} max={999999} unit="" step={0.01} />
        <Toggle val={p.showDiscount || false} set={v => up('showDiscount', v)} label="Show Discount %" />
      </PropSec>

      <PropSec title="Rating">
        <Toggle val={p.showRating || false} set={v => up('showRating', v)} label="Show Rating" />
        {p.showRating && (
          <>
            <SliderInput label="Stars" val={+(p.rating || 4)} set={v => up('rating', v)} min={0} max={5} step={0.5} />
            <RInput label="Review Count" val={p.reviewCount || ''} set={v => up('reviewCount', v)} placeholder="(128)" />
          </>
        )}
      </PropSec>

      <PropSec title="Badge">
        <RInput label="Badge Text" val={p.badgeText || ''} set={v => up('badgeText', v)} placeholder="e.g. SALE" />
        <ColorPick label="Badge Color" val={p.badgeColor || '#ef4444'} set={v => up('badgeColor', v)} />
      </PropSec>

      <PropSec title="Add to Cart Button">
        <Toggle val={p.showCartBtn !== false} set={v => up('showCartBtn', v)} label="Show Button" />
        {p.showCartBtn !== false && (
          <>
            <RInput label="Button Text" val={p.btnText || 'Add to Cart'} set={v => up('btnText', v)} />
            <ColorPick label="Button BG" val={p.btnBg || '#6366f1'} set={v => up('btnBg', v)} />
            <ColorPick label="Button Text" val={p.btnColor || '#ffffff'} set={v => up('btnColor', v)} />
            <SliderInput label="Border Radius" val={+(p.btnRadius || 8)} set={v => up('btnRadius', v)} min={0} max={50} unit="px" />
          </>
        )}
      </PropSec>

      <PropSec title="Layout & Style">
        <NumberInput label="Max Width" val={+(p.maxWidth || 280)} set={v => up('maxWidth', v)} min={140} max={600} unit="px" />
        <SliderInput label="Border Radius" val={+(p.borderRadius || 12)} set={v => up('borderRadius', v)} min={0} max={40} unit="px" />
        <ColorPick label="Card Background" val={p.cardBg || '#ffffff'} set={v => up('cardBg', v)} />
        <ColorPick label="Border Color" val={p.borderColor || '#e2e8f0'} set={v => up('borderColor', v)} />
        <ColorPick label="Accent Color" val={p.accentColor || '#6366f1'} set={v => up('accentColor', v)} />
        <Toggle val={p.showWishlist || false} set={v => up('showWishlist', v)} label="Show Wishlist Button" />
      </PropSec>
    </>
  );
}
