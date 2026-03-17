'use client';
import { useRef } from 'react';
import { PropSec, FL, RInput, NumberInput, SliderInput, Toggle, ColorPick, Divider } from '../../../../../shared/ui';
import { T } from '../../../../../../constants/theme';

function AvatarField({ val, set }) {
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
      <FL>Avatar Image</FL>
      {val ? (
        <div style={{ position: 'relative', marginBottom: 6, display: 'inline-block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={val} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${T.border}` }} />
          <button onClick={() => set('')} style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer' }}>✕</button>
        </div>
      ) : (
        <div onClick={() => ref.current?.click()} style={{ height: 52, width: 52, borderRadius: '50%', background: T.light, border: `2px dashed ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20, marginBottom: 6 }}>
          👤
        </div>
      )}
      <RInput val={val || ''} set={set} placeholder="or paste avatar URL…" />
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

export function TestimonialProps({ el, onChange }) {
  const p = el.props || {};
  const up = (k, v) => onChange({ [k]: v });
  return (
    <>
      <PropSec title="Content">
        <RInput label="Quote Text" val={p.text || ''} set={v => up('text', v)} placeholder="Customer quote…" />
        <Toggle val={p.italic !== false} set={v => up('italic', v)} label="Italic style" />
      </PropSec>
      <PropSec title="Author">
        <AvatarField val={p.avatarSrc || ''} set={v => up('avatarSrc', v)} />
        <RInput label="Name" val={p.name || ''} set={v => up('name', v)} placeholder="Customer Name" />
        <RInput label="Role / Title" val={p.role || ''} set={v => up('role', v)} placeholder="Verified Buyer" />
        <Toggle val={p.verifiedBuyer || false} set={v => up('verifiedBuyer', v)} label="Show Verified Badge" />
      </PropSec>
      <PropSec title="Rating">
        <Toggle val={p.showRating || false} set={v => up('showRating', v)} label="Show Stars" />
        {p.showRating && <SliderInput label="Stars" val={+(p.rating || 5)} set={v => up('rating', v)} min={1} max={5} step={1} />}
      </PropSec>
      <PropSec title="Style">
        <Toggle val={p.showQuoteIcon !== false} set={v => up('showQuoteIcon', v)} label="Show Quote Icon" />
        <ColorPick label="Card Background" val={p.bg || '#ffffff'} set={v => up('bg', v)} />
        <ColorPick label="Border Color" val={p.borderColor || '#e2e8f0'} set={v => up('borderColor', v)} />
        <ColorPick label="Accent Color" val={p.accentColor || '#6366f1'} set={v => up('accentColor', v)} />
        <SliderInput label="Border Radius" val={+(p.borderRadius || 16)} set={v => up('borderRadius', v)} min={0} max={40} unit="px" />
        <NumberInput label="Padding" val={+(p.padding || 24)} set={v => up('padding', v)} min={8} max={60} unit="px" />
        <NumberInput label="Max Width" val={+(p.maxWidth || 400)} set={v => up('maxWidth', v)} min={200} max={800} unit="px" />
        <SliderInput label="Text Size" val={+(p.textSize || 14)} set={v => up('textSize', v)} min={11} max={24} unit="px" />
      </PropSec>
    </>
  );
}
