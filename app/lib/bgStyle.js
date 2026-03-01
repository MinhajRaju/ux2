/**
 * bgStyle.js — Single source of truth for background CSS resolution.
 */

export function resolveBgStyle(s = {}, fallback = 'transparent') {
  if (s.bgType === 'gradient') {
    const from = s.gradientFrom || '#6366f1';
    const to   = s.gradientTo   || '#8b5cf6';
    const dir  = s.gradientDir  || '135deg';
    return {
      background: `linear-gradient(${dir}, ${from}, ${to})`,
    };
  }
  if (s.bgType === 'image' && s.bgImage) {
    return {
      backgroundImage:    `url(${s.bgImage})`,
      backgroundSize:     s.bgSize || 'cover',
      // support both bgPos (new) and bgPosition (old) field names
      backgroundPosition: s.bgPos || s.bgPosition || 'center',
      backgroundRepeat:   'no-repeat',
    };
  }
  if (s.bgType === 'none') return { background: 'transparent' };
  if (s.bg) return { background: s.bg };
  return { background: fallback };
}
