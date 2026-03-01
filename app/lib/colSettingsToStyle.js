/**
 * colSettingsToStyle.js
 *
 * Single source of truth: converts col.settings → CSS style object.
 * Used by BOTH canvas (edit mode) and StructureRenderer (preview/view mode).
 */
import { resolveBgStyle } from './bgStyle';

const SHADOW_MAP = {
  none: 'none',
  sm:   '0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
  md:   '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
  lg:   '0 10px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
  xl:   '0 20px 40px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.08)',
};

/** @deprecated Use resolveBgStyle from lib/bgStyle directly */
export const colBgStyle = (s = {}) => resolveBgStyle(s, '');

/**
 * Full col.settings → CSS style.
 * @param {object} s - col.settings
 * @param {object} opts
 * @param {number}  opts.depth  - nesting depth (affects default padding)
 * @param {boolean} opts.isRow  - if true col is acting as a sub-row
 * @returns {object} CSS style object
 */
export function colSettingsToStyle(s = {}, { depth = 0, isRow = false } = {}) {
  // Padding
  const defaultPadV = Math.max(4, 8 - depth * 2);
  const defaultPadH = 12;
  const padTop    = s.padTop    ?? s.padV ?? defaultPadV;
  const padBottom = s.padBottom ?? s.padV ?? defaultPadV;
  const padLeft   = s.padLeft   ?? s.padH ?? defaultPadH;
  const padRight  = s.padRight  ?? s.padH ?? defaultPadH;

  // Margin
  const marginTop    = s.marginTop    ?? 0;
  const marginBottom = s.marginBottom ?? 0;
  const marginLeft   = s.marginLeft   ?? 0;
  const marginRight  = s.marginRight  ?? 0;

  // Border (full border from BorderEditor)
  const hasBorder = s.borderStyle && s.borderStyle !== 'none';
  const borderCSS = hasBorder
    ? { border: `${s.borderWidth || 1}px ${s.borderStyle} ${s.borderColor || '#e2e8f0'}` }
    : {};

  // Divider lines: vertical (right) and horizontal (bottom) — these override/add to border
  const borderRightCSS  = s.verticalLine
    ? { borderRight:  `${s.verticalLineWidth   || 1}px ${s.verticalLineStyle   || 'solid'} ${s.verticalLineColor   || '#e2e8f0'}` }
    : {};
  const borderBottomCSS = s.horizontalLine
    ? { borderBottom: `${s.horizontalLineWidth || 1}px ${s.horizontalLineStyle || 'solid'} ${s.horizontalLineColor || '#e2e8f0'}` }
    : {};

  // Border radius
  const radius = s.radius ?? 0;

  // Shadow
  const boxShadow = SHADOW_MAP[s.shadow] || (s.shadow === 'none' ? 'none' : (s.shadow || 'none'));

  // Opacity
  const opacity = s.opacity != null ? s.opacity / 100 : 1;

  // Min height
  const minHeight = s.minHeight ? (isNaN(s.minHeight) ? s.minHeight : `${s.minHeight}px`) : undefined;

  // Content offset (translateX/Y)
  const offsetX = s.offsetX ?? 0;
  const offsetY = s.offsetY ?? 0;
  const transform = (offsetX !== 0 || offsetY !== 0) ? `translate(${offsetX}px, ${offsetY}px)` : undefined;

  // Sticky
  const stickyCSS = s.sticky
    ? { position: 'sticky', top: `${s.stickyTop ?? 0}px`, zIndex: 10 }
    : {};

  // Overflow
  const overflow = s.overflow || 'hidden';

  return {
    paddingTop:    isRow ? `${Math.max(4, 8 - depth)}px` : `${padTop}px`,
    paddingBottom: isRow ? `${Math.max(4, 8 - depth)}px` : `${padBottom}px`,
    paddingLeft:   isRow ? `${Math.max(4, 8 - depth)}px` : `${padLeft}px`,
    paddingRight:  isRow ? `${Math.max(4, 8 - depth)}px` : `${padRight}px`,
    marginTop:    `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft:   `${marginLeft}px`,
    marginRight:  `${marginRight}px`,
    borderRadius: radius ? `${radius}px` : undefined,
    boxShadow,
    opacity,
    minHeight,
    transform,
    gap: isRow ? undefined : `${s.gap ?? 12}px`,
    maxWidth: '100%',
    boxSizing: 'border-box',
    overflow,
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    ...colBgStyle(s),
    ...borderCSS,
    ...borderRightCSS,
    ...borderBottomCSS,
    ...stickyCSS,
  };
}

/**
 * Returns animation data-attributes for entrance animations on columns.
 * Use as: <div {...colAnimAttrs(s)} style={colSettingsToStyle(s)}>
 */
export function colAnimAttrs(s = {}) {
  if (!s.animation || s.animation === 'none') return {};
  return {
    'data-anim':          s.animation,
    'data-anim-duration': s.animDuration ?? 600,
    'data-anim-delay':    s.animDelay    ?? 0,
    'data-anim-easing':   s.animEasing   || 'ease',
  };
}

/**
 * Returns inline style additions for parallax columns.
 * The actual scroll listener should be added in CanvasColumn / StructureRenderer.
 */
export function colParallaxAttrs(s = {}) {
  if (!s.parallax) return {};
  return {
    'data-parallax':       'true',
    'data-parallax-depth': s.parallaxDepth ?? 30,
  };
}
