'use client';
import { PropSec, RInput, NumberInput, SliderInput, SegCtrl, Toggle, Divider, ColorPick, SelectInput, FL } from '../../../../../shared/ui';
import { T } from '../../../../../../constants/theme';
import { useCardDesignerStore } from '../../../../../../store/useCardDesignerStore';

const DATA_SOURCE_OPTS = [
  { v: 'all',             l: '🌐 All Products' },
  { v: 'category:',       l: '🏷 By Category' },
  { v: 'collection:',     l: '✨ By Collection' },
  { v: 'search:',         l: '🔍 By Search Term' },
];

export function ProductGridProps({ el, onChange }) {
  const p   = el.props || {};
  const up  = (k, v) => onChange({ [k]: v });
  const cardDesigner = useCardDesignerStore();

  // Detect which source type is selected
  const sourceType = !p.dataSource || p.dataSource === 'all' ? 'all'
    : p.dataSource.startsWith('category:')   ? 'category:'
    : p.dataSource.startsWith('collection:') ? 'collection:'
    : p.dataSource.startsWith('search:')     ? 'search:'
    : 'all';

  const sourceValue = sourceType === 'all' ? ''
    : (p.dataSource || '').split(':').slice(1).join(':');

  const handleSourceType = (type) => {
    if (type === 'all') up('dataSource', 'all');
    else up('dataSource', type); // e.g. "category:"
  };

  const handleSourceValue = (val) => {
    if (sourceType === 'all') return;
    up('dataSource', sourceType + val);
  };

  return (
    <>
      {/* ── Card Designer ── */}
      <PropSec title="🎨 Card Designer">
        <div style={{ fontSize: 11, color: T.textLight, lineHeight: 1.6, marginBottom: 6 }}>
          প্রতিটি product card-এর layout নিজের মত করে design করো।
        </div>
        {p.cardTemplate && (
          <div style={{
            padding: '8px 10px', borderRadius: 8,
            background: '#ecfdf5', border: '1.5px solid #10b981',
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
          }}>
            <span style={{ fontSize: 14 }}>✅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#065f46' }}>Custom design active</div>
              <div style={{ fontSize: 10, color: '#047857' }}>{p.cardTemplate.rows?.length || 0} rows configured</div>
            </div>
          </div>
        )}
        <button
          onClick={() => cardDesigner.openDesigner(
            p.cardTemplate || null,
            (template) => onChange({ cardTemplate: template })
          )}
          style={{
            width: '100%', padding: '10px 0',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', border: 'none', borderRadius: 9,
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: '0 2px 12px rgba(99,102,241,0.3)',
          }}
        >
          🎨 {p.cardTemplate ? 'Edit Card Design' : 'Open Card Designer'}
        </button>
        {p.cardTemplate && (
          <button
            onClick={() => up('cardTemplate', null)}
            style={{
              width: '100%', padding: '7px 0',
              background: 'transparent', color: '#ef4444',
              border: '1.5px solid #ef4444', borderRadius: 8,
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}
          >
            ✕ Remove Custom Design
          </button>
        )}
      </PropSec>

      {/* ── Data Source ── */}
      <PropSec title="Data Source">
        <FL>কোথা থেকে products আনবে?</FL>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {DATA_SOURCE_OPTS.map(opt => (
            <div
              key={opt.v}
              onClick={() => handleSourceType(opt.v)}
              style={{
                padding: '9px 12px',
                borderRadius: 8,
                border: `1.5px solid ${sourceType === opt.v ? T.primary : T.border}`,
                background: sourceType === opt.v ? `${T.primary}0d` : 'transparent',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: sourceType === opt.v ? 600 : 400,
                color: sourceType === opt.v ? T.primary : T.textMid,
                transition: 'all 0.12s',
              }}
            >
              {opt.l}
            </div>
          ))}
        </div>

        {/* Dynamic value input */}
        {sourceType === 'category:' && (
          <RInput
            label="Category name"
            val={sourceValue}
            set={handleSourceValue}
            placeholder="e.g. phones, shoes, electronics"
          />
        )}
        {sourceType === 'collection:' && (
          <RInput
            label="Collection slug"
            val={sourceValue}
            set={handleSourceValue}
            placeholder="e.g. summer-sale, new-arrivals"
          />
        )}
        {sourceType === 'search:' && (
          <RInput
            label="Search query"
            val={sourceValue}
            set={handleSourceValue}
            placeholder="e.g. wireless headphones"
          />
        )}

        {/* Current value display */}
        <div style={{ fontSize: 10, color: T.textLight, padding: '6px 10px', background: T.light, borderRadius: 6 }}>
          API call: <code style={{ color: T.primary, fontFamily: 'monospace' }}>
            {!p.dataSource || p.dataSource === 'all'
              ? '/products?limit=' + (p.limit || 8)
              : p.dataSource.startsWith('category:')
                ? '/products/category/' + sourceValue
                : p.dataSource.startsWith('search:')
                  ? '/products/search?q=' + sourceValue
                  : '/collections/' + sourceValue}
          </code>
        </div>

        <NumberInput label="Show how many products" val={+(p.limit || 8)} set={v => up('limit', v)} min={1} max={48} unit="" />
      </PropSec>

      {/* ── API Base URL ── */}
      <PropSec title="API Base URL">
        <RInput
          label="Base URL (optional override)"
          val={p._apiBase || ''}
          set={v => up('_apiBase', v)}
          placeholder="https://dummyjson.com (default)"
        />
        <div style={{ fontSize: 10, color: T.textLight, lineHeight: 1.6 }}>
          খালি রাখলে <code style={{ fontFamily: 'monospace' }}>NEXT_PUBLIC_PRODUCT_API_URL</code> env variable থেকে নেবে। Fallback: dummyjson.com
        </div>
      </PropSec>

      {/* ── Section Header ── */}
      <PropSec title="Section Header">
        <RInput label="Title" val={p.sectionTitle || ''} set={v => up('sectionTitle', v)} placeholder="Featured Products" />
        <RInput label="Subtitle" val={p.sectionSubtitle || ''} set={v => up('sectionSubtitle', v)} placeholder="Our best picks for you" />
        <SegCtrl label="Align" val={p.titleAlign || 'left'} set={v => up('titleAlign', v)}
          opts={[{v:'left',l:'Left'},{v:'center',l:'Center'},{v:'right',l:'Right'}]} />
        <SliderInput label="Title Size" val={+(p.titleSize || 24)} set={v => up('titleSize', v)} min={14} max={48} unit="px" />
        <ColorPick label="Title Color" val={p.titleColor || '#0f172a'} set={v => up('titleColor', v)} />
      </PropSec>

      {/* ── Grid Layout ── */}
      <PropSec title="Grid Layout">
        <SegCtrl
          label="Columns"
          val={String(p.columns || 3)}
          set={v => up('columns', Number(v))}
          opts={[{v:'2',l:'2'},{v:'3',l:'3'},{v:'4',l:'4'}]}
        />
        <SliderInput label="Gap" val={+(p.gap || 20)} set={v => up('gap', v)} min={0} max={60} unit="px" />
        <NumberInput label="H Padding" val={+(p.padH || 0)} set={v => up('padH', v)} min={0} max={120} unit="px" />
        <NumberInput label="V Padding" val={+(p.padV || 0)} set={v => up('padV', v)} min={0} max={120} unit="px" />
      </PropSec>

      {/* ── Card Style ── */}
      <PropSec title="Card Style">
        <SliderInput label="Card Radius" val={+(p.cardRadius ?? 12)} set={v => up('cardRadius', v)} min={0} max={32} unit="px" />
        <NumberInput label="Image Height" val={+(p.imageHeight || 220)} set={v => up('imageHeight', v)} min={80} max={500} unit="px" />
        <NumberInput label="Card Padding" val={+(p.cardPadding || 14)} set={v => up('cardPadding', v)} min={0} max={40} unit="px" />
        <ColorPick label="Card BG" val={p.cardBg || '#ffffff'} set={v => up('cardBg', v)} />
        <ColorPick label="Border Color" val={p.cardBorder || '#e2e8f0'} set={v => up('cardBorder', v)} />
        <ColorPick label="Accent Color" val={p.accentColor || '#6366f1'} set={v => up('accentColor', v)} />
      </PropSec>

      {/* ── Price & Details ── */}
      <PropSec title="Product Details">
        <SliderInput label="Price Size" val={+(p.priceSize || 16)} set={v => up('priceSize', v)} min={11} max={28} unit="px" />
        <ColorPick label="Price Color" val={p.priceColor || '#0f172a'} set={v => up('priceColor', v)} />
        <SliderInput label="Title Size" val={+(p.titleSize || 13)} set={v => up('titleSize', v)} min={10} max={22} unit="px" />
        <Toggle val={p.showRating !== false} set={v => up('showRating', v)} label="Show Rating" />
        <Toggle val={p.showDiscount !== false} set={v => up('showDiscount', v)} label="Show Discount Badge" />
        <Toggle val={p.showWishlist || false} set={v => up('showWishlist', v)} label="Show Wishlist Button" />
      </PropSec>

      {/* ── Add to Cart Button ── */}
      <PropSec title="Add to Cart">
        <Toggle val={p.showCartBtn !== false} set={v => up('showCartBtn', v)} label="Show Button" />
        {p.showCartBtn !== false && (
          <>
            <RInput label="Button Text" val={p.btnText || 'Add to Cart'} set={v => up('btnText', v)} />
            <ColorPick label="BG" val={p.btnBg || '#6366f1'} set={v => up('btnBg', v)} />
            <ColorPick label="Text" val={p.btnColor || '#ffffff'} set={v => up('btnColor', v)} />
            <SliderInput label="Radius" val={+(p.btnRadius || 8)} set={v => up('btnRadius', v)} min={0} max={40} unit="px" />
          </>
        )}
      </PropSec>

      {/* ── View All ── */}
      <PropSec title="View All Button">
        <Toggle val={p.showViewAll || false} set={v => up('showViewAll', v)} label="Show View All" />
        {p.showViewAll && (
          <>
            <RInput label="Button Text" val={p.viewAllText || 'View All Products'} set={v => up('viewAllText', v)} />
            <RInput label="Link URL" val={p.viewAllHref || '#'} set={v => up('viewAllHref', v)} placeholder="/products" />
            <ColorPick label="Color" val={p.viewAllColor || '#6366f1'} set={v => up('viewAllColor', v)} />
            <SliderInput label="Radius" val={+(p.viewAllRadius || 8)} set={v => up('viewAllRadius', v)} min={0} max={40} unit="px" />
          </>
        )}
      </PropSec>
    </>
  );
}
