'use client';
/**
 * /[slug] — public rendered page
 * Reads template data via themeStore (same storage layer as ThemeBuilder dashboard).
 */
import { useEffect, useState } from 'react';
import { loadStore } from '../../lib/themeStore';
import { StructureRenderer } from '../../components/shared/StructureRenderer';
import { headerCanvasConfig } from '../../configs/headerCanvasConfig';
import { pageCanvasConfig }   from '../../configs/pageCanvasConfig';
import { footerCanvasConfig } from '../../configs/footerCanvasConfig';

export default function RenderedPage({ params }) {
  const slug = params?.slug || '/';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const { templates, globalSettings } = loadStore();

      const page   = templates.find(t => t.type === 'page' && t.slug === slug);
      const header = templates.find(t => t.id === globalSettings.activeHeaderId);
      const footer = templates.find(t => t.id === globalSettings.activeFooterId);

      setData({ page, header, footer });
    } catch {
      setData({ page: null, header: null, footer: null });
    }
    setLoading(false);
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
        <div style={{ fontSize: 13 }}>No page template exists for slug: <code>/{slug}</code></div>
        <a href="/builder" style={{ marginTop: 8, color: '#6366f1', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
          ← Go to Builder
        </a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Active header */}
      {data.header && (
        <StructureRenderer
          data={data.header.headerData || { sections: [] }}
          mode="view"
          elementMap={headerCanvasConfig.elementMap}
        />
      )}

      {/* Page content */}
      {data.page.sections && data.page.sections.length > 0 ? (
        <StructureRenderer
          data={{ sections: data.page.sections }}
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

      {/* Active footer */}
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