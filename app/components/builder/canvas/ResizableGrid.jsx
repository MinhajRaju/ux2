// src/components/builder/canvas/ResizableGrid.jsx
'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Columns3 } from 'lucide-react';
import { T } from '@/constants/theme';

const MIN = 8;

export function ResizableGrid({ columns, gap, colWidths, onResize, rowId, selectedColId, children }) {
  const containerRef = useRef(null);
  const widthsRef = useRef(null);
  const count = columns.length;

  const [widths, setWidths] = useState(() => colWidths || columns.map(() => 100 / count));
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    const init = colWidths || columns.map(() => 100 / count);
    setWidths(init);
    widthsRef.current = init;
  }, [count, colWidths]);

  const startDrag = useCallback((e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(i);

    const containerWidth = containerRef.current?.getBoundingClientRect().width || 1;
    const startX = e.clientX;
    const startWidths = [...(widthsRef.current || widths)];

    const onMove = me => {
      const delta = (me.clientX - startX) / containerWidth * 100;
      const next = [...startWidths];
      let l = startWidths[i] + delta;
      let r = startWidths[i + 1] - delta;
      if (l < MIN) { r -= (MIN - l); l = MIN; }
      if (r < MIN) { l -= (MIN - r); r = MIN; }
      next[i] = l; next[i + 1] = r;
      widthsRef.current = next;
      setWidths([...next]);
    };

    const onUp = () => {
      setDragging(null);
      if (onResize && widthsRef.current) onResize(rowId, [...widthsRef.current]);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [widths, onResize, rowId]);

  const cols = Array.isArray(children) ? children : [children];

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', gap, position: 'relative', userSelect: dragging !== null ? 'none' : 'auto', flex: 1, minWidth: 0 }}
    >
      {cols.map((col, i) => {
        const isAdjacent = selectedColId && (columns[i]?.id === selectedColId || columns[i + 1]?.id === selectedColId);
        const w = widths[i] ?? 100 / count;

        return (
          <div
            key={columns[i]?.id || i}
            style={{
              flex: `${w} 1 0`, minWidth: 0, position: 'relative',
              transition: dragging === null ? 'flex 0.3s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            }}
          >
            {/* Width tooltip */}
            {dragging !== null && dragging === i && (
              <div style={{
                position: 'absolute', top: -35, right: -20, zIndex: 200,
                background: '#0f172a', color: '#fff', borderRadius: 20,
                padding: '4px 12px', fontSize: 11, fontWeight: 600,
                pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Columns3 size={12} /> {Math.round(w)}%
              </div>
            )}

            {col}

            {/* Resize handle */}
            {i < count - 1 && (
              <div
                onPointerDown={e => startDrag(e, i)}
                style={{
                  position: 'absolute', top: 0, bottom: 0,
                  right: -(gap / 2 + 6), width: 20,
                  cursor: 'col-resize', zIndex: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: (isAdjacent || dragging === i) ? 1 : 0,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
                onMouseLeave={e => { if (!dragging) e.currentTarget.style.opacity = (isAdjacent ? 1 : 0); }}
              >
                <div style={{
                  width: 4, height: 32, borderRadius: 4,
                  background: dragging === i ? T.primary : '#cbd5e1',
                  boxShadow: dragging === i ? `0 0 0 4px ${T.primary}30` : '0 0 0 1px #fff',
                  transition: 'all .2s',
                }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
