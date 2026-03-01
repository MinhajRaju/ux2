'use client';
/**
 * TemplateBuilder — Generic builder for Header and Footer templates.
 * Replaces the old HeaderBuilder.jsx and FooterBuilder.jsx (which were 95% identical).
 *
 * Usage:
 *   <TemplateBuilder type="header" store={useHeaderStore} config={headerCanvasConfig} />
 *   <TemplateBuilder type="footer" store={useFooterStore} config={footerCanvasConfig} />
 */
import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Eye, Save, ArrowLeft } from 'lucide-react';
import { T } from '../constants/theme';
import { Canvas }     from '../components/canvas/Canvas';
import { LeftPanel }  from '../components/builder/panels/left/LeftPanel';
import { RightPanel } from '../components/builder/panels/right/RightPanel';
import { StructureRenderer } from '../components/shared/StructureRenderer';

const TYPE_META = {
  header: { label: 'HEADER', badge: '#eef2ff', color: '#6366f1', emoji: '▤' },
  footer: { label: 'FOOTER', badge: '#ecfdf5', color: '#10b981', emoji: '▥' },
};

export default function TemplateBuilder({
  type = 'header',
  store,
  config,
  templateName,
  initialData,
  onSave,
  onBack,
}) {
  const meta = TYPE_META[type] || TYPE_META.header;

  const [isMobile, setIsMobile] = useState(false);
  const [preview,  setPreview]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  const sections      = store(s => s.sections);
  const selectedId    = store(s => s.selectedId);
  const selectionMeta = store(s => s.selectionMeta);
  const loadData      = store(s => s.loadData);
  const clearSelected = store(s => s.clearSelected);
  const setSelected   = store(s => s.setSelected);
  const addSection    = store(s => s.addSection);
  const deleteSection = store(s => s.deleteSection);
  const deleteRow     = store(s => s.deleteRow);
  const deleteElement = store(s => s.deleteElement);
  const openRowModal  = store(s => s.openRowModal);
  const clearNesting  = store(s => s.clearNesting);
  const deleteSubCol  = store(s => s.deleteSubCol);

  useEffect(() => {
    if (initialData?.sections) {
      loadData(initialData);
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
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Preview — {templateName || type}</span>
          <button onClick={() => setPreview(false)} style={{ background: T.primary, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', cursor: 'pointer', fontSize: 12 }}>Back to Editor</button>
        </div>
        <StructureRenderer data={{ sections }} mode="view" elementMap={config.elementMap} />
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
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 5, background: meta.badge, color: meta.color, fontWeight: 800 }}>{meta.emoji} {meta.label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{templateName || `${type} Builder`}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setIsMobile(false)} style={{ padding: '6px 10px', border: `1.5px solid ${!isMobile ? T.primary : T.border}`, borderRadius: 7, background: !isMobile ? `${T.primary}10` : '#fff', color: !isMobile ? T.primary : T.textLight, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Monitor size={15} /></button>
          <button onClick={() => setIsMobile(true)}  style={{ padding: '6px 10px', border: `1.5px solid ${isMobile  ? T.primary : T.border}`, borderRadius: 7, background: isMobile  ? `${T.primary}10` : '#fff', color: isMobile  ? T.primary : T.textLight, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Smartphone size={15} /></button>
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
          elementMap={config.elementMap}
          sections={sections}
          selectedId={selectedId}
          singleSection={config.singleSection}
          onSelectSection={(id) => setSelected(id, { mode: 'section' })}
          onSelectRow={(id) => setSelected(id, { mode: 'row' })}
          onSelectElem={(id, meta) => setSelected(id, { ...meta, mode: 'element' })}
          onSelectCol={(id, m) => setSelected(id, { ...m, mode: 'col' })}
          onSelectSubCol={(id, m) => setSelected(id, { ...m, mode: 'col' })}
          onAddSection={addSection}
          onAddRow={() => { const last = sections[sections.length - 1]; if (last) openRowModal(last.id); }}
          onDeleteSection={deleteSection}
          onDeleteRow={deleteRow}
          onDeleteElement={deleteElement}
          onClearNesting={clearNesting}
          onDeleteSubCol={deleteSubCol}
        />
        <Canvas store={store} config={config} isMobile={isMobile} />
        {selectedId && selectionMeta && (
          <RightPanel store={store} elementMap={config.elementMap} onClose={clearSelected} />
        )}
      </div>
    </div>
  );
}
