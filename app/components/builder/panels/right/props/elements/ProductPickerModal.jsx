'use client';
/**
 * ProductPickerModal
 * ─────────────────────────────────────────────────────────────────
 * A modal that fetches products from your API and lets the user
 * pick one to populate the ProductCard element props.
 *
 * Props:
 *   onSelect(productProps) — called with the mapped props object
 *   onClose()              — called when modal is dismissed
 *   apiUrl                 — your product list endpoint
 *                            e.g. "/api/products"  or  "https://your-api.com/products"
 *
 * API response format (auto-detected, see mapProduct() below):
 *   { products: [...] }  or  { data: [...] }  or  [...] (bare array)
 *   Each product object needs at minimum an id, name/title, and price field.
 *   Image, description, category, salePrice are mapped automatically when present.
 *
 * HOW TO CHANGE THE FIELD MAPPING:
 *   Edit the mapProduct() function below to match your exact API response shape.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from 'react';
import { T } from '../../../../../../constants/theme';

// ── Field mapping — edit this to match your API response ─────────
function mapProduct(raw) {
  return {
    // ── identity (not shown in card, used for picker only) ─────
    _productId:   raw.id        ?? raw._id       ?? raw.productId ?? '',

    // ── visual ─────────────────────────────────────────────────
    imageSrc:     raw.image     ?? raw.imageUrl  ?? raw.thumbnail ??
                  raw.images?.[0]?.url ?? raw.images?.[0] ?? '',

    // ── text ───────────────────────────────────────────────────
    title:        raw.title     ?? raw.name      ?? raw.productName ?? 'Product',
    category:     raw.category  ?? raw.type      ?? raw.categoryName ?? '',

    // ── pricing ────────────────────────────────────────────────
    currency:     raw.currency  ?? '$',
    price:        Number(raw.price        ?? raw.originalPrice ?? raw.regularPrice ?? 0),
    salePrice:    Number(raw.salePrice    ?? raw.discountedPrice ?? raw.sale_price  ?? 0) || undefined,

    // ── e-commerce extras ──────────────────────────────────────
    rating:       Number(raw.rating       ?? raw.averageRating  ?? 0)   || undefined,
    reviewCount:  raw.reviewCount ?? raw.numReviews
                    ? `(${raw.reviewCount ?? raw.numReviews})` : '',
    badgeText:    raw.badge ?? raw.label ?? (
                    raw.salePrice || raw.discountedPrice ? 'SALE' : ''
                  ),

    // ── card defaults (keep unless user has changed them) ──────
    showCartBtn:  true,
    showWishlist: true,
    showRating:   !!(raw.rating || raw.averageRating),
    showDiscount: !!(raw.salePrice || raw.discountedPrice),
  };
}

// ── helpers ──────────────────────────────────────────────────────
function extractArray(json) {
  if (Array.isArray(json))          return json;
  if (Array.isArray(json.products)) return json.products;
  if (Array.isArray(json.data))     return json.data;
  if (Array.isArray(json.items))    return json.items;
  if (Array.isArray(json.results))  return json.results;
  return [];
}

// ── Sub-components ────────────────────────────────────────────────
function ProductRow({ product, onPick }) {
  const mapped = mapProduct(product);
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={() => onPick(mapped)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
        borderRadius: 10, cursor: 'pointer',
        background: hover ? `${T.primary}0d` : 'transparent',
        border: `1px solid ${hover ? T.primary : T.border}`,
        transition: 'all 0.15s',
        marginBottom: 6,
      }}
    >
      {/* Image thumbnail */}
      <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: T.light, border: `1px solid ${T.border}` }}>
        {mapped.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mapped.imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📦</div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {mapped.title}
        </div>
        {mapped.category && (
          <div style={{ fontSize: 10, color: T.textLight, marginTop: 2 }}>{mapped.category}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          {mapped.salePrice ? (
            <>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>{mapped.currency}{mapped.salePrice}</span>
              <span style={{ fontSize: 10, color: T.textLight, textDecoration: 'line-through' }}>{mapped.currency}{mapped.price}</span>
            </>
          ) : (
            <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{mapped.currency}{mapped.price}</span>
          )}
        </div>
      </div>

      {/* Pick arrow */}
      <div style={{ color: hover ? T.primary : T.textLight, fontSize: 16, flexShrink: 0 }}>
        {hover ? '✓' : '›'}
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────
export function ProductPickerModal({ onSelect, onClose, apiUrl = '/api/products' }) {
  const [products, setProducts]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState(null);
  const [search,   setSearch]     = useState('');
  const searchRef = useRef();

  // Fetch products
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(apiUrl, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`API error: ${r.status} ${r.statusText}`);
        return r.json();
      })
      .then(json => {
        const arr = extractArray(json);
        if (!arr.length) throw new Error('API returned no products. Check your endpoint or field mapping.');
        setProducts(arr);
      })
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [apiUrl]);

  // Focus search on open
  useEffect(() => { setTimeout(() => searchRef.current?.focus(), 80); }, []);

  const filtered = products.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    const mapped = mapProduct(p);
    return mapped.title.toLowerCase().includes(q) ||
      (mapped.category || '').toLowerCase().includes(q);
  });

  // Backdrop click closes
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 480,
          background: T.bg || '#fff', borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          maxHeight: '80vh',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Pick a Product</div>
            <div style={{ fontSize: 11, color: T.textLight, marginTop: 2 }}>{loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', cursor: 'pointer', color: T.textMid, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>
        </div>

        {/* Search */}
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.light, borderRadius: 8, padding: '7px 12px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.textLight} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 12, color: T.text }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: T.textLight, fontSize: 14, padding: 0 }}>✕</button>
            )}
          </div>
        </div>

        {/* Product list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: T.textLight, fontSize: 13 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
              Loading products…
            </div>
          )}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, color: '#ef4444', fontSize: 12, marginBottom: 4 }}>Could not load products</div>
              <div style={{ fontSize: 11, color: '#7f1d1d', lineHeight: 1.6 }}>{error}</div>
              <div style={{ fontSize: 11, color: '#7f1d1d', marginTop: 8 }}>
                Check: (1) <code style={{ background: '#fee2e2', padding: '1px 4px', borderRadius: 3 }}>apiUrl</code> prop on ProductPickerModal, (2) CORS headers on your API, (3) <code style={{ background: '#fee2e2', padding: '1px 4px', borderRadius: 3 }}>mapProduct()</code> field names.
              </div>
            </div>
          )}
          {!loading && !error && !filtered.length && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: T.textLight, fontSize: 13 }}>
              No products match "{search}"
            </div>
          )}
          {!loading && !error && filtered.map((p, i) => (
            <ProductRow
              key={p.id ?? p._id ?? i}
              product={p}
              onPick={(mapped) => { onSelect(mapped); onClose(); }}
            />
          ))}
        </div>

        {/* Footer note */}
        <div style={{ padding: '10px 16px', borderTop: `1px solid ${T.border}`, fontSize: 10, color: T.textLight, lineHeight: 1.6 }}>
          Data is saved as a snapshot. To update later, pick the product again.
        </div>
      </div>
    </div>
  );
}
