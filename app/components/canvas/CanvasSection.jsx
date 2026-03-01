'use client';
/**
 * CanvasSection.jsx
 * Renders a section on the canvas, reflecting ALL right-panel settings:
 *  background, overlay, padding, margin, minHeight, sticky, dark/light theme,
 *  mask shape, section angle, animation, custom CSS class, video background,
 *  shape dividers (top/bottom), scroll-for-more, loading-spinner.
 */
import { useState, useEffect, useRef } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Settings, Trash2, Plus, GripVertical, Copy } from 'lucide-react';
import { T } from '../../constants/theme';
import { resolveBgStyle } from '../../lib/bgStyle';
import { CanvasRow } from './CanvasRow';
import { CanvasGrid } from './CanvasGrid';

// ─── animation keyframes (injected once) ─────────────────────────────────────
const ANIM_CSS = `
@keyframes cs-fadeIn     { from { opacity:0 }                              to { opacity:1 } }
@keyframes cs-fadeUp     { from { opacity:0; transform:translateY(40px) }  to { opacity:1; transform:translateY(0) } }
@keyframes cs-fadeDown   { from { opacity:0; transform:translateY(-40px) } to { opacity:1; transform:translateY(0) } }
@keyframes cs-slideLeft  { from { opacity:0; transform:translateX(-60px) } to { opacity:1; transform:translateX(0) } }
@keyframes cs-slideRight { from { opacity:0; transform:translateX(60px) }  to { opacity:1; transform:translateX(0) } }
@keyframes cs-zoomIn     { from { opacity:0; transform:scale(0.85) }       to { opacity:1; transform:scale(1) } }
@keyframes cs-flipX      { from { opacity:0; transform:rotateX(90deg) }    to { opacity:1; transform:rotateX(0deg) } }
`;

let animInjected = false;
function ensureAnimCSS() {
  if (animInjected || typeof document === 'undefined') return;
  const tag = document.createElement('style');
  tag.textContent = ANIM_CSS;
  document.head.appendChild(tag);
  animInjected = true;
}

// ─── shape divider SVGs ───────────────────────────────────────────────────────
const DIVIDER_PATHS = {
  wave:   'M0,64 C150,140 350,-20 500,64 C650,140 850,-20 1000,64 L1000,0 L0,0 Z',
  curve:  'M0,0 C500,120 500,120 1000,0 L1000,0 L0,0 Z',
  tilt:   'M0,80 L1000,0 L1000,0 L0,0 Z',
  arrow:  'M500,80 L0,0 L1000,0 Z',
  zigzag: 'M0,0 L100,60 L200,0 L300,60 L400,0 L500,60 L600,0 L700,60 L800,0 L900,60 L1000,0 Z',
};

function ShapeDividerSVG({ shape, color, height, flip, position }) {
  if (!shape || shape === 'none' || !DIVIDER_PATHS[shape]) return null;
  const isBottom = position === 'bottom';
  return (
    <div style={{
      position: 'absolute',
      [isBottom ? 'bottom' : 'top']: 0,
      left: 0, right: 0, height,
      overflow: 'hidden', lineHeight: 0, zIndex: 2,
      transform: (flip ? 'scaleX(-1)' : '') + (isBottom ? ' scaleY(-1)' : ''),
      pointerEvents: 'none',
    }}>
      <svg viewBox="0 0 1000 80" preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '100%' }}>
        <path d={DIVIDER_PATHS[shape]} fill={color || '#ffffff'} />
      </svg>
    </div>
  );
}

// ─── video background ────────────────────────────────────────────────────────
function VideoBg({ s }) {
  if (!s.videoType || s.videoType === 'none' || !s.videoUrl) return null;

  if (s.videoType === 'mp4') {
    return (
      <video
        key={s.videoUrl}
        src={s.videoUrl}
        autoPlay
        muted={s.videoMuted !== false}
        loop={s.videoLoop !== false}
        playsInline
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0, pointerEvents: 'none',
        }}
      />
    );
  }

  if (s.videoType === 'youtube') {
    const match = s.videoUrl.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    const id = match?.[1];
    if (!id) return null;
    const params = `autoplay=1&mute=${s.videoMuted !== false ? 1 : 0}&loop=${s.videoLoop !== false ? 1 : 0}&playlist=${id}&controls=0&showinfo=0&rel=0&modestbranding=1`;
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?${params}`}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          border: 'none', zIndex: 0, pointerEvents: 'none',
        }}
        allow="autoplay"
        title="section-video"
      />
    );
  }
  return null;
}

// ─── custom CSS injector ─────────────────────────────────────────────────────
// Injects CSS as-is into a dedicated <style> tag scoped by section ID.
// User writes full CSS with selectors; we just inject it verbatim.
function useCustomCss(sectionId, className, css) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const id = `cs-custom-${sectionId}`;
    let tag = document.getElementById(id);
    if (!css || !className) {
      tag?.remove();
      return;
    }
    if (!tag) {
      tag = document.createElement('style');
      tag.id = id;
      document.head.appendChild(tag);
    }
    tag.textContent = css;
    return () => { document.getElementById(id)?.remove(); };
  }, [sectionId, className, css]);
}

// ─── main component ──────────────────────────────────────────────────────────

// ── DraggableRow — Reorder.Item with dragControls so ONLY the handle drags ───
// This prevents element drag-and-drop from triggering row reorder.
function DraggableRow({ row, section, i, selectedId, selectedColId, elementMap,
  onSelectEl, onSelectCol, onSelectRow, onAddRow, onDeleteRow, onAddCol,
  onDeleteCol, onUpdateRow, onResize, onAddElement, onMoveEl, onReorderEl,
  onDuplicateRow, onDuplicateEl, onDeleteEl,
  onOpenColModal, onDeleteSubCol, onClearNesting, onResizeSubCols, onSelectSubCol,
  onAddSubRow, onDeleteSubRow, onAddSubRowCol, onDeleteSubRowCol,
  onResizeSubRowCols, onClearSubRows, isMobile, onUpdateCol, onUpdateSubCol, onSelectSubRow }) {
  const dragControls = useDragControls();
  const [dragHovered, setDragHovered] = useState(false);

  return (
    <Reorder.Item
      value={row}
      dragControls={dragControls}
      dragListener={false}          /* ← key: only our handle pointer events start drag */
      style={{ listStyle: 'none', position: 'relative' }}
    >
      {/* Drag handle — left edge pill, only visible on hover */}
      <div
        onPointerDown={e => { e.preventDefault(); dragControls.start(e); }}
        onMouseEnter={() => setDragHovered(true)}
        onMouseLeave={() => setDragHovered(false)}
        title="Drag to reorder row"
        style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          zIndex: 200, width: 16, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'grab',
          background: dragHovered ? T.primary : 'rgba(99,102,241,0.18)',
          borderRadius: '0 6px 6px 0',
          transition: 'background 0.15s, width 0.15s',
          boxShadow: dragHovered ? '2px 0 8px rgba(99,102,241,0.3)' : 'none',
        }}
      >
        <svg width="6" height="14" viewBox="0 0 6 14" fill="none">
          <circle cx="1.5" cy="2"  r="1.5" fill={dragHovered ? '#fff' : T.primary} />
          <circle cx="4.5" cy="2"  r="1.5" fill={dragHovered ? '#fff' : T.primary} />
          <circle cx="1.5" cy="7"  r="1.5" fill={dragHovered ? '#fff' : T.primary} />
          <circle cx="4.5" cy="7"  r="1.5" fill={dragHovered ? '#fff' : T.primary} />
          <circle cx="1.5" cy="12" r="1.5" fill={dragHovered ? '#fff' : T.primary} />
          <circle cx="4.5" cy="12" r="1.5" fill={dragHovered ? '#fff' : T.primary} />
        </svg>
      </div>

      <CanvasRow
        row={row}
        secId={section.id}
        selectedId={selectedId}
        selectedColId={selectedColId}
        elementMap={elementMap}
        isMobile={isMobile}
        onSelectEl={onSelectEl}
        onSelectCol={onSelectCol}
        onSelectRow={() => onSelectRow?.(row.id)}
        onAddRow={() => onAddRow(section.id, row.id)}
        onDeleteRow={() => onDeleteRow(section.id, row.id)}
        onAddCol={() => onAddCol(section.id, row.id)}
        onDeleteCol={() => onDeleteCol(section.id, row.id)}
        onUpdateRow={(settings) => onUpdateRow(row.id, settings)}
        onDuplicateRow={() => onDuplicateRow?.(section.id, row.id)}
        onResize={onResize}
        onAddElement={onAddElement}
        onMoveEl={onMoveEl}
        onReorderEl={onReorderEl}
        onDuplicateEl={onDuplicateEl}
                  onDeleteEl={onDeleteEl}
        onOpenColModal={onOpenColModal}
        onDeleteSubCol={onDeleteSubCol}
        onClearNesting={onClearNesting}
        onResizeSubCols={onResizeSubCols}
        onSelectSubCol={onSelectSubCol}
        onAddSubRow={onAddSubRow}
        onDeleteSubRow={onDeleteSubRow}
        onAddSubRowCol={onAddSubRowCol}
        onDeleteSubRowCol={onDeleteSubRowCol}
        onResizeSubRowCols={onResizeSubRowCols}
        onClearSubRows={onClearSubRows}
        isFirst={i === 0}
        onUpdateCol={onUpdateCol}
        onUpdateSubCol={onUpdateSubCol}
        onSelectSubRow={onSelectSubRow}
      />
    </Reorder.Item>
  );
}

export function CanvasSection({
  section, singleSection, isMobile, selectedId, selectedColId, elementMap,
  onSelectEl, onSelectCol, onSelectSection, onSelectRow,
  onUpdateSection, onDeleteSection, onAddRow, onDeleteRow, onUpdateRow,
  onAddCol, onDeleteCol, onResize, onReorderRows, onAddElement,
  onMoveEl, onReorderEl, onDuplicateEl, onDeleteEl, onOpenColModal, onDeleteSubCol, onClearNesting,
  onResizeSubCols, onSelectSubCol, onAddSubRow, onDeleteSubRow,
  onAddSubRowCol, onDeleteSubRowCol, onResizeSubRowCols, onClearSubRows,
  onDuplicateSection, onDuplicateRow, onUpdateCol, onUpdateSubCol, onSelectSubRow,
  // Grid props
  onAddGrid, onSelectGrid, onUpdateGrid, onDeleteGrid, onDuplicateGrid,
  onSelectGridCell, onAddElementToCell, onDeleteGridCell, onAddGridCell,
  onUpdateGridCellSpan,
  selectedGridId, selectedCellId,
}) {
  const [hovered, setHovered] = useState(false);
  const s = section.settings || {};

  ensureAnimCSS();

  // ── custom CSS injection ──
  useCustomCss(section.id, s.customClass, s.customCss);

  // ── resolve padding (new: padTop/padRight/padBottom/padLeft, fallback to padV/padH) ──
  const pt = s.padTop    ?? s.padV ?? 0;
  const pb = s.padBottom ?? s.padV ?? 0;
  const pl = s.padLeft   ?? s.padH ?? 0;
  const pr = s.padRight  ?? s.padH ?? 0;

  // ── resolve margin ──
  const mt = +(s.marginTop    ?? 0);
  const mb = +(s.marginBottom ?? 0);
  const ml = +(s.marginLeft   ?? 0);
  const mr = +(s.marginRight  ?? 0);

  // ── animation ──
  const animName = s.animation && s.animation !== 'none' ? `cs-${s.animation}` : undefined;
  const animStyle = animName ? {
    animation: `${animName} ${s.animDuration ?? 600}ms ${s.animEasing || 'ease'} ${s.animDelay ?? 0}ms both`,
  } : {};

  // ── dark theme ──
  const themeStyle = s.theme === 'dark'
    ? { color: '#f1f5f9' }
    : {};

  // ── sticky ──
  const stickyStyle = s.sticky ? { position: 'sticky', top: 0, zIndex: 50 } : {};

  // ── section angle (clip-path) ──
  const angleClip = {
    'angle-left':  'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
    'angle-right': 'polygon(0 0, 100% 0, 100% 100%, 0 85%)',
    'angle-both':  'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
  }[s.sectionAngle] || undefined;

  // ── mask shape ──
  const maskClip = {
    circle:  'circle(50% at 50% 50%)',
    ellipse: 'ellipse(60% 50% at 50% 50%)',
    arrow:   'polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)',
  }[s.maskShape] || undefined;

  const clipPath = maskClip || angleClip || undefined;

  const sectionStyle = {
    position: 'relative',
    ...resolveBgStyle(s, '#ffffff'),
    paddingTop:    `${pt}px`,
    paddingBottom: `${pb}px`,
    paddingLeft:   `${pl}px`,
    paddingRight:  `${pr}px`,
    marginTop:     mt ? `${mt}px` : undefined,
    marginBottom:  mb ? `${mb}px` : 2,
    marginLeft:    ml ? `${ml}px` : undefined,
    marginRight:   mr ? `${mr}px` : undefined,
    minHeight: s.minHeight ? `${s.minHeight}px` : undefined,
    borderRadius: s.radius ? `${s.radius}px` : undefined,
    border: s.borderStyle && s.borderStyle !== 'none'
      ? `${s.borderWidth || 1}px ${s.borderStyle} ${s.borderColor || '#E2E8F0'}`
      : undefined,
    clipPath,
    overflow: clipPath ? 'hidden' : 'visible',
    transition: 'box-shadow 0.2s',
    boxShadow: hovered ? '0 0 0 2px #8B5CF6' : 'none',
    ...themeStyle,
    ...stickyStyle,
    ...animStyle,
  };

  // apply custom class to the element
  const extraClass = s.customClass || '';

  // inner container style (boxed mode)
  const innerStyle = s.containerMode === 'boxed'
    ? { maxWidth: `${s.containerMaxWidth || 1280}px`, margin: '0 auto', width: '100%' }
    : {};

  const hasOverlay = s.overlayOn && (s.bgType === 'image' || s.bgType === 'gradient');

  return (
    <div
      className={extraClass || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelectSection(); }}
      style={sectionStyle}
    >
      {/* ── Video background ── */}
      <VideoBg s={s} />

      {/* ── Overlay ── */}
      {hasOverlay && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: s.overlayColor || 'rgba(0,0,0,0.4)',
          opacity: (s.overlayOpacity ?? 40) / 100,
          zIndex: 1,
        }} />
      )}

      {/* ── Top shape divider ── */}
      <ShapeDividerSVG
        shape={s.dividerTopShape}
        color={s.dividerTopColor}
        height={s.dividerTopHeight ?? 60}
        flip={s.dividerTopFlip}
        position="top"
      />

      {/* ── Bottom shape divider ── */}
      <ShapeDividerSVG
        shape={s.dividerBottomShape}
        color={s.dividerBottomColor}
        height={s.dividerBottomHeight ?? 60}
        flip={s.dividerBottomFlip}
        position="bottom"
      />

      {/* ── Section toolbar ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 3, padding: '5px 8px',
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
        borderRadius: '0 0 10px 0', border: '1px solid rgba(226,232,240,0.6)',
        opacity: hovered ? 1 : 0, pointerEvents: hovered ? 'auto' : 'none',
        transition: 'opacity 0.2s',
      }}>
        <span
          onClick={(e) => { e.stopPropagation(); onSelectSection(); }}
          title="Select Section"
          style={{
            fontSize: 10, fontWeight: 700, color: '#8b5cf6', paddingRight: 8,
            borderRight: '1px solid #e2e8f0', marginRight: 2, textTransform: 'uppercase',
            letterSpacing: '0.05em', userSelect: 'none', cursor: 'pointer',
          }}
        >
          {s.label || 'Section'}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onAddRow(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
            fontSize: 11, fontWeight: 600, background: T.primary, color: '#fff',
            border: 'none', borderRadius: 6, cursor: 'pointer',
          }}
        >
          <Plus size={12} /> Add Row
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAddGrid?.(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
            fontSize: 11, fontWeight: 600, background: '#6366f1', color: '#fff',
            border: 'none', borderRadius: 6, cursor: 'pointer',
          }}
        >
          ⊞ Grid
        </button>
        {!singleSection && (
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicateSection?.(); }}
            title="Duplicate Section"
            style={{
              width: 26, height: 26, display: 'flex', alignItems: 'center',
              justifyContent: 'center', border: 'none', background: '#f0fdf4',
              color: '#10b981', borderRadius: 6, cursor: 'pointer',
            }}
          >
            <Copy size={13} />
          </button>
        )}
        {!singleSection && (
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteSection(); }}
            style={{
              width: 26, height: 26, display: 'flex', alignItems: 'center',
              justifyContent: 'center', border: 'none', background: '#fff1f2',
              color: '#ef4444', borderRadius: 6, cursor: 'pointer',
            }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* ── Inner content ── */}
      <div style={{ position: 'relative', zIndex: 3, ...innerStyle }}>
        {section.rows.length === 0 ? (
          <div
            onClick={(e) => { e.stopPropagation(); onAddRow(); }}
            style={{
              margin: '12px 16px', padding: '24px 16px',
              border: '2px dashed #cbd5e1', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(248,250,252,0.8)', cursor: 'pointer',
              gap: 8, color: '#94a3b8', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <Plus size={18} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Add First Row</span>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={section.rows}
            onReorder={(newRows) => onReorderRows(section.id, newRows)}
            style={{ listStyle: 'none', margin: 0, padding: 0 }}
          >
            {section.rows.map((row, i) => {
              if (row.type === 'grid') {
                return (
                  <Reorder.Item
                    key={row.id}
                    value={row}
                    style={{ listStyle: 'none' }}
                  >
                    <CanvasGrid
                      grid={row}
                      secId={section.id}
                      isMobile={isMobile}
                      selectedId={selectedId}
                      selectedCellId={selectedCellId}
                      elementMap={elementMap}
                      onSelectGrid={() => onSelectGrid?.(row.id)}
                      onSelectCell={(cellId) => onSelectGridCell?.(row.id, cellId)}
                      onSelectEl={onSelectEl}
                      onUpdateGrid={(s) => onUpdateGrid?.(row.id, s)}
                      onDeleteGrid={() => onDeleteGrid?.(section.id, row.id)}
                      onDuplicateGrid={() => onDuplicateGrid?.(section.id, row.id)}
                      onAddElementToCell={onAddElementToCell}
                      onDeleteElement={onDeleteEl}
                      onDeleteCell={(cellId) => onDeleteGridCell?.(row.id, cellId)}
                      onAddCell={() => onAddGridCell?.(row.id)}
                      onUpdateGridCellSpan={onUpdateGridCellSpan}
                    />
                  </Reorder.Item>
                );
              }
              return (
              <DraggableRow
                key={row.id}
                row={row}
                section={section}
                i={i}
                selectedId={selectedId}
                selectedColId={selectedColId}
                elementMap={elementMap}
                onSelectEl={onSelectEl}
                onSelectCol={onSelectCol}
                onSelectRow={onSelectRow}
                onAddRow={onAddRow}
                onDeleteRow={onDeleteRow}
                onAddCol={onAddCol}
                onDeleteCol={onDeleteCol}
                onUpdateRow={onUpdateRow}
                onResize={onResize}
                onAddElement={onAddElement}
                onMoveEl={onMoveEl}
                onReorderEl={onReorderEl}
                onDuplicateRow={onDuplicateRow}
                onDuplicateEl={onDuplicateEl}
                  onDeleteEl={onDeleteEl}
                onOpenColModal={onOpenColModal}
                onDeleteSubCol={onDeleteSubCol}
                onClearNesting={onClearNesting}
                onResizeSubCols={onResizeSubCols}
                onSelectSubCol={onSelectSubCol}
                onAddSubRow={onAddSubRow}
                onDeleteSubRow={onDeleteSubRow}
                onAddSubRowCol={onAddSubRowCol}
                onDeleteSubRowCol={onDeleteSubRowCol}
                onResizeSubRowCols={onResizeSubRowCols}
                onClearSubRows={onClearSubRows}
                isMobile={isMobile}
                onUpdateCol={onUpdateCol}
                onUpdateSubCol={onUpdateSubCol}
                onSelectSubRow={onSelectSubRow}
              />
              );
            })}
          </Reorder.Group>
        )}
      </div>

      {s.scrollForMore && (
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: s.theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)',
          fontSize: 11, fontWeight: 600, zIndex: 10, pointerEvents: 'none',
          animation: 'cs-fadeUp 1s ease infinite alternate',
        }}>
          <span>↓</span>
          <span>Scroll</span>
        </div>
      )}

      {/* ── Loading spinner ── */}
      {s.loadingSpinner && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.6)', zIndex: 20, pointerEvents: 'none',
        }}>
          <div style={{
            width: 32, height: 32, border: `3px solid ${T.border}`,
            borderTopColor: T.primary, borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}
