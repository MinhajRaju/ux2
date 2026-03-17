'use client';
import { useState, useEffect } from 'react';
import CardTemplateRenderer from './card-designer/CardTemplateRenderer';

// ── Single product card (internal) ────────────────────────────
function ProductCard({ product, props: p }) {
  const sale = product.salePrice && Number(product.salePrice) < Number(product.price);
  const disc = sale ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <div style={{
      borderRadius: (p.cardRadius ?? 12) + 'px',
      overflow: 'hidden',
      background: p.cardBg || '#ffffff',
      border: `1px solid ${p.cardBorder || '#e2e8f0'}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      fontFamily: 'inherit',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', height: (p.imageHeight || 220) + 'px', background: '#f8fafc', overflow: 'hidden', flexShrink: 0 }}>
        {product.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageSrc} alt={product.title || ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#cbd5e1" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="#cbd5e1"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>No image</span>
          </div>
        )}
        {product.badgeText && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: product.badgeColor || '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {product.badgeText}
          </span>
        )}
        {p.showWishlist && (
          <button style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: (p.cardPadding || 14) + 'px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {product.category && (
          <div style={{ fontSize: 9, fontWeight: 700, color: p.accentColor || '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            {product.category}
          </div>
        )}
        <div style={{ fontSize: (p.titleSize || 13) + 'px', fontWeight: 600, color: p.titleColor || '#0f172a', lineHeight: 1.4, marginBottom: 6, flex: 1 }}>
          {product.title || 'Product Name'}
        </div>
        {p.showRating && product.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= Math.round(product.rating) ? '#f59e0b' : '#e2e8f0'}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
            {product.reviewCount && <span style={{ fontSize: 10, color: '#94a3b8' }}>{product.reviewCount}</span>}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, flexWrap: 'wrap' }}>
          {sale ? (
            <>
              <span style={{ fontSize: (p.priceSize || 16) + 'px', fontWeight: 800, color: '#ef4444' }}>
                {product.currency || '$'}{product.salePrice}
              </span>
              <span style={{ fontSize: (p.priceSize || 16) - 4 + 'px', fontWeight: 400, color: '#94a3b8', textDecoration: 'line-through' }}>
                {product.currency || '$'}{product.price}
              </span>
              {p.showDiscount && (
                <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: '#ef4444', padding: '2px 5px', borderRadius: 4 }}>
                  -{disc}%
                </span>
              )}
            </>
          ) : (
            <span style={{ fontSize: (p.priceSize || 16) + 'px', fontWeight: 800, color: p.priceColor || '#0f172a' }}>
              {product.currency || '$'}{product.price}
            </span>
          )}
        </div>
        {p.showCartBtn && (
          <button style={{
            width: '100%', padding: '8px 0',
            background: p.btnBg || '#6366f1', color: p.btnColor || '#fff',
            border: 'none', borderRadius: (p.btnRadius || 8) + 'px',
            fontSize: (p.btnFontSize || 12) + 'px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {p.btnText || 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Skeleton card (loading state) ────────────────────────────
function SkeletonCard({ p }) {
  const pulse = { animation: 'pulse 1.5s ease-in-out infinite', background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '200% 100%' };
  return (
    <div style={{ borderRadius: (p.cardRadius ?? 12) + 'px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff' }}>
      <div style={{ ...pulse, width: '100%', height: (p.imageHeight || 220) + 'px' }} />
      <div style={{ padding: (p.cardPadding || 14) + 'px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ ...pulse, height: 10, width: '40%', borderRadius: 4 }} />
        <div style={{ ...pulse, height: 14, width: '90%', borderRadius: 4 }} />
        <div style={{ ...pulse, height: 14, width: '60%', borderRadius: 4 }} />
        <div style={{ ...pulse, height: 10, width: '30%', borderRadius: 4 }} />
        <div style={{ ...pulse, height: 34, borderRadius: 8, marginTop: 4 }} />
      </div>
    </div>
  );
}

// ── mapProductToProps (dummyjson + generic) ──────────────────
function mapProductToProps(raw) {
  const discountPct = Number(raw.discountPercentage ?? 0);
  const basePrice   = Number(raw.price ?? raw.regularPrice ?? 0);
  const salePrice   = discountPct > 0
    ? +(basePrice * (1 - discountPct / 100)).toFixed(2)
    : (Number(raw.salePrice ?? raw.sale_price ?? 0) || undefined);

  return {
    _productId:  String(raw.id ?? raw._id ?? ''),
    title:       raw.title    ?? raw.name        ?? 'Product',
    category:    raw.category ?? raw.categoryName ?? '',
    imageSrc:    raw.thumbnail ?? raw.image ?? raw.images?.[0]?.url ?? raw.images?.[0] ?? '',
    currency:    raw.currency ?? '$',
    price:       basePrice,
    salePrice:   salePrice,
    badgeText:   discountPct > 0 ? `${Math.round(discountPct)}% OFF` : (raw.badge ?? raw.label ?? ''),
    badgeColor:  '#ef4444',
    rating:      Number(raw.rating ?? raw.averageRating ?? 0),
    reviewCount: raw.stock ? `(${raw.stock} in stock)` : (raw.reviewCount ? `(${raw.reviewCount})` : ''),
  };
}

// ── Fetch by dataSource ──────────────────────────────────────
async function fetchProducts(dataSource, limit, apiBase) {
  const base = apiBase || process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'https://dummyjson.com';

  let url;
  if (!dataSource || dataSource === 'all') {
    url = `${base}/products?limit=${limit}&select=id,title,price,category,thumbnail,rating,stock,discountPercentage`;
  } else if (dataSource.startsWith('category:')) {
    const cat = dataSource.split(':')[1];
    url = `${base}/products/category/${encodeURIComponent(cat)}?limit=${limit}&select=id,title,price,category,thumbnail,rating,stock,discountPercentage`;
  } else if (dataSource.startsWith('collection:')) {
    const col = dataSource.split(':')[1];
    // তোমার API তে collection endpoint থাকলে এখানে বদলাও
    url = `${base}/products?limit=${limit}&select=id,title,price,category,thumbnail,rating,stock,discountPercentage`;
  } else if (dataSource.startsWith('search:')) {
    const q = dataSource.split(':')[1];
    url = `${base}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&select=id,title,price,category,thumbnail,rating,stock,discountPercentage`;
  } else {
    url = `${base}/products?limit=${limit}&select=id,title,price,category,thumbnail,rating,stock,discountPercentage`;
  }

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();

  const arr = Array.isArray(json) ? json
    : (json.products ?? json.data ?? json.items ?? json.results ?? []);
  return arr.map(mapProductToProps);
}

// ── Main element component ───────────────────────────────────
export default function ProductGridElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  const [products, setProducts] = useState(p._products || []);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  // If products were already injected server-side, use them directly
  const hasInjected = Array.isArray(p._products) && p._products.length > 0;

  useEffect(() => {
    // In edit mode: fetch directly so builder preview works
    // In view mode:  _products injected by page.jsx — skip fetch
    if (mode !== 'edit' && hasInjected) {
      setProducts(p._products);
      return;
    }
    if (mode !== 'edit') return;

    setLoading(true);
    setError(null);
    fetchProducts(p.dataSource, p.limit || 8, p._apiBase)
      .then(data => setProducts(data))
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.dataSource, p.limit, mode]);

  const colCount  = p.columns || 3;
  const showCount = p.limit   || 8;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
    gap: (p.gap || 20) + 'px',
    padding: `${p.padV || 0}px ${p.padH || 0}px`,
  };

  return (
    <div
      onClick={mode === 'edit' ? onSelect : undefined}
      style={{
        cursor:  mode === 'edit' ? 'pointer' : 'default',
        outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
      }}
    >
      {/* Section heading */}
      {p.sectionTitle && (
        <div style={{ marginBottom: (p.titleGap || 24) + 'px', textAlign: p.titleAlign || 'left' }}>
          <h2 style={{ fontSize: (p.titleSize || 24) + 'px', fontWeight: 700, color: p.titleColor || '#0f172a', margin: 0 }}>
            {p.sectionTitle}
          </h2>
          {p.sectionSubtitle && (
            <p style={{ fontSize: (p.subtitleSize || 14) + 'px', color: p.subtitleColor || '#64748b', marginTop: 6, marginBottom: 0 }}>
              {p.sectionSubtitle}
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: 16, background: '#fef2f2', borderRadius: 10, color: '#ef4444', fontSize: 12, marginBottom: 12 }}>
          ⚠ {error}
        </div>
      )}

      {/* Grid */}
      <div style={gridStyle}>
        {loading
          ? Array.from({ length: showCount }).map((_, i) => <SkeletonCard key={i} p={p} />)
          : products.slice(0, showCount).map((product, i) => (
              p.cardTemplate
                ? <CardTemplateRenderer key={product._productId || i} template={p.cardTemplate} product={product} />
                : <ProductCard key={product._productId || i} product={product} props={p} />
            ))
        }
        {!loading && !error && products.length === 0 && mode === 'edit' && (
          <div style={{ gridColumn: `span ${colCount}`, padding: '40px 20px', textAlign: 'center', border: '2px dashed #e2e8f0', borderRadius: 12, color: '#94a3b8' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📦</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>No products</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>Right panel-এ Data Source set করো</div>
          </div>
        )}
      </div>

      {/* View all button */}
      {p.showViewAll && p.viewAllText && !loading && (
        <div style={{ textAlign: 'center', marginTop: (p.titleGap || 24) + 'px' }}>
          <a
            href={mode === 'view' ? (p.viewAllHref || '#') : undefined}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 28px',
              background: p.viewAllBg || 'transparent',
              color: p.viewAllColor || '#6366f1',
              border: `1.5px solid ${p.viewAllColor || '#6366f1'}`,
              borderRadius: (p.viewAllRadius || 8) + 'px',
              fontSize: (p.viewAllFontSize || 13) + 'px',
              fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
            }}
          >
            {p.viewAllText}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      )}
    </div>
  );
}
