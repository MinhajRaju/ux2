'use client';
/**
 * BuilderShell — Full-featured builder UI used by dynamic routes.
 * FIXED: Keyboard shortcuts, stable canvas layout, unsaved indicator,
 *        save feedback, mobile label, smart AddRow targeting.
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { Undo2, Redo2, Monitor, Smartphone, Save, Eye, ChevronLeft, CheckCircle2, MousePointer2 } from 'lucide-react';
import { T } from '@/constants/theme';
import { Canvas }     from '@/components/canvas/Canvas';
import { LeftPanel }  from '@/components/builder/panels/left/LeftPanel';
import { RightPanel } from '@/components/builder/panels/right/RightPanel';
import { StructureRenderer } from '@/components/shared/StructureRenderer';
import { useRouter } from 'next/navigation';

export function BuilderShell({ store, config, docType, docSlug, docTitle, sections: initialSections, onSave }) {
  const router = useRouter();

  const sections      = store(s => s.sections);
  const selectedId    = store(s => s.selectedId);
  const selectedMode  = store(s => s.selectedMode);
  const selectionMeta = store(s => s.selectionMeta);
  const loadData      = store(s => s.loadData);
  const setSelected   = store(s => s.setSelected);
  const clearSelected = store(s => s.clearSelected);
  const addSection    = store(s => s.addSection);
  const deleteSection = store(s => s.deleteSection);
  const deleteRow     = store(s => s.deleteRow);
  const reorderRows   = store(s => s.reorderRows);
  const reorderElements = store(s => s.reorderElements);
  const deleteElement = store(s => s.deleteElement);
  const openRowModal  = store(s => s.openRowModal);
  const clearNesting  = store(s => s.clearNesting);
  const deleteSubCol  = store(s => s.deleteSubCol);
  const undo          = store(s => s.undo);
  const redo          = store(s => s.redo);
  const past          = store(s => s.past);
  const future        = store(s => s.future);

  const [isMobile,  setIsMobile]  = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);
  const [saveOk,    setSaveOk]    = useState(false);
  const [preview,   setPreview]   = useState(false);
  const [isDirty,   setIsDirty]   = useState(false);
  const savedSectionsRef = useRef(null);

  // ── Load initial data ─────────────────────────────────────
  useEffect(() => {
    loadData({ sections: initialSections || [] });
    savedSectionsRef.current = JSON.stringify(initialSections || []);
    setIsDirty(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docType, docSlug]);

  // ── Track unsaved changes ─────────────────────────────────
  useEffect(() => {
    if (savedSectionsRef.current === null) return;
    setIsDirty(JSON.stringify(sections) !== savedSectionsRef.current);
  }, [sections]);

  // ── Warn before closing tab with unsaved changes ─────────
  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // ── Save handler ──────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onSave(sections);
      savedSectionsRef.current = JSON.stringify(sections);
      setIsDirty(false);
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2200);
    } finally {
      setTimeout(() => setIsSaving(false), 300);
    }
  }, [isSaving, onSave, sections]);

  // ── Keyboard shortcuts ────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' ||
        document.activeElement?.contentEditable === 'true';

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault(); undo(); return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault(); redo(); return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault(); handleSave(); return;
      }
      if (!isInput && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (selectedId && selectionMeta?.mode === 'element') {
          e.preventDefault();
          deleteElement(selectedId);
          clearSelected();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undo, redo, handleSave, selectedId, selectionMeta, deleteElement, clearSelected]);

  // ── Smart "Add Row": target selected/active section ──────
  const handleAddRowFromPanel = useCallback(() => {
    if (!sections.length) return;
    let targetSecId = null;

    if (selectedId && selectionMeta) {
      const walkCols = (cols) => {
        for (const col of cols || []) {
          if (col.id === selectedId) return true;
          if (walkCols(col.columns)) return true;
          for (const sr of col.subRows || []) {
            if (walkCols(sr.columns)) return true;
          }
          for (const el of col.elements || []) {
            if (el.id === selectedId) return true;
          }
        }
        return false;
      };
      for (const sec of sections) {
        if (sec.id === selectedId) { targetSecId = sec.id; break; }
        for (const row of sec.rows || []) {
          if (row.id === selectedId || walkCols(row.columns)) {
            targetSecId = sec.id; break;
          }
        }
        if (targetSecId) break;
      }
    }

    if (!targetSecId) targetSecId = sections[sections.length - 1].id;
    openRowModal(targetSecId);
  }, [sections, selectedId, selectionMeta, openRowModal]);

  const TYPE_BADGE = {
    header: { bg: '#eef2ff', color: '#6366f1', label: 'HEADER' },
    footer: { bg: '#ecfdf5', color: '#10b981', label: 'FOOTER' },
    page:   { bg: '#fdf2f8', color: '#9d174d', label: 'PAGE' },
  };
  const badge = TYPE_BADGE[docType] || TYPE_BADGE.page;
  const hasSelection = !!(selectedId && selectionMeta);

  if (preview) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <div style={{ background: '#0f172a', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Preview — {docTitle}</span>
          <button onClick={() => setPreview(false)} style={{ background: T.primary, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', cursor: 'pointer', fontSize: 12 }}>Back to Editor</button>
        </div>
        <StructureRenderer data={{ sections }} mode="view" elementMap={config.elementMap} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* ── Top bar ── */}
      <div style={{ height: 52, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', background: '#fff', padding: '0 16px', gap: 8, flexShrink: 0, zIndex: 50 }}>

        <button
          onClick={() => {
            if (isDirty && !window.confirm('You have unsaved changes. Leave anyway?')) return;
            router.push('/');
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '5px 8px', borderRadius: 6 }}
          onMouseEnter={e => { e.currentTarget.style.background = T.light; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <ChevronLeft size={15} /> Back
        </button>

        <div style={{ width: 1, height: 20, background: T.border, margin: '0 4px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.light, borderRadius: 8, padding: '5px 12px' }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: badge.bg, color: badge.color }}>{badge.label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{docTitle}</span>
          {docType === 'page' && docSlug && (
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{docSlug}</span>
          )}
        </div>

        {/* Unsaved changes badge */}
        {isDirty && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '3px 8px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#92400e' }}>Unsaved changes</span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Undo / Redo */}
        <div style={{ display: 'flex', gap: 2 }}>
          <TopBtn onClick={undo} disabled={!past?.length} title="Undo (Ctrl+Z)"><Undo2 size={15} /></TopBtn>
          <TopBtn onClick={redo} disabled={!future?.length} title="Redo (Ctrl+Shift+Z)"><Redo2 size={15} /></TopBtn>
        </div>

        <div style={{ width: 1, height: 20, background: T.border, margin: '0 4px' }} />

        {/* Desktop / Mobile toggle + label */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <div style={{ display: 'flex', background: T.light, borderRadius: 8, padding: 3, gap: 2 }}>
            <TopBtn active={!isMobile} onClick={() => setIsMobile(false)} title="Desktop view"><Monitor size={15} /></TopBtn>
            <TopBtn active={isMobile}  onClick={() => setIsMobile(true)}  title="Mobile width simulation (390px)"><Smartphone size={15} /></TopBtn>
          </div>
          {isMobile && (
            <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 500, lineHeight: 1 }}>390px simulation</span>
          )}
        </div>

        <div style={{ width: 1, height: 20, background: T.border, margin: '0 4px' }} />

        <button
          onClick={() => setPreview(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#334155', background: '#fff', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = '#334155'; }}
        >
          <Eye size={14} /> Preview
        </button>

        {/* Save button with success feedback */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, minWidth: 90,
            background: saveOk ? '#10b981' : T.primary, color: '#fff',
            border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12,
            fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.7 : 1,
            boxShadow: saveOk ? '0 2px 8px #10b98140' : `0 2px 8px ${T.primary}40`,
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
          title="Save (Ctrl+S)"
          onMouseEnter={e => { if (!isSaving && !saveOk) e.currentTarget.style.background = '#4f46e5'; }}
          onMouseLeave={e => { if (!saveOk) e.currentTarget.style.background = T.primary; }}
        >
          {saveOk
            ? <><CheckCircle2 size={14} /> Saved!</>
            : <><Save size={14} /> {isSaving ? 'Saving…' : 'Save'}</>
          }
        </button>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LeftPanel
          elementMap={config.elementMap}
          sections={sections}
          selectedId={selectedId}
          singleSection={config.singleSection}
          onSelectSection={(id) => setSelected(id, { mode: 'section' })}
          onSelectRow={(id) => setSelected(id, { mode: 'row' })}
          onSelectElem={(id, m) => setSelected(id, { ...m, mode: 'element' })}
          onSelectCol={(id, m) => setSelected(id, { ...m, mode: 'col' })}
          onSelectSubCol={(id, m) => setSelected(id, { ...m, mode: 'col' })}
          onSelectSubRow={(id, m) => setSelected(id, { ...m, mode: 'subrow' })}
          onAddSection={addSection}
          onAddRow={handleAddRowFromPanel}
          onDeleteSection={deleteSection}
          onDeleteRow={deleteRow}
          onDeleteElement={deleteElement}
          onReorderRows={reorderRows}
          onReorderElements={reorderElements}
          onClearNesting={clearNesting}
          onDeleteSubCol={deleteSubCol}
        />

        <Canvas store={store} config={config} isMobile={isMobile} />

        {/* Right panel wrapper — stable width, slides with CSS transition.
            No more canvas jumping when a selection is made/cleared. */}
        <div style={{
          width: hasSelection ? 300 : 52,
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          borderLeft: `1px solid ${T.border}`,
          background: '#fff',
        }}>
          {hasSelection ? (
            <RightPanel store={store} elementMap={config.elementMap} onClose={clearSelected} />
          ) : (
            /* Empty state hint */
            <div style={{
              width: 300, height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: '#fafafa',
              padding: '0 20px', textAlign: 'center', gap: 12,
              pointerEvents: 'none',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MousePointer2 size={20} style={{ color: '#94a3b8' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Nothing selected</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
                  Click any element, column, row, or section on the canvas to view and edit its properties.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

function TopBtn({ onClick, children, title, disabled, active }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{ width: 32, height: 32, border: 'none', background: active ? T.primary : 'transparent', color: active ? '#fff' : disabled ? '#cbd5e1' : '#64748b', borderRadius: 7, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
      onMouseEnter={e => { if (!disabled && !active) { e.currentTarget.style.background = T.light; e.currentTarget.style.color = '#334155'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = disabled ? '#cbd5e1' : '#64748b'; } }}
    >
      {children}
    </button>
  );
}
