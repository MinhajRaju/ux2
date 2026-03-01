'use client';
import { PropSec, RInput, ColorPick, SliderInput } from '../../../../../shared/ui';

export function NavProps({ el, onChange }) {
  const p  = el.props || {};
  const up = (k, v) => onChange({ [k]: v });

  return (
    <>
      <PropSec title="Style">
        <SliderInput label="Item Gap"  val={+(p.gap      || 28)} set={v => up('gap', v)}      min={4}  max={120} unit="px" />
        <SliderInput label="Font Size" val={+(p.fontSize || 14)} set={v => up('fontSize', v)} min={10} max={24}  unit="px" />
        <ColorPick   label="Color"     val={p.color || '#334155'} set={v => up('color', v)} />
      </PropSec>
      <PropSec title="Menu Links">
        {(p.items || []).map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <RInput
              val={item.label}
              placeholder="Label"
              set={v => { const items = [...(p.items || [])]; items[i] = { ...item, label: v }; up('items', items); }}
            />
            <RInput
              val={item.href}
              placeholder="URL"
              set={v => { const items = [...(p.items || [])]; items[i] = { ...item, href: v }; up('items', items); }}
            />
          </div>
        ))}
      </PropSec>
    </>
  );
}
