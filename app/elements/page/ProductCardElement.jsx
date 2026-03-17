'use client';

export default function ProductCardElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  const sale = p.salePrice && p.salePrice < (p.price || 0);

  return (
    <div
      onClick={mode === 'edit' ? onSelect : undefined}
      style={{
        cursor: mode === 'edit' ? 'pointer' : 'default',
        outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        borderRadius: (p.borderRadius ?? 12) + 'px',
        overflow: 'hidden',
        background: p.cardBg || '#ffffff',
        boxShadow: p.shadow !== 'none' ? (p.shadow || '0 2px 12px rgba(0,0,0,0.08)') : 'none',
        border: `1px solid ${p.borderColor || '#e2e8f0'}`,
        maxWidth: (p.maxWidth || 280) + 'px',
        fontFamily: 'inherit',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', height: (p.imageHeight || 220) + 'px', background: '#f8fafc', overflow: 'hidden' }}>
        {p.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageSrc} alt={p.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#cbd5e1" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="#cbd5e1"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Product Image</span>
          </div>
        )}
        {/* Badge */}
        {p.badgeText && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: p.badgeColor || '#ef4444', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>{p.badgeText}</span>
        )}
        {/* Wishlist */}
        {p.showWishlist && (
          <button style={{
            position: 'absolute', top: 10, right: 10,
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: (p.padding || 14) + 'px' }}>
        {/* Category */}
        {p.category && (
          <div style={{ fontSize: 10, fontWeight: 600, color: p.accentColor || '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            {p.category}
          </div>
        )}
        {/* Title */}
        <div style={{ fontSize: (p.titleSize || 14) + 'px', fontWeight: 600, color: p.titleColor || '#0f172a', lineHeight: 1.4, marginBottom: 6 }}>
          {p.title || 'Product Name'}
        </div>
        {/* Rating */}
        {p.showRating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= (p.rating || 4) ? '#f59e0b' : '#e2e8f0'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
            {p.reviewCount && <span style={{ fontSize: 11, color: '#94a3b8' }}>({p.reviewCount})</span>}
          </div>
        )}
        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          {sale ? (
            <>
              <span style={{ fontSize: (p.priceSize || 18) + 'px', fontWeight: 700, color: p.salePriceColor || '#ef4444' }}>
                {p.currency || '$'}{p.salePrice}
              </span>
              <span style={{ fontSize: (p.priceSize || 18) - 4 + 'px', fontWeight: 400, color: '#94a3b8', textDecoration: 'line-through' }}>
                {p.currency || '$'}{p.price}
              </span>
              {p.showDiscount && (
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: '#ef4444', padding: '2px 6px', borderRadius: 4 }}>
                  -{Math.round((1 - p.salePrice / p.price) * 100)}%
                </span>
              )}
            </>
          ) : (
            <span style={{ fontSize: (p.priceSize || 18) + 'px', fontWeight: 700, color: p.priceColor || '#0f172a' }}>
              {p.currency || '$'}{p.price || '0.00'}
            </span>
          )}
        </div>
        {/* Add to Cart */}
        {p.showCartBtn && (
          <button style={{
            width: '100%', padding: '9px 0',
            background: p.btnBg || '#6366f1', color: p.btnColor || '#fff',
            border: 'none', borderRadius: (p.btnRadius || 8) + 'px',
            fontSize: (p.btnFontSize || 13) + 'px', fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {p.btnText || 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}
