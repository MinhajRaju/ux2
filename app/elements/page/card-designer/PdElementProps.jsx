'use client';
import { PropSec, FL, ColorPick, SliderInput, NumberInput, SegCtrl, Toggle, SpacingBox, RInput, SelectInput } from '../../../components/shared/ui';

const FONT_FAMILIES = [
  { v: 'inherit',   l: 'Default (inherit)' },
  { v: 'sans-serif',l: 'Sans-serif' },
  { v: 'serif',     l: 'Serif' },
  { v: 'monospace', l: 'Monospace' },
  { v: "'Inter', sans-serif",    l: 'Inter' },
  { v: "'Roboto', sans-serif",   l: 'Roboto' },
  { v: "'Poppins', sans-serif",  l: 'Poppins' },
  { v: "'Playfair Display', serif", l: 'Playfair Display' },
];
const FONT_WEIGHTS = [
  { v: '300', l: 'Light 300' }, { v: '400', l: 'Regular 400' },
  { v: '500', l: 'Medium 500' }, { v: '600', l: 'Semi 600' },
  { v: '700', l: 'Bold 700' }, { v: '800', l: 'X-Bold 800' }, { v: '900', l: 'Black 900' },
];

// Common layout props (align + padding) — used by all elements
function CommonLayout({ p, onChange }) {
  return (
    <PropSec title="Layout & Spacing">
      <SegCtrl label="Alignment" val={p._align || 'left'} set={v => onChange({ _align: v })}
        opts={[{v:'left',l:'⬜ Left'},{v:'center',l:'⬜ Center'},{v:'right',l:'⬜ Right'}]} />
      <SpacingBox label="Element Padding"
        top={p._padTop ?? 0}    setTop={v => onChange({ _padTop: v })}
        right={p._padRight ?? 0} setRight={v => onChange({ _padRight: v })}
        bottom={p._padBottom ?? 0} setBottom={v => onChange({ _padBottom: v })}
        left={p._padLeft ?? 0}  setLeft={v => onChange({ _padLeft: v })}
        max={60}
      />
    </PropSec>
  );
}

// Typography block — reusable
function TypoBlock({ p, onChange, showLineHeight = true }) {
  return (
    <PropSec title="Typography">
      <SliderInput label="Font Size" val={p.fontSize ?? 13} set={v => onChange({ fontSize: v })} min={8} max={48} unit="px" />
      <SelectInput label="Font Weight" val={String(p.fontWeight ?? 600)} set={v => onChange({ fontWeight: v })} opts={FONT_WEIGHTS} />
      <SelectInput label="Font Family" val={p.fontFamily || 'inherit'} set={v => onChange({ fontFamily: v })} opts={FONT_FAMILIES} />
      {showLineHeight && <SliderInput label="Line Height" val={p.lineHeight ?? 1.4} set={v => onChange({ lineHeight: v })} min={1} max={3} step={0.1} unit="×" />}
      <ColorPick label="Color" val={p.color || '#0f172a'} set={v => onChange({ color: v })} />
    </PropSec>
  );
}

// Overlay position — for overlay-capable elements
function OverlayPos({ p, onChange }) {
  return (
    <PropSec title="Position on Image">
      <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5, marginBottom: 4 }}>
        Left/Right একটা, Top/Bottom একটা চুজ করো
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div><FL>From Top</FL>   <SliderInput val={p.top    ?? 10} set={v => onChange({ top: v,    bottom: undefined })} min={0} max={300} unit="px" /></div>
        <div><FL>From Bottom</FL><SliderInput val={p.bottom ?? 0}  set={v => onChange({ bottom: v, top:    undefined })} min={0} max={300} unit="px" /></div>
        <div><FL>From Left</FL>  <SliderInput val={p.left   ?? 10} set={v => onChange({ left: v,   right:  undefined })} min={0} max={300} unit="px" /></div>
        <div><FL>From Right</FL> <SliderInput val={p.right  ?? 0}  set={v => onChange({ right: v,  left:   undefined })} min={0} max={300} unit="px" /></div>
      </div>
    </PropSec>
  );
}

// ── Per-element panels ────────────────────────────────────────────────────────
function ImageProps({ p, onChange }) {
  return (<>
    <PropSec title="Image">
      <NumberInput label="Height" val={p.height ?? 220} set={v => onChange({ height: v })} min={60} max={600} />
      <SegCtrl label="Object Fit" val={p.objectFit || 'cover'} set={v => onChange({ objectFit: v })} opts={[{v:'cover',l:'Cover'},{v:'contain',l:'Contain'},{v:'fill',l:'Fill'}]} />
      <SliderInput label="Border Radius" val={p.radius ?? 0} set={v => onChange({ radius: v })} min={0} max={40} unit="px" />
    </PropSec>
    <CommonLayout p={p} onChange={onChange} />
  </>);
}
function TitleProps({ p, onChange }) {
  return (<><TypoBlock p={p} onChange={onChange} /><CommonLayout p={p} onChange={onChange} /></>);
}
function CategoryProps({ p, onChange }) {
  return (<>
    <TypoBlock p={p} onChange={onChange} showLineHeight={false} />
    <PropSec title="Style">
      <Toggle label="Uppercase" val={p.uppercase !== false} set={v => onChange({ uppercase: v })} />
    </PropSec>
    <CommonLayout p={p} onChange={onChange} />
  </>);
}
function PriceProps({ p, onChange }) {
  return (<>
    <PropSec title="Price">
      <SliderInput label="Sale Price Size" val={p.saleSize ?? p.fontSize ?? 18} set={v => onChange({ saleSize: v })} min={10} max={40} unit="px" />
      <SliderInput label="Original Price Size" val={p.originalSize ?? 13} set={v => onChange({ originalSize: v })} min={8} max={30} unit="px" />
      <SelectInput label="Font Weight" val={String(p.fontWeight ?? 800)} set={v => onChange({ fontWeight: v })} opts={FONT_WEIGHTS} />
      <ColorPick label="Regular Color" val={p.color || '#0f172a'} set={v => onChange({ color: v })} />
      <ColorPick label="Sale Color" val={p.saleColor || '#ef4444'} set={v => onChange({ saleColor: v })} />
      <Toggle label="Show Discount %" val={p.showDiscount !== false} set={v => onChange({ showDiscount: v })} />
    </PropSec>
    <CommonLayout p={p} onChange={onChange} />
  </>);
}
function RatingProps({ p, onChange }) {
  return (<>
    <PropSec title="Rating">
      <SliderInput label="Star Size" val={p.starSize ?? 11} set={v => onChange({ starSize: v })} min={8} max={28} unit="px" />
      <ColorPick label="Star Color" val={p.starColor || '#f59e0b'} set={v => onChange({ starColor: v })} />
      <Toggle label="Show Review Count" val={p.showCount !== false} set={v => onChange({ showCount: v })} />
      <SliderInput label="Count Font Size" val={p.countSize ?? 10} set={v => onChange({ countSize: v })} min={8} max={18} unit="px" />
      <ColorPick label="Count Color" val={p.countColor || '#94a3b8'} set={v => onChange({ countColor: v })} />
    </PropSec>
    <CommonLayout p={p} onChange={onChange} />
  </>);
}
function BrandProps({ p, onChange }) {
  return (<><TypoBlock p={p} onChange={onChange} showLineHeight={false} /><PropSec title="Style"><Toggle label="Uppercase" val={p.uppercase !== false} set={v => onChange({ uppercase: v })} /></PropSec><CommonLayout p={p} onChange={onChange} /></>);
}
function TextProps({ p, onChange }) {
  return (<>
    <PropSec title="Content">
      <div><FL>Text</FL><textarea value={p.content || ''} onChange={e => onChange({ content: e.target.value })} rows={3} style={{ width: '100%', padding: '7px 10px', fontSize: 12, border: '1.5px solid #e2e8f0', borderRadius: 7, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} /></div>
    </PropSec>
    <TypoBlock p={p} onChange={onChange} />
    <CommonLayout p={p} onChange={onChange} />
  </>);
}
function StockProps({ p, onChange }) {
  return (<>
    <PropSec title="Stock Status">
      <SliderInput label="Font Size" val={p.fontSize ?? 10} set={v => onChange({ fontSize: v })} min={8} max={20} unit="px" />
      <ColorPick label="In-Stock Color" val={p.inColor || '#10b981'} set={v => onChange({ inColor: v })} />
      <ColorPick label="Out-of-Stock Color" val={p.outColor || '#ef4444'} set={v => onChange({ outColor: v })} />
      <div><FL>In-Stock Text</FL><input value={p.inText || 'In Stock'} onChange={e => onChange({ inText: e.target.value })} style={{ width: '100%', padding: '6px 8px', fontSize: 11, border: '1.5px solid #e2e8f0', borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} /></div>
      <div><FL>Out-of-Stock Text</FL><input value={p.outText || 'Out of Stock'} onChange={e => onChange({ outText: e.target.value })} style={{ width: '100%', padding: '6px 8px', fontSize: 11, border: '1.5px solid #e2e8f0', borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} /></div>
    </PropSec>
    <CommonLayout p={p} onChange={onChange} />
  </>);
}
function SkuProps({ p, onChange }) {
  return (<>
    <PropSec title="SKU">
      <SliderInput label="Font Size" val={p.fontSize ?? 10} set={v => onChange({ fontSize: v })} min={8} max={18} unit="px" />
      <ColorPick label="Color" val={p.color || '#94a3b8'} set={v => onChange({ color: v })} />
    </PropSec>
    <CommonLayout p={p} onChange={onChange} />
  </>);
}
function AddToCartProps({ p, onChange }) {
  return (<>
    <PropSec title="Button">
      <div><FL>Button Text</FL><input value={p.text || 'Add to Cart'} onChange={e => onChange({ text: e.target.value })} style={{ width: '100%', padding: '6px 8px', fontSize: 11, border: '1.5px solid #e2e8f0', borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} /></div>
      <Toggle label="Full Width" val={p.fullWidth !== false} set={v => onChange({ fullWidth: v })} />
      <Toggle label="Show Cart Icon" val={p.showIcon !== false} set={v => onChange({ showIcon: v })} />
      <ColorPick label="Background" val={p.bg || '#6366f1'} set={v => onChange({ bg: v })} />
      <ColorPick label="Text Color" val={p.color || '#fff'} set={v => onChange({ color: v })} />
    </PropSec>
    <PropSec title="Typography">
      <SliderInput label="Font Size" val={p.fontSize ?? 12} set={v => onChange({ fontSize: v })} min={9} max={22} unit="px" />
      <SelectInput label="Font Weight" val={String(p.fontWeight ?? 700)} set={v => onChange({ fontWeight: v })} opts={FONT_WEIGHTS} />
      <SelectInput label="Font Family" val={p.fontFamily || 'inherit'} set={v => onChange({ fontFamily: v })} opts={FONT_FAMILIES} />
    </PropSec>
    <PropSec title="Shape">
      <SliderInput label="Border Radius" val={p.radius ?? 8} set={v => onChange({ radius: v })} min={0} max={40} unit="px" />
      <SpacingBox label="Padding" top={p.padV ?? 9} setTop={v => onChange({ padV: v })} bottom={p.padV ?? 9} setBottom={v => onChange({ padV: v })} left={p.padH ?? 16} setLeft={v => onChange({ padH: v })} right={p.padH ?? 16} setRight={v => onChange({ padH: v })} max={60} />
    </PropSec>
    <CommonLayout p={p} onChange={onChange} />
  </>);
}
function QuickBuyProps({ p, onChange }) {
  return (<>
    <PropSec title="Button">
      <div><FL>Button Text</FL><input value={p.text || 'Quick View'} onChange={e => onChange({ text: e.target.value })} style={{ width: '100%', padding: '6px 8px', fontSize: 11, border: '1.5px solid #e2e8f0', borderRadius: 6, outline: 'none', boxSizing: 'border-box' }} /></div>
      <Toggle label="Full Width" val={p.fullWidth !== false} set={v => onChange({ fullWidth: v })} />
      <ColorPick label="Text Color" val={p.color || '#6366f1'} set={v => onChange({ color: v })} />
      <ColorPick label="Border Color" val={p.borderColor || '#6366f1'} set={v => onChange({ borderColor: v })} />
      <SliderInput label="Font Size" val={p.fontSize ?? 11} set={v => onChange({ fontSize: v })} min={9} max={22} unit="px" />
      <SelectInput label="Font Weight" val={String(p.fontWeight ?? 600)} set={v => onChange({ fontWeight: v })} opts={FONT_WEIGHTS} />
      <SliderInput label="Border Radius" val={p.radius ?? 8} set={v => onChange({ radius: v })} min={0} max={40} unit="px" />
    </PropSec>
    <CommonLayout p={p} onChange={onChange} />
  </>);
}
function BadgeProps({ p, onChange }) {
  return (<>
    <PropSec title="Badge Style">
      <SliderInput label="Font Size" val={p.fontSize ?? 9} set={v => onChange({ fontSize: v })} min={7} max={18} unit="px" />
      <ColorPick label="Background" val={p.bg || '#ef4444'} set={v => onChange({ bg: v })} />
      <ColorPick label="Text Color" val={p.color || '#fff'} set={v => onChange({ color: v })} />
      <SliderInput label="Border Radius" val={p.radius ?? 99} set={v => onChange({ radius: v })} min={0} max={99} unit="px" />
      <SpacingBox label="Padding" top={p.padV ?? 3} setTop={v => onChange({ padV: v })} bottom={p.padV ?? 3} setBottom={v => onChange({ padV: v })} left={p.padH ?? 8} setLeft={v => onChange({ padH: v })} right={p.padH ?? 8} setRight={v => onChange({ padH: v })} max={40} />
    </PropSec>
    <OverlayPos p={p} onChange={onChange} />
  </>);
}
function DiscountProps({ p, onChange }) {
  return (<>
    <PropSec title="Discount Label">
      <SliderInput label="Font Size" val={p.fontSize ?? 11} set={v => onChange({ fontSize: v })} min={8} max={20} unit="px" />
      <ColorPick label="Background" val={p.bg || '#ef4444'} set={v => onChange({ bg: v })} />
      <ColorPick label="Text Color" val={p.color || '#fff'} set={v => onChange({ color: v })} />
      <SliderInput label="Border Radius" val={p.radius ?? 6} set={v => onChange({ radius: v })} min={0} max={40} unit="px" />
      <SpacingBox label="Padding" top={p.padV ?? 3} setTop={v => onChange({ padV: v })} bottom={p.padV ?? 3} setBottom={v => onChange({ padV: v })} left={p.padH ?? 8} setLeft={v => onChange({ padH: v })} right={p.padH ?? 8} setRight={v => onChange({ padH: v })} max={40} />
    </PropSec>
    <OverlayPos p={p} onChange={onChange} />
    <CommonLayout p={p} onChange={onChange} />
  </>);
}
function WishlistProps({ p, onChange }) {
  return (<>
    <PropSec title="Wishlist Button">
      <SliderInput label="Size" val={p.size ?? 30} set={v => onChange({ size: v })} min={20} max={60} unit="px" />
      <ColorPick label="Background" val={p.bg || 'rgba(255,255,255,0.92)'} set={v => onChange({ bg: v })} />
      <ColorPick label="Icon Color" val={p.iconColor || '#ef4444'} set={v => onChange({ iconColor: v })} />
      <SegCtrl label="Shape" val={p.shape || 'circle'} set={v => onChange({ shape: v })} opts={[{v:'circle',l:'Circle'},{v:'square',l:'Square'}]} />
      <Toggle label="Filled" val={p.filled || false} set={v => onChange({ filled: v })} />
    </PropSec>
    <OverlayPos p={p} onChange={onChange} />
  </>);
}
function DividerProps({ p, onChange }) {
  return (<>
    <PropSec title="Divider">
      <SliderInput label="Thickness" val={p.thickness ?? 1} set={v => onChange({ thickness: v })} min={1} max={8} unit="px" />
      <ColorPick label="Color" val={p.color || '#e2e8f0'} set={v => onChange({ color: v })} />
      <SliderInput label="V Margin" val={p.marginV ?? 2} set={v => onChange({ marginV: v })} min={0} max={32} unit="px" />
    </PropSec>
  </>);
}

const PANELS = {
  'pd-image': ImageProps, 'pd-title': TitleProps, 'pd-category': CategoryProps,
  'pd-price': PriceProps, 'pd-rating': RatingProps, 'pd-brand': BrandProps,
  'pd-text': TextProps, 'pd-stock': StockProps, 'pd-sku': SkuProps,
  'pd-add-to-cart': AddToCartProps, 'pd-quick-buy': QuickBuyProps,
  'pd-badge': BadgeProps, 'pd-discount': DiscountProps,
  'pd-wishlist': WishlistProps, 'pd-divider': DividerProps,
};
export default function PdElementProps({ elementType, props, onChange }) {
  const Panel = PANELS[elementType];
  if (!Panel) return <div style={{ padding: 12, fontSize: 11, color: '#64748b' }}>No props.</div>;
  return <Panel p={props || {}} onChange={onChange} />;
}
