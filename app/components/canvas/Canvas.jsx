'use client';
import { useEffect, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Plus } from 'lucide-react';
import { T } from '../../constants/theme';
import { CanvasSection } from './CanvasSection';
import { RowPresetsModal } from './RowPresetsModal';
import { ColPresetsModal } from './ColPresetsModal';
import { GridPresetsModal } from './GridPresetsModal';

// ── DraggableSection — Reorder.Item with grip handle for section reordering ──
function DraggableSection({ section, singleSection, isMobile, ...props }) {
  const dragControls = useDragControls();
  const [gripHovered, setGripHovered] = useState(false);

  return (
    <Reorder.Item
      value={section}
      dragControls={dragControls}
      dragListener={false}
      style={{ listStyle: 'none', position: 'relative' }}
    >
      {/* Section drag handle — left edge, only visible when not singleSection */}
      {!singleSection && (
        <div
          onPointerDown={e => { e.preventDefault(); dragControls.start(e); }}
          onMouseEnter={() => setGripHovered(true)}
          onMouseLeave={() => setGripHovered(false)}
          title="Drag to reorder section"
          style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            zIndex: 500, width: 18, height: 56,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'grab',
            background: gripHovered ? '#8b5cf6' : 'rgba(139,92,246,0.18)',
            borderRadius: '0 8px 8px 0',
            transition: 'background 0.15s',
            boxShadow: gripHovered ? '2px 0 10px rgba(139,92,246,0.35)' : 'none',
          }}
        >
          <svg width="6" height="16" viewBox="0 0 6 16" fill="none">
            <circle cx="1.5" cy="2"  r="1.5" fill={gripHovered ? '#fff' : '#8b5cf6'} />
            <circle cx="4.5" cy="2"  r="1.5" fill={gripHovered ? '#fff' : '#8b5cf6'} />
            <circle cx="1.5" cy="8"  r="1.5" fill={gripHovered ? '#fff' : '#8b5cf6'} />
            <circle cx="4.5" cy="8"  r="1.5" fill={gripHovered ? '#fff' : '#8b5cf6'} />
            <circle cx="1.5" cy="14" r="1.5" fill={gripHovered ? '#fff' : '#8b5cf6'} />
            <circle cx="4.5" cy="14" r="1.5" fill={gripHovered ? '#fff' : '#8b5cf6'} />
          </svg>
        </div>
      )}
      <CanvasSection
        section={section}
        singleSection={singleSection}
        isMobile={isMobile}
        {...props}
      />
    </Reorder.Item>
  );
}

export function Canvas({ store, config, isMobile }) {
  const sections = store(s => s.sections);
  const selectedId = store(s => s.selectedId);
  const selectedColId = store(s => s.selectionMeta?.colId || null);
  const setSelected = store(s => s.setSelected);
  const clearSelected = store(s => s.clearSelected);
  const selectionMeta = store(s => s.selectionMeta);

  const addSection    = store(s => s.addSection);
  const updateSection = store(s => s.updateSection);
  const deleteSection = store(s => s.deleteSection);
  const reorderSections = store(s => s.reorderSections);

  const addRow      = store(s => s.addRow);
  const updateRow   = store(s => s.updateRow);
  const deleteRow   = store(s => s.deleteRow);
  const reorderRows = store(s => s.reorderRows);
  const resizeColumns = store(s => s.resizeColumns);
  const openRowModal  = store(s => s.openRowModal);

  const addColumn   = store(s => s.addColumn);
  const deleteColumn = store(s => s.deleteColumn);

  const addElement  = store(s => s.addElement);
  const moveElement = store(s => s.moveElement);
  const reorderElements = store(s => s.reorderElements);
  const loadData    = store(s => s.loadData);

  const duplicateSection = store(s => s.duplicateSection);
  const duplicateRow     = store(s => s.duplicateRow);
  const duplicateElement = store(s => s.duplicateElement);
  const deleteElement    = store(s => s.deleteElement);

  // Grid ops
  const openGridModal       = store(s => s.openGridModal);
  const addGrid             = store(s => s.addGrid);
  const updateGrid          = store(s => s.updateGrid);
  const deleteGrid          = store(s => s.deleteGrid);
  const duplicateGrid       = store(s => s.duplicateGrid);
  const addGridCell         = store(s => s.addGridCell);
  const updateGridCell      = store(s => s.updateGridCell);
  const updateGridCellSpan  = store(s => s.updateGridCellSpan);
  const deleteGridCell      = store(s => s.deleteGridCell);
  const addElementToCell    = store(s => s.addElementToCell);

  // Nested column ops
  const openColModal          = store(s => s.openColModal);
  const addSubCols            = store(s => s.addSubCols);
  const deleteSubCol          = store(s => s.deleteSubCol);
  const updateColumn          = store(s => s.updateColumn);
  const updateSubColSettings  = store(s => s.updateSubColSettings);
  const clearNesting   = store(s => s.clearNesting);
  const resizeSubCols  = store(s => s.resizeSubCols);

  // Sub-row ops (vertical rows inside a column)
  const addSubRow        = store(s => s.addSubRow);
  const deleteSubRow     = store(s => s.deleteSubRow);
  const addSubRowCol     = store(s => s.addSubRowCol);
  const deleteSubRowCol  = store(s => s.deleteSubRowCol);
  const resizeSubRowCols = store(s => s.resizeSubRowCols);
  const clearSubRows     = store(s => s.clearSubRows);
  const updateSubRowSettings = store(s => s.updateSubRowSettings);

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

  const handleAddRow = (secId) => openRowModal(secId);
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
              <DraggableSection
                key={section.id}
                section={section}
                singleSection={config.singleSection}
                isMobile={isMobile}
                selectedId={selectedId}
                selectedColId={selectedColId}
                elementMap={config.elementMap}
                onSelectEl={handleSelectEl}
                onSelectCol={handleSelectCol}
                onSelectRow={(rowId) => setSelected(rowId, { mode: 'row' })}
                onSelectSection={() => handleSelectSection(section.id)}
                onUpdateSection={(settings) => updateSection(section.id, settings)}
                onDeleteSection={() => deleteSection(section.id)}
                onDuplicateSection={() => duplicateSection(section.id)}
                onAddRow={() => handleAddRow(section.id)}
                onDeleteRow={(secId, rowId) => deleteRow(secId, rowId)}
                onDuplicateRow={(secId, rowId) => duplicateRow(secId, rowId)}
                onUpdateRow={updateRow}
                onAddCol={(secId, rowId) => addColumn(secId, rowId)}
                onDeleteCol={handleDeleteLastCol}
                onResize={resizeColumns}
                onReorderRows={reorderRows}
                onAddElement={(secId, rowId, colId, type) => addElement(secId, rowId, colId, type, config.elementMap)}
                onMoveEl={moveElement}
                onReorderEl={reorderElements}
                onDuplicateEl={(secId, rowId, colId, elId) => duplicateElement(secId, rowId, colId, elId)}
                onDeleteEl={(elId) => deleteElement(elId)}
                // Grid wiring
                onAddGrid={() => openGridModal(section.id)}
                onSelectGrid={(gridId) => setSelected(gridId, { mode: 'grid', secId: section.id })}
                onUpdateGrid={(gridId, s) => updateGrid(gridId, s)}
                onDeleteGrid={(secId, gridId) => deleteGrid(secId, gridId)}
                onDuplicateGrid={(secId, gridId) => duplicateGrid(secId, gridId)}
                onSelectGridCell={(gridId, cellId) => setSelected(cellId, { mode: 'gridcell', gridId, secId: section.id })}
                onAddElementToCell={(secId, gridId, cellId, type) => addElementToCell(secId, gridId, cellId, type, config.elementMap)}
                onDeleteGridCell={(gridId, cellId) => deleteGridCell(gridId, cellId)}
                onAddGridCell={(gridId) => {
                  const grid = section.rows.find(r => r.id === gridId);
                  if (!grid) return;
                  const s = grid.settings || {};
                  const existingCells = grid.cells || [];
                  // Find a free slot
                  let freeCol = 1, freeRow = 1;
                  for (let r = 1; r <= (s.rows||2); r++) {
                    for (let c = 1; c <= (s.columns||3); c++) {
                      const occupied = existingCells.some(cell =>
                        c >= cell.colStart && c < cell.colEnd && r >= cell.rowStart && r < cell.rowEnd
                      );
                      if (!occupied) { freeCol = c; freeRow = r; break; }
                    }
                    if (freeCol !== 1 || freeRow !== 1) break;
                  }
                  addGridCell(gridId, { colStart: freeCol, colEnd: freeCol+1, rowStart: freeRow, rowEnd: freeRow+1 });
                }}
                onUpdateGridCellSpan={(gridId, cellId, span) => updateGridCellSpan(gridId, cellId, span)}
                selectedGridId={selectionMeta?.mode === 'grid' ? selectedId : (selectionMeta?.gridId || null)}
                selectedCellId={selectionMeta?.mode === 'gridcell' ? selectedId : null}
                onOpenColModal={openColModal}
                onDeleteSubCol={deleteSubCol}
                onClearNesting={clearNesting}
                onResizeSubCols={resizeSubCols}
                onUpdateCol={(secId, rowId, colId, settings) => updateColumn(secId, rowId, colId, settings)}
                onUpdateSubCol={(colId, settings) => updateSubColSettings(colId, settings)}
                onSelectSubCol={(id, meta) => setSelected(id, { ...meta, mode: 'col' })}
                onAddSubRow={addSubRow}
                onDeleteSubRow={deleteSubRow}
                onAddSubRowCol={addSubRowCol}
                onDeleteSubRowCol={deleteSubRowCol}
                onResizeSubRowCols={resizeSubRowCols}
                onClearSubRows={clearSubRows}
                onSelectSubRow={(id, meta) => setSelected(id, { ...meta, mode: 'subrow' })}
              />
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
      <RowPresetsModal store={store} />
      <ColPresetsModal store={store} addSubCols={addSubCols} />
      <GridPresetsModal store={store} />
    </div>
  );
}
