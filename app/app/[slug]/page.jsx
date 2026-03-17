'use client';
/**
 * /[slug] — Public rendered page
 *
 * এই ফাইল দুটো কাজ করে:
 *  1. localStorage থেকে builder design (sections JSON) লোড করে
 *  2. product-card ও product-grid elements-এ live API data inject করে
 *
 * তোমার API তে connect করতে শুধু বদলাও:
 *   NEXT_PUBLIC_PRODUCT_API_URL = তোমার API base URL
 *   mapProductToProps()         = তোমার API-র field names
 */

import { useEffect, useState } from 'react';
import { loadStore }            from '../../lib/themeStore';
import { StructureRenderer }    from '../../components/shared/StructureRenderer';
import { headerCanvasConfig }   from '../../configs/headerCanvasConfig';
import { pageCanvasConfig }     from '../../configs/pageCanvasConfig';
import { footerCanvasConfig }   from '../../configs/footerCanvasConfig';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — তোমার API URL এখানে দাও
// .env.local এ রাখো: NEXT_PUBLIC_PRODUCT_API_URL=https://yourstore.com/api
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PRODUCT_API_URL)
  || '/api'; // app-এর নিজস্ব internal API

// ─────────────────────────────────────────────────────────────────────────────
// mapProductToProps — API response → ProductCard/Grid props
//
// তোমার API-র field names অনুযায়ী বদলাও।
// dummyjson.com format এখন set করা আছে।
// ─────────────────────────────────────────────────────────────────────────────
function mapProductToProps(raw) {
  const discountPct = Number(raw.discountPercentage ?? 0);
  const basePrice   = Number(raw.price ?? raw.regularPrice ?? 0);
  const salePrice   = discountPct > 0
    ? +(basePrice * (1 - discountPct / 100)).toFixed(2)
    : (Number(raw.salePrice ?? raw.sale_price ?? 0) || undefined);

  return {
    _productId:  String(raw.id ?? raw._id ?? ''),
    title:       raw.title    ?? raw.name         ?? 'Product',
    category:    raw.category ?? raw.categoryName  ?? '',
    imageSrc:    raw.thumbnail ?? raw.image ?? raw.images?.[0]?.url ?? raw.images?.[0] ?? '',
    currency:    raw.currency ?? '$',
    price:       basePrice,
    salePrice:   salePrice,
    badgeText:   discountPct > 0 ? `${Math.round(discountPct)}% OFF` : (raw.badge ?? raw.label ?? ''),
    badgeColor:  '#ef4444',
    rating:      Number(raw.rating ?? raw.averageRating ?? 0),
    reviewCount: raw.stock ? `(${raw.stock} in stock)` : (raw.reviewCount ? `(${raw.reviewCount})` : ''),
    showRating:  !!(raw.rating || raw.averageRating),
    showDiscount:!!(discountPct > 0 || raw.salePrice || raw.sale_price),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchByDataSource — dataSource string দেখে কোন API endpoint call করবে
// ─────────────────────────────────────────────────────────────────────────────
async function fetchByDataSource(dataSource, limit = 8) {
  const lim = `limit=${limit}&select=id,title,price,category,thumbnail,rating,stock,discountPercentage`;

  let url;
  if (!dataSource || dataSource === 'all') {
    url = `${API_BASE}/products?${lim}`;
  } else if (dataSource.startsWith('category:')) {
    const cat = dataSource.split(':')[1];
    url = `${API_BASE}/products/category/${encodeURIComponent(cat)}?${lim}`;
  } else if (dataSource.startsWith('collection:')) {
    const col = dataSource.split(':')[1];
    // তোমার collection endpoint এখানে দাও
    url = `${API_BASE}/collections/${col}?${lim}`;
  } else if (dataSource.startsWith('search:')) {
    const q = dataSource.split(':')[1];
    url = `${API_BASE}/products/search?q=${encodeURIComponent(q)}&${lim}`;
  } else {
    url = `${API_BASE}/products?${lim}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`);
  const json = await res.json();

  const arr = Array.isArray(json) ? json
    : (json.products ?? json.data ?? json.items ?? json.results ?? []);
  return arr.map(mapProductToProps);
}

// ─────────────────────────────────────────────────────────────────────────────
// collectNeeds — sections walk করে কোন data দরকার সেটা বের করে
// returns:
//   productIds  — product-card elements-এর _productId list
//   gridElements — product-grid elements (dataSource, limit সহ)
// ─────────────────────────────────────────────────────────────────────────────
function collectNeeds(sections) {
  const productIds  = new Set();
  const gridElements = [];

  const walkEls = (elements) => {
    for (const el of elements || []) {
      if (el.type === 'product-card' && el.props?._productId) {
        productIds.add(String(el.props._productId));
      }
      if (el.type === 'product-grid') {
        gridElements.push(el);
      }
    }
  };

  const walkCols = (cols) => {
    for (const col of cols || []) {
      walkEls(col.elements);
      walkCols(col.columns);
      for (const sr of col.subRows || []) walkCols(sr.columns);
    }
  };

  for (const sec of sections || []) {
    for (const row of sec.rows || []) {
      walkCols(row.columns);
      for (const cell of row.cells || []) walkEls(cell.elements);
    }
  }

  return { productIds: [...productIds], gridElements };
}

// ─────────────────────────────────────────────────────────────────────────────
// injectData — fetch করা data, sections-এর ভেতরে inject করে
// ─────────────────────────────────────────────────────────────────────────────
function injectData(sections, singleProductMap, gridDataMap) {
  const injectEls = (elements) =>
    (elements || []).map(el => {
      // ── product-card: single product match ──
      if (el.type === 'product-card' && el.props?._productId) {
        const fresh = singleProductMap[String(el.props._productId)];
        if (fresh) return { ...el, props: { ...el.props, ...fresh } };
      }
      // ── product-grid: fetched array inject ──
      if (el.type === 'product-grid') {
        const products = gridDataMap[el.id];
        if (products) return { ...el, props: { ...el.props, _products: products } };
      }
      return el;
    });

  const walkCols = (cols) =>
    (cols || []).map(col => ({
      ...col,
      elements: injectEls(col.elements),
      columns:  col.columns  ? walkCols(col.columns)  : undefined,
      subRows:  col.subRows
        ? col.subRows.map(sr => ({ ...sr, columns: walkCols(sr.columns) }))
        : undefined,
    }));

  return sections.map(sec => ({
    ...sec,
    rows: (sec.rows || []).map(row => ({
      ...row,
      columns: walkCols(row.columns),
      cells:   (row.cells || []).map(cell => ({ ...cell, elements: injectEls(cell.elements) })),
    })),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────
export default function RenderedPage({ params }) {
  const slug = params?.slug || '/';
  const [data,    setData]    = useState(null);
  const [sections,setSections]= useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // ── Step 1: builder design localStorage থেকে load ──
        const { templates, globalSettings } = loadStore();
        const page   = templates.find(t => t.type === 'page' && t.slug === slug);
        const header = templates.find(t => t.id === globalSettings.activeHeaderId);
        const footer = templates.find(t => t.id === globalSettings.activeFooterId);
        setData({ page, header, footer });

        if (!page?.sections?.length) { setSections([]); return; }

        // ── Step 2: কী কী data দরকার বের করো ──────────────
        const { productIds, gridElements } = collectNeeds(page.sections);

        // কিছুই না থাকলে direct render
        if (!productIds.length && !gridElements.length) {
          setSections(page.sections);
          return;
        }

        // ── Step 3: Parallel fetch ─────────────────────────
        const [singleProducts, ...gridProducts] = await Promise.all([
          // Single product-cards — ID দিয়ে fetch
          productIds.length > 0
            ? fetch(`${API_BASE}/products?limit=100&select=id,title,price,category,thumbnail,rating,stock,discountPercentage`)
                .then(r => r.json())
                .then(j => (j.products ?? j.data ?? []).map(mapProductToProps))
                .catch(() => [])
            : Promise.resolve([]),

          // Product-grid elements — প্রতিটার dataSource অনুযায়ী আলাদা fetch
          ...gridElements.map(el =>
            fetchByDataSource(el.props?.dataSource, el.props?.limit || 8)
              .catch(() => [])
          ),
        ]);

        // ── Step 4: Map তৈরি করো ───────────────────────────
        // single products → { "42": {title, price, ...}, ... }
        const singleProductMap = Object.fromEntries(
          singleProducts
            .filter(p => productIds.includes(String(p._productId)))
            .map(p => [String(p._productId), p])
        );

        // grid products → { "el_id": [{...}, {...}], ... }
        const gridDataMap = Object.fromEntries(
          gridElements.map((el, i) => [el.id, gridProducts[i] || []])
        );

        // ── Step 5: Inject & render ────────────────────────
        setSections(injectData(page.sections, singleProductMap, gridDataMap));

      } catch (err) {
        console.error('[RenderedPage]', err);
        // API fail → builder snapshot দিয়ে দেখাও
        const { templates } = loadStore();
        const page = templates.find(t => t.type === 'page' && t.slug === slug);
        setSections(page?.sections || []);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  if (!data?.page) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#94a3b8' }}>
        <div style={{ fontSize: 40 }}>404</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#334155' }}>Page not found</div>
        <div style={{ fontSize: 13 }}>No page exists for slug: <code>/{slug}</code></div>
        <a href="/builder" style={{ marginTop: 8, color: '#6366f1', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>← Go to Builder</a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {data.header && (
        <StructureRenderer
          data={data.header.headerData || { sections: [] }}
          mode="view"
          elementMap={headerCanvasConfig.elementMap}
        />
      )}
      {sections && sections.length > 0 ? (
        <StructureRenderer
          data={{ sections }}
          mode="view"
          elementMap={pageCanvasConfig.elementMap}
        />
      ) : (
        <div style={{ padding: '80px 32px', textAlign: 'center', color: '#94a3b8', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ fontSize: 40 }}>📄</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>{data.page.name}</div>
          <div style={{ fontSize: 13 }}>This page has no content yet</div>
          <a href="/builder" style={{ color: '#6366f1', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>← Edit in Builder</a>
        </div>
      )}
      {data.footer && (
        <StructureRenderer
          data={data.footer.footerData || { sections: [] }}
          mode="view"
          elementMap={footerCanvasConfig.elementMap}
        />
      )}
    </div>
  );
}
