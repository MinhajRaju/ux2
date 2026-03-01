'use client';
/**
 * ResizableGrid — drag-to-resize column layout grid.
 *
 * Used by:
 *   CanvasRow    — top-level row columns (onResize → store.resizeColumns)
 *   CanvasColumn — nested sub-columns     (onResize → store.resizeSubCols)
 *
 * Props:
 *   columns      – array of column objects (used for keys + count)
 *   colWidths    – array of percentage widths (must sum to ~100)
 *   gap          – gap in px between columns
 *   onResize     – (containerId, newWidths[]) => void
 *   containerId  – id passed back to onResize (rowId or colId)
 *   children     – rendered column content (array)
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { T } from '../../constants/theme';

const MIN_COL_PCT = 8;

export function ResizableGrid({ columns, colWidths, gap, onResize, containerId, children }) {
  const containerRef = useRef(null);
  const widthsRef    = useRef(null);
  const count        = columns.length;

  const [widths,   setWidths]   = useState(() =>
    colWidths?.length === count ? colWidths : columns.map(() => 100 / count)
  );
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    const init = colWidths?.length === count ? colWidths : columns.map(() => 100 / count);
    setWidths(init);
    widthsRef.current = init;
  }, [count]);

  const startDrag = useCallback((e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(i);

    const cw = containerRef.current?.getBoundingClientRect().width || 1;
    const sx = e.clientX;
    const sw = [...(widthsRef.current || widths)];

    const onMove = (me) => {
      const delta = (me.clientX - sx) / cw * 100;
      const next  = [...sw];
      let l = sw[i] + delta;
      let r = sw[i + 1] - delta;
      if (l < MIN_COL_PCT) { r -= MIN_COL_PCT - l; l = MIN_COL_PCT; }
      if (r < MIN_COL_PCT) { l -= MIN_COL_PCT - r; r = MIN_COL_PCT; }
      next[i] = l;
      next[i + 1] = r;
      widthsRef.current = next;
      setWidths([...next]);
    };

    const onUp = () => {
      setDragging(null);
      if (onResize && widthsRef.current) onResize(containerId, [...widthsRef.current]);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
  }, [widths, onResize, containerId]);

  const cols = Array.isArray(children) ? children : [children];

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        gap,
        flex: 1,
        width: '100%',
        minWidth: 0,
        userSelect: dragging != null ? 'none' : 'auto',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {cols.map((child, i) => {
        const w = widths[i] ?? (100 / count);
        return (
          <div
            key={columns[i]?.id || i}
            style={{
              flex: w,
              minWidth: 0,
              position: 'relative',
              overflow: 'visible',
              transition: dragging == null ? 'flex 0.2s ease' : 'none',
            }}
          >
            {child}

            {/* Drag handle between columns */}
            {i < count - 1 && (
              <div
                onPointerDown={e => startDrag(e, i)}
                style={{
                  position: 'absolute', top: 0, bottom: 0,
                  right: -(gap / 2 + 6), width: 20,
                  cursor: 'col-resize', zIndex: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: dragging === i ? 1 : 0,
                  transition: 'opacity 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { if (dragging !== i) e.currentTarget.style.opacity = '0'; }}
              >
                {/* Width tooltip */}
                {dragging === i && (
                  <div style={{
                    position: 'absolute', top: -24,
                    left: '50%', transform: 'translateX(-50%)',
                    background: '#0f172a', color: '#fff',
                    borderRadius: 20, padding: '2px 8px',
                    fontSize: 10, fontWeight: 700,
                    pointerEvents: 'none', whiteSpace: 'nowrap',
                  }}>
                    {Math.round(w)}%
                  </div>
                )}
                <div style={{
                  width: 4, height: 32, borderRadius: 4,
                  background: dragging === i ? T.primary : '#94a3b8',
                  boxShadow: dragging === i ? `0 0 0 4px ${T.primary}30` : 'none',
                  transition: 'all 0.15s',
                }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
