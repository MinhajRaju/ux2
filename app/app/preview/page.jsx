// src/app/preview/page.jsx
// Previews the site home page (slug="/")
'use client';
import { useEffect, useState } from 'react';
import { StructureRenderer } from '@/components/shared/StructureRenderer';
import { headerCanvasConfig } from '@/configs/headerCanvasConfig';
import { pageCanvasConfig }   from '@/configs/pageCanvasConfig';
import { footerCanvasConfig } from '@/configs/footerCanvasConfig';
import { getPageBySlug, getHeaderById, getFooterById, getGlobalSettings } from '@/lib/db';

export default function PreviewHomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const settings = getGlobalSettings();
    const page   = getPageBySlug('/');
    const header = getHeaderById(settings.activeHeaderId);
    const footer = getFooterById(settings.activeFooterId);
    setData({ page, header, footer });
  }, []);

  if (!data) return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>;

  if (!data.page) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#334155' }}>Home page not found</div>
        <a href="/" style={{ display: 'inline-block', marginTop: 16, color: '#6366f1', fontWeight: 600 }}>← Dashboard</a>
      </div>
    );
  }

  return (
    <>
      {data.header && (
        <StructureRenderer
          data={data.header}
          mode="view"
          elementMap={headerCanvasConfig.elementMap}
        />
      )}
      <StructureRenderer
        data={data.page}
        mode="view"
        elementMap={pageCanvasConfig.elementMap}
      />
      {data.footer && (
        <StructureRenderer
          data={data.footer}
          mode="view"
          elementMap={footerCanvasConfig.elementMap}
        />
      )}
    </>
  );
}
