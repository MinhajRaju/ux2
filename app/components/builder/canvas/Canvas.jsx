// src/components/builder/canvas/Canvas.jsx
'use client';
import { Plus } from 'lucide-react';
import { T } from '@/constants/theme';
import { SectionCanvas } from './SectionCanvas';
import { useBuilderStore } from '@/store/builderStore';

export function Canvas() {
  const {
    sections, selectedId, selectedMode,
    select, deselect,
    addSection, deleteSection, updateSection, moveSection,
    addRow, deleteRow, updateRow,
    addCol, deleteCol, resizeCols,
    updateCol,
    addElement, deleteElement, updateElement, moveElement, reorderElement,
  } = useBuilderStore();

  // Determine selected col id
  const selectedMeta = useBuilderStore(s => s.selectedMeta);
  const selectedColId = selectedMode === 'col' ? selectedId : null;
  const selectedElId  = selectedMode === 'element' ? selectedId : null;

  const handleDropNewType = (secId, rowId, colId, type) => {
    const elId = addElement(secId, rowId, colId, type);
    select(elId, 'element', { secId, rowId, colId });
  };

  return (
    <div
      onClick={() => deselect()}
      style={{
        flex: 1, overflowY: 'auto', background: T.bg,
        minHeight: '100%',
      }}
    >
      {/* Canvas inner */}
      <div style={{
        minHeight: '100vh',
        boxShadow: '0 0 0 1px #e2e8f0',
        background: '#fff',
        position: 'relative',
      }}>
        {sections.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: 400, gap: 16,
          }}>
            <div style={{ fontSize: 48 }}>🎨</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#334155' }}>Start Building</div>
            <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>Add your first section to begin</div>
            <button
              onClick={e => { e.stopPropagation(); addSection(); }}
              style={{
                background: T.primary, color: '#fff', border: 'none',
                borderRadius: 10, padding: '12px 28px', fontSize: 14,
                fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: `0 4px 14px ${T.primary}50`,
              }}
            >
              <Plus size={16} /> Add Section
            </button>
          </div>
        )}

        {sections.map((section, si) => (
          <SectionCanvas
            key={section.id}
            section={section}
            selectedId={selectedElId || (selectedMode === 'row' ? selectedId : null)}
            selectedColId={selectedColId}
            shadow={section.settings?.shadow || 0}
            onSelectEl={(elId, meta) => select(elId, 'element', meta)}
            onSelectCol={colId => colId
              ? select(colId, 'col', { secId: section.id, ...selectedMeta })
              : deselect()
            }
            onDropNewType={handleDropNewType}
            onMoveEl={moveElement}
            onReorderEl={reorderElement}
            onSectionSettings={() => select(section.id, 'section', { secId: section.id })}
            onDeleteSection={() => deleteSection(section.id)}
            onMoveSection={dir => moveSection(section.id, dir)}
            canMoveUp={si > 0}
            canMoveDown={si < sections.length - 1}
            onRowSettings={(secId, rowId) => select(rowId, 'row', { secId, rowId })}
            onDeleteRow={(secId, rowId) => deleteRow(secId, rowId)}
            onAddRow={secId => addRow(secId, 1)}
            onAddCol={(secId, rowId) => addCol(secId, rowId)}
            onDeleteCol={(secId, rowId) => deleteCol(secId, rowId)}
            onResize={(secId, rowId, widths) => resizeCols(secId, rowId, widths)}
          />
        ))}

        {sections.length > 0 && (
          <div
            onClick={e => { e.stopPropagation(); addSection(); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px', cursor: 'pointer',
            }}
          >
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                border: `2px dashed ${T.border}`,
                borderRadius: 12, padding: '10px 24px',
                color: '#94a3b8', fontSize: 13, fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; e.currentTarget.style.background = `${T.primary}06`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Plus size={16} /> Add Section
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
