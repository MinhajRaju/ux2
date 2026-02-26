'use client';
import { useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { Plus } from 'lucide-react';
import { T } from '../../constants/theme';
import { CanvasSection } from './CanvasSection';

export function Canvas({ store, config, isMobile }) {
  const sections = store(s => s.sections);
  const selectedId = store(s => s.selectedId);
  const selectedColId = store(s => s.selectionMeta?.colId || null);
  const setSelected = store(s => s.setSelected);
  const clearSelected = store(s => s.clearSelected);

  const addSection = store(s => s.addSection);
  const updateSection = store(s => s.updateSection);
  const deleteSection = store(s => s.deleteSection);
  const reorderSections = store(s => s.reorderSections);

  const addRow = store(s => s.addRow);
  const updateRow = store(s => s.updateRow);
  const deleteRow = store(s => s.deleteRow);
  const reorderRows = store(s => s.reorderRows);
  const resizeColumns = store(s => s.resizeColumns);

  const addColumn = store(s => s.addColumn);
  const deleteColumn = store(s => s.deleteColumn);

  const addElement = store(s => s.addElement);
  const moveElement = store(s => s.moveElement);
  const loadData = store(s => s.loadData);

  // Load default state if sections are empty
  useEffect(() => {
    if (sections.length === 0 && config.defaultState?.sections?.length > 0) {
      loadData(config.defaultState);
    }
  }, []);

  const handleSelectEl = (elId, meta) => setSelected(elId, { ...meta, mode: 'element' });
  const handleSelectCol = (colId) => {
    if (!colId) { clearSelected(); return; }
    setSelected(colId, { mode: 'col' });
  };
  const handleSelectSection = (secId) => setSelected(secId, { mode: 'section' });

  const handleAddRow = (secId, afterRowId) => addRow(secId);
  const handleDeleteLastCol = (secId, rowId) => {
    const sec = sections.find(s => s.id === secId);
    const row = sec?.rows.find(r => r.id === rowId);
    if (row?.columns?.length > 0) {
      deleteColumn(secId, rowId, row.columns[row.columns.length - 1].id);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        background: T.bg,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        minHeight: '100%',
      }}
      onClick={clearSelected}
    >
      <div style={{
        maxWidth: isMobile ? 390 : '100%',
        margin: '0 auto',
        minHeight: '100vh',
        background: '#fff',
        boxShadow: isMobile ? '0 0 0 1px #e2e8f0, 0 8px 32px rgba(0,0,0,0.1)' : 'none',
      }}>
        {sections.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '70vh', gap: 16,
          }}>
            <div style={{ fontSize: 48 }}>📐</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.textMid }}>Start Building</div>
            <div style={{ fontSize: 13, color: T.textLight }}>
              {config.singleSection ? 'Add a row to start' : 'Add a section to start building your page'}
            </div>
            {!config.singleSection && (
              <button
                onClick={addSection}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 24px', background: T.primary, color: '#fff',
                  border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', boxShadow: `0 4px 12px ${T.primary}40`,
                }}
              >
                <Plus size={16} /> Add Section
              </button>
            )}
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={sections}
            onReorder={config.singleSection ? undefined : reorderSections}
            style={{ listStyle: 'none', margin: 0, padding: 0 }}
          >
            {sections.map(section => (
              <Reorder.Item
                key={section.id}
                value={section}
                drag={!config.singleSection}
                style={{ listStyle: 'none' }}
              >
                <CanvasSection
                  section={section}
                  singleSection={config.singleSection}
                  selectedId={selectedId}
                  selectedColId={selectedColId}
                  elementMap={config.elementMap}
                  onSelectEl={handleSelectEl}
                  onSelectCol={handleSelectCol}
                  onSelectSection={() => handleSelectSection(section.id)}
                  onUpdateSection={(settings) => updateSection(section.id, settings)}
                  onDeleteSection={() => deleteSection(section.id)}
                  onAddRow={() => handleAddRow(section.id)}
                  onDeleteRow={(secId, rowId) => deleteRow(secId, rowId)}
                  onUpdateRow={updateRow}
                  onAddCol={(secId, rowId) => addColumn(secId, rowId)}
                  onDeleteCol={handleDeleteLastCol}
                  onResize={resizeColumns}
                  onReorderRows={reorderRows}
                  onAddElement={(secId, rowId, colId, type) => addElement(secId, rowId, colId, type, config.elementMap)}
                  onMoveEl={moveElement}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}

        {/* Add section button */}
        {!config.singleSection && sections.length > 0 && (
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={addSection}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 20px', fontSize: 12, fontWeight: 600,
                background: 'transparent', color: T.textLight,
                border: `2px dashed #cbd5e1`, borderRadius: 8, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = T.textLight; }}
            >
              <Plus size={14} /> Add Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
