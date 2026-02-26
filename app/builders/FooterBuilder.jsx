'use client';
import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Eye, Save, ArrowLeft } from 'lucide-react';
import { T } from '../constants/theme';
import { Canvas } from '../components/canvas/Canvas';
import { LeftPanel } from '../components/panels/LeftPanel';
import { RightPanel } from '../components/panels/RightPanel';
import { footerCanvasConfig } from '../configs/footerCanvasConfig';
import { useFooterStore } from '../store/useBuilderStore';
import { StructureRenderer } from '../components/shared/StructureRenderer';

// Default data for a brand-new footer template
export const DEFAULT_FOOTER_DATA = {
  sections: [{
    id: 'footer-section-1',
    type: 'section',
    settings: { label: 'Footer Section', bg: '#1e293b', visible: true, padV: 0, padH: 0 },
    rows: [],
  }],
};

export default function FooterBuilder({ templateName, initialData, onSave, onBack }) {
  const [isMobile, setIsMobile] = useState(false);
  const [preview,  setPreview]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  const sections      = useFooterStore(s => s.sections);
  const selectedId    = useFooterStore(s => s.selectedId);
  const selectionMeta = useFooterStore(s => s.selectionMeta);
  const setSelected   = useFooterStore(s => s.setSelected);
  const clearSelected = useFooterStore(s => s.clearSelected);
  const loadData      = useFooterStore(s => s.loadData);

  useEffect(() => {
    if (initialData) loadData(initialData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    if (!onSave) return;
    setSaving(true);
    onSave({ sections });
    setTimeout(() => setSaving(false), 800);
  };

  const handleBack = () => onBack ? onBack() : (window.location.href = '/builder');

  if (preview) {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f6fb' }}>
        <div style={{ background: '#0f172a', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Footer Preview — {templateName || 'Footer'}</span>
          <button onClick={() => setPreview(false)} style={{ background: T.primary, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', cursor: 'pointer', fontSize: 12 }}>Back to Editor</button>
        </div>
        <StructureRenderer data={{ sections }} mode="view" elementMap={footerCanvasConfig.elementMap} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: '#fff', borderBottom: `1px solid ${T.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: T.textLight, background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 5, background: '#ecfdf5', color: '#065f46', fontWeight: 800 }}>⊥ FOOTER</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{templateName || 'Footer Builder'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setIsMobile(false)} style={{ padding: '6px 10px', border: `1.5px solid ${!isMobile ? T.primary : T.border}`, borderRadius: 7, background: !isMobile ? `${T.primary}10` : '#fff', color: !isMobile ? T.primary : T.textLight, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Monitor size={15} /></button>
          <button onClick={() => setIsMobile(true)} style={{ padding: '6px 10px', border: `1.5px solid ${isMobile ? T.primary : T.border}`, borderRadius: 7, background: isMobile ? `${T.primary}10` : '#fff', color: isMobile ? T.primary : T.textLight, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Smartphone size={15} /></button>
          <button onClick={() => setPreview(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#f8fafc', color: T.textMid, border: `1.5px solid ${T.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><Eye size={14} /> Preview</button>
          {onSave && (
            <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: saving ? '#10b981' : T.primary, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'background 0.2s' }}>
              <Save size={14} /> {saving ? 'Saved!' : 'Save'}
            </button>
          )}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <LeftPanel elementMap={footerCanvasConfig.elementMap} sections={sections} selectedId={selectedId} onSelectSection={(id) => setSelected(id, { mode: 'section' })} onSelectElem={(id, meta) => setSelected(id, { ...meta, mode: 'element' })} onSelectCol={(id, meta) => setSelected(id, { ...meta, mode: 'col' })} singleSection={footerCanvasConfig.singleSection} />
        <Canvas store={useFooterStore} config={footerCanvasConfig} isMobile={isMobile} />
        {selectedId && selectionMeta && <RightPanel store={useFooterStore} elementMap={footerCanvasConfig.elementMap} onClose={clearSelected} />}
      </div>
    </div>
  );
}