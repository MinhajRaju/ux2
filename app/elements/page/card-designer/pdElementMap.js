'use client';
export const MOCK_PRODUCT = {
  title: 'Premium Wireless Headphones',
  category: 'Electronics',
  price: 129.99, salePrice: 89.99, currency: '$',
  imageSrc: 'https://cdn.dummyjson.com/product-images/3/thumbnail.jpg',
  badgeText: '31% OFF', badgeColor: '#ef4444',
  rating: 4.5, reviewCount: '(342)', discount: 31,
  brand: 'Sony', sku: 'SKU-001',
};

const wrapAlign = (align, children) => {
  const j = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  return <div style={{ display: 'flex', justifyContent: j, width: '100%' }}>{children}</div>;
};

// ── pd-image ──────────────────────────────────────────────────────────────────
export function PdImageElement({ product, props: p = {}, overlays = [], onSelectOverlay, selectedOverlayId, designMode }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: (p.height || 220) + 'px', overflow: 'hidden', borderRadius: (p.radius || 0) + 'px', background: '#f1f5f9', flexShrink: 0 }}>
      {product?.imageSrc
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={product.imageSrc} alt={product.title || ''} style={{ width: '100%', height: '100%', objectFit: p.objectFit || 'cover', display: 'block' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#cbd5e1" strokeWidth="1.5"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>No Image</span>
          </div>
      }
      {overlays.map(ov => {
        const OC = pdElementMap[ov.type]?.component;
        if (!OC) return null;
        const op = ov.props || {};
        return (
          <div key={ov.id} onClick={e => { e.stopPropagation(); onSelectOverlay?.(ov.id); }}
            style={{ position: 'absolute', top: op.top != null ? op.top + 'px' : undefined, bottom: op.bottom != null ? op.bottom + 'px' : undefined, left: op.left != null ? op.left + 'px' : undefined, right: op.right != null ? op.right + 'px' : undefined, zIndex: 10, cursor: designMode ? 'pointer' : 'default', outline: (designMode && selectedOverlayId === ov.id) ? '2px solid #6366f1' : 'none', outlineOffset: 2, borderRadius: 4 }}>
            <OC product={product} props={op} />
          </div>
        );
      })}
    </div>
  );
}

// ── pd-title ──────────────────────────────────────────────────────────────────
export function PdTitleElement({ product, props: p = {} }) {
  return <div style={{ fontSize: (p.fontSize || 13) + 'px', fontWeight: p.fontWeight || 600, color: p.color || '#0f172a', lineHeight: p.lineHeight || 1.4, fontFamily: p.fontFamily || 'inherit' }}>{product?.title || 'Product Name'}</div>;
}
// ── pd-category ───────────────────────────────────────────────────────────────
export function PdCategoryElement({ product, props: p = {} }) {
  return <div style={{ fontSize: (p.fontSize || 10) + 'px', fontWeight: p.fontWeight || 700, color: p.color || '#6366f1', textTransform: p.uppercase !== false ? 'uppercase' : 'none', letterSpacing: '0.06em', fontFamily: p.fontFamily || 'inherit' }}>{product?.category || 'Category'}</div>;
}
// ── pd-price ──────────────────────────────────────────────────────────────────
export function PdPriceElement({ product, props: p = {} }) {
  const prod = product || {};
  const hasSale = prod.salePrice && +prod.salePrice < +prod.price;
  const disc = hasSale ? Math.round((1 - prod.salePrice / prod.price) * 100) : 0;
  const cur = prod.currency || '$';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {hasSale ? <>
        <span style={{ fontSize: (p.saleSize || p.fontSize || 18) + 'px', fontWeight: p.fontWeight || 800, color: p.saleColor || '#ef4444' }}>{cur}{prod.salePrice}</span>
        <span style={{ fontSize: (p.originalSize || 13) + 'px', color: '#94a3b8', textDecoration: 'line-through' }}>{cur}{prod.price}</span>
        {p.showDiscount !== false && disc > 0 && <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', background: '#ef4444', padding: '2px 5px', borderRadius: 4 }}>-{disc}%</span>}
      </> : <span style={{ fontSize: (p.fontSize || 18) + 'px', fontWeight: p.fontWeight || 800, color: p.color || '#0f172a' }}>{cur}{prod.price || '0.00'}</span>}
    </div>
  );
}
// ── pd-badge ──────────────────────────────────────────────────────────────────
export function PdBadgeElement({ product, props: p = {} }) {
  const text = product?.badgeText || p.fallbackText || '30% OFF';
  return <span style={{ display: 'inline-block', background: product?.badgeColor || p.bg || '#ef4444', color: p.color || '#fff', fontSize: (p.fontSize || 9) + 'px', fontWeight: 800, padding: `${p.padV || 3}px ${p.padH || 8}px`, borderRadius: (p.radius || 99) + 'px', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{text}</span>;
}
// ── pd-rating ─────────────────────────────────────────────────────────────────
export function PdRatingElement({ product, props: p = {} }) {
  const rating = +(product?.rating || 4.5);
  const count  = product?.reviewCount || '';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {[1,2,3,4,5].map(i => <svg key={i} width={p.starSize || 11} height={p.starSize || 11} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? (p.starColor || '#f59e0b') : '#e2e8f0'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
      {p.showCount !== false && count && <span style={{ fontSize: (p.countSize || 10) + 'px', color: p.countColor || '#94a3b8' }}>{count}</span>}
    </div>
  );
}
// ── pd-add-to-cart ────────────────────────────────────────────────────────────
export function PdAddToCartElement({ product, props: p = {} }) {
  return (
    <button onClick={e => e.preventDefault()} style={{ width: p.fullWidth !== false ? '100%' : 'auto', padding: `${p.padV || 9}px ${p.padH || 16}px`, background: p.bg || '#6366f1', color: p.color || '#fff', border: 'none', borderRadius: (p.radius || 8) + 'px', fontSize: (p.fontSize || 12) + 'px', fontWeight: p.fontWeight || 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: p.fontFamily || 'inherit' }}>
      {p.showIcon !== false && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
      {p.text || 'Add to Cart'}
    </button>
  );
}
// ── pd-wishlist ───────────────────────────────────────────────────────────────
export function PdWishlistElement({ product, props: p = {} }) {
  return <button onClick={e => e.preventDefault()} style={{ width: (p.size || 30) + 'px', height: (p.size || 30) + 'px', borderRadius: p.shape === 'square' ? (p.radius || 6) + 'px' : '50%', background: p.bg || 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill={p.filled ? (p.iconColor || '#ef4444') : 'none'} stroke={p.iconColor || '#ef4444'} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  </button>;
}
// ── pd-discount ───────────────────────────────────────────────────────────────
export function PdDiscountElement({ product, props: p = {} }) {
  const prod = product || {};
  const hasSale = prod.salePrice && +prod.salePrice < +prod.price;
  const disc = hasSale ? Math.round((1 - prod.salePrice / prod.price) * 100) : (prod.discount || 31);
  return <span style={{ display: 'inline-block', background: p.bg || '#ef4444', color: p.color || '#fff', fontSize: (p.fontSize || 11) + 'px', fontWeight: 800, padding: `${p.padV || 3}px ${p.padH || 8}px`, borderRadius: (p.radius || 6) + 'px' }}>-{disc}% OFF</span>;
}
// ── pd-divider ────────────────────────────────────────────────────────────────
export function PdDividerElement({ props: p = {} }) {
  return <div style={{ height: (p.thickness || 1) + 'px', background: p.color || '#e2e8f0', margin: `${p.marginV || 2}px 0`, width: p.width || '100%' }} />;
}
// ── pd-text ───────────────────────────────────────────────────────────────────
export function PdTextElement({ product, props: p = {} }) {
  return <div style={{ fontSize: (p.fontSize || 12) + 'px', fontWeight: p.fontWeight || 400, color: p.color || '#64748b', lineHeight: p.lineHeight || 1.6, fontFamily: p.fontFamily || 'inherit' }}>{p.content || 'Short description text here'}</div>;
}
// ── pd-brand ──────────────────────────────────────────────────────────────────
export function PdBrandElement({ product, props: p = {} }) {
  return <div style={{ fontSize: (p.fontSize || 10) + 'px', fontWeight: p.fontWeight || 600, color: p.color || '#94a3b8', textTransform: p.uppercase !== false ? 'uppercase' : 'none', letterSpacing: '0.06em', fontFamily: p.fontFamily || 'inherit' }}>{product?.brand || 'Brand'}</div>;
}
// ── pd-stock ──────────────────────────────────────────────────────────────────
export function PdStockElement({ product, props: p = {} }) {
  const inStock = product?.stock !== 0;
  return <div style={{ fontSize: (p.fontSize || 10) + 'px', fontWeight: 600, color: inStock ? (p.inColor || '#10b981') : (p.outColor || '#ef4444'), display: 'flex', alignItems: 'center', gap: 4 }}>
    <div style={{ width: 6, height: 6, borderRadius: '50%', background: inStock ? (p.inColor || '#10b981') : (p.outColor || '#ef4444'), flexShrink: 0 }} />
    {inStock ? (p.inText || 'In Stock') : (p.outText || 'Out of Stock')}
  </div>;
}
// ── pd-sku ────────────────────────────────────────────────────────────────────
export function PdSkuElement({ product, props: p = {} }) {
  return <div style={{ fontSize: (p.fontSize || 10) + 'px', color: p.color || '#94a3b8', fontFamily: 'monospace' }}>SKU: {product?.sku || 'SKU-001'}</div>;
}
// ── pd-quick-buy ──────────────────────────────────────────────────────────────
export function PdQuickBuyElement({ product, props: p = {} }) {
  return <button onClick={e => e.preventDefault()} style={{ width: p.fullWidth !== false ? '100%' : 'auto', padding: `${p.padV || 8}px ${p.padH || 14}px`, background: 'transparent', color: p.color || '#6366f1', border: `1.5px solid ${p.borderColor || '#6366f1'}`, borderRadius: (p.radius || 8) + 'px', fontSize: (p.fontSize || 11) + 'px', fontWeight: p.fontWeight || 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
    {p.text || 'Quick View'}
  </button>;
}

export const pdElementMap = {
  'pd-image':       { component: PdImageElement,    label: 'Product Image',  icon: '🖼',  color: '#10b981', group: 'Media',     defaultProps: { height: 220, objectFit: 'cover', radius: 0 } },
  'pd-title':       { component: PdTitleElement,    label: 'Product Title',  icon: '📝',  color: '#8b5cf6', group: 'Info',      defaultProps: { fontSize: 13, fontWeight: 600, color: '#0f172a', lineHeight: 1.4 } },
  'pd-category':    { component: PdCategoryElement, label: 'Category',       icon: '🏷',  color: '#6366f1', group: 'Info',      defaultProps: { fontSize: 10, color: '#6366f1', uppercase: true } },
  'pd-price':       { component: PdPriceElement,    label: 'Price',          icon: '💰',  color: '#ef4444', group: 'Info',      defaultProps: { fontSize: 16, fontWeight: 800, color: '#0f172a', saleColor: '#ef4444', showDiscount: true } },
  'pd-rating':      { component: PdRatingElement,   label: 'Rating',         icon: '⭐',  color: '#f59e0b', group: 'Info',      defaultProps: { starSize: 11, starColor: '#f59e0b', showCount: true } },
  'pd-brand':       { component: PdBrandElement,    label: 'Brand',          icon: '🏪',  color: '#64748b', group: 'Info',      defaultProps: { fontSize: 10, color: '#94a3b8', uppercase: true } },
  'pd-text':        { component: PdTextElement,     label: 'Custom Text',    icon: '¶',   color: '#0ea5e9', group: 'Info',      defaultProps: { fontSize: 12, color: '#64748b', lineHeight: 1.6, content: 'Short description' } },
  'pd-stock':       { component: PdStockElement,    label: 'Stock Status',   icon: '📦',  color: '#10b981', group: 'Info',      defaultProps: { fontSize: 10, inColor: '#10b981', outColor: '#ef4444' } },
  'pd-sku':         { component: PdSkuElement,      label: 'SKU',            icon: '#',   color: '#94a3b8', group: 'Info',      defaultProps: { fontSize: 10, color: '#94a3b8' } },
  'pd-add-to-cart': { component: PdAddToCartElement,label: 'Add to Cart',    icon: '🛒',  color: '#10b981', group: 'Actions',   defaultProps: { text: 'Add to Cart', bg: '#6366f1', color: '#fff', fontSize: 12, fontWeight: 700, radius: 8, padV: 9, padH: 16, showIcon: true, fullWidth: true } },
  'pd-quick-buy':   { component: PdQuickBuyElement, label: 'Quick View',     icon: '👁',  color: '#6366f1', group: 'Actions',   defaultProps: { text: 'Quick View', color: '#6366f1', borderColor: '#6366f1', fontSize: 11, fontWeight: 600, radius: 8, padV: 8, padH: 14, fullWidth: true } },
  'pd-badge':       { component: PdBadgeElement,    label: 'Badge',          icon: '🏷️', color: '#ef4444', group: 'Overlay',   canOverlay: true, defaultProps: { bg: '#ef4444', color: '#fff', fontSize: 9, radius: 99, padV: 3, padH: 8, top: 10, left: 10 } },
  'pd-discount':    { component: PdDiscountElement, label: 'Discount Label', icon: '%',   color: '#f59e0b', group: 'Overlay',   canOverlay: true, defaultProps: { bg: '#ef4444', color: '#fff', fontSize: 11, radius: 6, top: 10, left: 10 } },
  'pd-wishlist':    { component: PdWishlistElement, label: 'Wishlist',       icon: '❤',   color: '#ef4444', group: 'Overlay',   canOverlay: true, defaultProps: { size: 30, bg: 'rgba(255,255,255,0.92)', iconColor: '#ef4444', shape: 'circle', top: 8, right: 8 } },
  'pd-divider':     { component: PdDividerElement,  label: 'Divider',        icon: '—',   color: '#94a3b8', group: 'Layout',    defaultProps: { thickness: 1, color: '#e2e8f0', marginV: 2 } },
};

export const PD_GROUPS = ['Media', 'Info', 'Actions', 'Overlay', 'Layout'];
