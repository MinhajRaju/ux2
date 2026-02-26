'use client';
import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Eye, Plus, ChevronDown, Save, ArrowLeft } from 'lucide-react';
import { T } from '../constants/theme';
import { Canvas } from '../components/canvas/Canvas';
import { LeftPanel } from '../components/panels/LeftPanel';
import { RightPanel } from '../components/panels/RightPanel';
import { pageCanvasConfig } from '../configs/pageCanvasConfig';
import { usePageStore } from '../store/useBuilderStore';
import { StructureRenderer } from '../components/shared/StructureRenderer';
import { useHeaderStore, useFooterStore } from '../store/useBuilderStore';
import { headerCanvasConfig } from '../configs/headerCanvasConfig';
import { footerCanvasConfig } from '../configs/footerCanvasConfig';

export default function PageBuilder({
  slug = '/',
  templateName,
  initialSections,
  onSave,
  onBack,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [preview,  setPreview]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  const sections      = usePageStore(s => s.sections);
  const selectedId    = usePageStore(s => s.selectedId);
  const selectionMeta = usePageStore(s => s.selectionMeta);
  const clearSelected = usePageStore(s => s.clearSelected);
  const setSelected   = usePageStore(s => s.setSelected);
  const addSection    = usePageStore(s => s.addSection);
  const loadData      = usePageStore(s => s.loadData);

  const headerSections = useHeaderStore(s => s.sections);
  const footerSections = useFooterStore(s => s.sections);

  useEffect(() => {
    if (initialSections !== undefined) {
      loadData({ sections: initialSections });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    if (!onSave) return;
    setSaving(true);
    onSave(sections);
    setTimeout(() => setSaving(false), 800);
  };

  const handleBack = () => onBack ? onBack() : (window.location.href = '/builder');

  if (preview) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <div style={{ background: '#0f172a', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Page Preview — {templateName || slug}</span>
          <button onClick={() => setPreview(false)} style={{ background: T.primary, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', cursor: 'pointer', fontSize: 12 }}>Back to Editor</button>
        </div>
        <StructureRenderer data={{ sections: headerSections }} mode="view" elementMap={headerCanvasConfig.elementMap} />
        <StructureRenderer data={{ sections }} mode="view" elementMap={pageCanvasConfig.elementMap} />
        <StructureRenderer data={{ sections: footerSections }} mode="view" elementMap={footerCanvasConfig.elementMap} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: '#fff', borderBottom: `1px solid ${T.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: T.textLight, background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 5, background: '#fdf2f8', color: '#9d174d', fontWeight: 800 }}>▣ PAGE</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{templateName || 'Page Builder'}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#f1f5f9', borderRadius: 7, fontSize: 12, color: T.textMid, fontWeight: 500 }}>
            {slug} <ChevronDown size={12} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setIsMobile(false)} style={{ padding: '6px 10px', border: `1.5px solid ${!isMobile ? T.primary : T.border}`, borderRadius: 7, background: !isMobile ? `${T.primary}10` : '#fff', color: !isMobile ? T.primary : T.textLight, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Monitor size={15} /></button>
          <button onClick={() => setIsMobile(true)} style={{ padding: '6px 10px', border: `1.5px solid ${isMobile ? T.primary : T.border}`, borderRadius: 7, background: isMobile ? `${T.primary}10` : '#fff', color: isMobile ? T.primary : T.textLight, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Smartphone size={15} /></button>
          <button onClick={addSection} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#f8fafc', color: T.textMid, border: `1.5px solid ${T.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            <Plus size={14} /> Add Section
          </button>
          <button onClick={() => setPreview(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#f8fafc', color: T.textMid, border: `1.5px solid ${T.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            <Eye size={14} /> Preview
          </button>
          {onSave && (
            <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: saving ? '#10b981' : T.primary, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'background 0.2s' }}>
              <Save size={14} /> {saving ? 'Saved!' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftPanel
          elementMap={pageCanvasConfig.elementMap}
          sections={sections}
          selectedId={selectedId}
          onSelectSection={(id) => setSelected(id, { mode: 'section' })}
          onSelectElem={(id, meta) => setSelected(id, { ...meta, mode: 'element' })}
          onSelectCol={(id, meta) => setSelected(id, { ...meta, mode: 'col' })}
          onAddSection={addSection}
          singleSection={pageCanvasConfig.singleSection}
        />
        <Canvas store={usePageStore} config={pageCanvasConfig} isMobile={isMobile} />
        {selectedId && selectionMeta && (
          <RightPanel store={usePageStore} elementMap={pageCanvasConfig.elementMap} onClose={clearSelected} />
        )}
      </div>
    </div>
  );
}