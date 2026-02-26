'use client';
/**
 * LivePreview — reads directly from localStorage (themeStore)
 * Shows: active header + any page + active footer
 * Used as a modal overlay inside ThemeBuilder dashboard.
 */
import { useState, useMemo } from 'react';
import { StructureRenderer } from './shared/StructureRenderer';
import { headerCanvasConfig } from '../configs/headerCanvasConfig';
import { pageCanvasConfig   } from '../configs/pageCanvasConfig';
import { footerCanvasConfig } from '../configs/footerCanvasConfig';

export function LivePreview({ templates, globalSettings, onClose }) {
  const headers = templates.filter(t => t.type === 'header');
  const footers = templates.filter(t => t.type === 'footer');
  const pages   = templates.filter(t => t.type === 'page');

  // Which page is currently shown
  const [selectedPageId, setSelectedPageId] = useState(
    pages.length > 0 ? pages[0].id : null
  );
  const [isMobile, setIsMobile] = useState(false);

  const activeHeader = useMemo(() =>
    headers.find(h => h.id === globalSettings.activeHeaderId) || null,
    [headers, globalSettings.activeHeaderId]
  );
  const activeFooter = useMemo(() =>
    footers.find(f => f.id === globalSettings.activeFooterId) || null,
    [footers, globalSettings.activeFooterId]
  );
  const selectedPage = useMemo(() =>
    pages.find(p => p.id === selectedPageId) || null,
    [pages, selectedPageId]
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, background: '#0f172a', display: 'flex', flexDirection: 'column' }}>

      {/* Preview topbar */}
      <div style={{ height: 48, flexShrink: 0, background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 }}>

        {/* Back */}
        <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid #475569', borderRadius: 7, color: '#94a3b8', padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
          ← Back to Builder
        </button>

        <div style={{ width: 1, height: 24, background: '#334155' }} />

        {/* Page tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, overflowX: 'auto' }}>
          {pages.length === 0 ? (
            <span style={{ fontSize: 11, color: '#64748b' }}>No pages created yet</span>
          ) : pages.map(p => (
            <button key={p.id} onClick={() => setSelectedPageId(p.id)}
              style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                background: selectedPageId === p.id ? '#6366f1' : 'transparent',
                color: selectedPageId === p.id ? '#fff' : '#94a3b8',
                transition: 'all 0.15s',
              }}>
              {p.name}
              <span style={{ marginLeft: 5, fontSize: 9, opacity: 0.7, fontFamily: 'monospace' }}>
                /{p.slug === '/' ? '' : p.slug}
              </span>
            </button>
          ))}
        </div>

        {/* Device toggle */}
        <div style={{ display: 'flex', gap: 4, background: '#0f172a', borderRadius: 8, padding: 3 }}>
          {[
            { label: '🖥', val: false, tip: 'Desktop' },
            { label: '📱', val: true,  tip: 'Mobile' },
          ].map(d => (
            <button key={d.tip} onClick={() => setIsMobile(d.val)} title={d.tip}
              style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: isMobile === d.val ? '#334155' : 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Active info */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ padding: '3px 10px', borderRadius: 5, fontSize: 9, fontWeight: 800, border: `1px solid ${activeHeader ? '#6366f1' : '#475569'}`, background: activeHeader ? '#6366f11a' : 'transparent', color: activeHeader ? '#818cf8' : '#64748b' }}>
            ⊤ {activeHeader ? activeHeader.name : 'No header'}
          </div>
          <div style={{ padding: '3px 10px', borderRadius: 5, fontSize: 9, fontWeight: 800, border: `1px solid ${activeFooter ? '#06b6d4' : '#475569'}`, background: activeFooter ? '#06b6d41a' : 'transparent', color: activeFooter ? '#22d3ee' : '#64748b' }}>
            ⊥ {activeFooter ? activeFooter.name : 'No footer'}
          </div>
        </div>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#374151', display: 'flex', justifyContent: 'center', padding: isMobile ? '20px 0' : 0 }}>
        <div style={{
          width: isMobile ? 390 : '100%',
          minHeight: '100%',
          background: '#ffffff',
          boxShadow: isMobile ? '0 0 0 1px #4b5563, 0 20px 60px rgba(0,0,0,0.5)' : 'none',
          borderRadius: isMobile ? 8 : 0,
          overflow: isMobile ? 'hidden' : 'visible',
        }}>

          {/* Active Header */}
          {activeHeader ? (
            <StructureRenderer
              data={activeHeader.headerData || { sections: [] }}
              mode="view"
              elementMap={headerCanvasConfig.elementMap}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '12px', background: '#fef9c3', borderBottom: '1px solid #fde68a' }}>
              <span style={{ fontSize: 11, color: '#92400e', fontWeight: 600 }}>⊤ No active header — set one in Global Settings</span>
            </div>
          )}

          {/* Page content */}
          {selectedPage ? (
            selectedPage.sections && selectedPage.sections.length > 0 ? (
              <StructureRenderer
                data={{ sections: selectedPage.sections }}
                mode="view"
                elementMap={pageCanvasConfig.elementMap}
              />
            ) : (
              <div style={{ padding: '80px 32px', textAlign: 'center', color: '#94a3b8', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ fontSize: 40 }}>📄</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>{selectedPage.name}</div>
                <div style={{ fontSize: 13 }}>This page has no content yet</div>
                <div style={{ fontSize: 11, color: '#cbd5e1' }}>Go back and add sections in the Page Builder</div>
              </div>
            )
          ) : (
            <div style={{ padding: '80px 32px', textAlign: 'center', color: '#94a3b8', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ fontSize: 40 }}>📝</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>No pages yet</div>
              <div style={{ fontSize: 13 }}>Create a page template to preview it here</div>
            </div>
          )}

          {/* Active Footer */}
          {activeFooter ? (
            <StructureRenderer
              data={activeFooter.footerData || { sections: [] }}
              mode="view"
              elementMap={footerCanvasConfig.elementMap}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '12px', background: '#fef9c3', borderTop: '1px solid #fde68a' }}>
              <span style={{ fontSize: 11, color: '#92400e', fontWeight: 600 }}>⊥ No active footer — set one in Global Settings</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}