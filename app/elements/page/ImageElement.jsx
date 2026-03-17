'use client';
import Image from 'next/image';

function buildFilter(p) {
  if (!p.filter || p.filter === 'none') return undefined;
  const amt = p.filterAmount ?? 100;
  switch (p.filter) {
    case 'grayscale':  return `grayscale(${amt}%)`;
    case 'sepia':      return `sepia(${amt}%)`;
    case 'blur':       return `blur(${amt}px)`;
    case 'brightness': return `brightness(${amt}%)`;
    case 'contrast':   return `contrast(${amt}%)`;
    case 'saturate':   return `saturate(${amt}%)`;
    case 'invert':     return `invert(${amt}%)`;
    default:           return undefined;
  }
}

// Safely parse height — accepts number or numeric string, ignores 'auto'
function parseHeight(val, fallback = 300) {
  if (typeof val === 'number' && !isNaN(val)) return val;
  const n = parseInt(val, 10);
  return isNaN(n) ? fallback : n;
}

export default function ImageElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  const isExternal = p.src?.startsWith('http') || p.src?.startsWith('//');

  const wrapStyle = {
    paddingTop:    p.padTop    ? p.padTop    + 'px' : undefined,
    paddingRight:  p.padRight  ? p.padRight  + 'px' : undefined,
    paddingBottom: p.padBottom ? p.padBottom + 'px' : undefined,
    paddingLeft:   p.padLeft   ? p.padLeft   + 'px' : undefined,
    marginTop:    p.marginTop    ? p.marginTop    + 'px' : undefined,
    marginRight:  p.marginRight  ? p.marginRight  + 'px' : undefined,
    marginBottom: p.marginBottom ? p.marginBottom + 'px' : undefined,
    marginLeft:   p.marginLeft   ? p.marginLeft   + 'px' : undefined,
    cursor: mode === 'edit' ? 'pointer' : (p.linkEnabled ? 'pointer' : 'default'),
    outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none',
    outlineOffset: -2,
    borderRadius: (p.borderRadius ?? 8) + 'px',
    overflow: 'hidden',
    boxSizing: 'border-box',
    opacity: p.opacity != null && p.opacity !== 100 ? p.opacity / 100 : undefined,
    boxShadow: (p.shadow && p.shadow !== 'none') ? p.shadow : undefined,
    filter: buildFilter(p),
    mixBlendMode: (p.mixBlendMode && p.mixBlendMode !== 'normal') ? p.mixBlendMode : undefined,
    display: 'block',
  };

  const imgStyle = {
    objectFit: p.objectFit || 'cover',
    objectPosition: [p.objectPositionX || p.objectPosition || 'center', p.objectPosition || 'center'].join(' '),
    borderRadius: (p.borderRadius ?? 8) + 'px',
    display: 'block',
  };

  if (!p.src) {
    return (
      <div
        onClick={mode === 'edit' ? onSelect : undefined}
        style={{
          ...wrapStyle,
          width: p.width || '100%',
          height: parseHeight(p.height, 200) + 'px',
          background: '#f1f5f9',
          border: '2px dashed #cbd5e1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 8,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="#94a3b8" strokeWidth="1.5"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="#94a3b8"/>
          <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Add an image</span>
      </div>
    );
  }

  const Wrap = ({ children }) => {
    if (p.linkEnabled && p.linkHref && mode !== 'edit') {
      return (
        <a href={p.linkHref} target={p.linkTarget || '_self'} rel="noopener noreferrer"
          style={{ display: 'block', textDecoration: 'none' }}>
          {children}
        </a>
      );
    }
    return <>{children}</>;
  };

  if (p.layoutMode === 'fixed') {
    return (
      <Wrap>
        <div onClick={mode === 'edit' ? onSelect : undefined} style={{ ...wrapStyle, display: 'inline-block' }}>
          <Image
            src={p.src} alt={p.alt || ''}
            width={+(p.fixedWidth || 400)} height={+(p.fixedHeight || 300)}
            style={imgStyle}
            priority={p.priority || false}
            loading={p.priority ? undefined : (p.loading || 'lazy')}
            unoptimized={p.unoptimized || isExternal || false}
          />
        </div>
      </Wrap>
    );
  }

  const containerHeight = parseHeight(p.height, 300);

  return (
    <Wrap>
      <div
        onClick={mode === 'edit' ? onSelect : undefined}
        style={{
          ...wrapStyle,
          position: 'relative',
          width: p.layoutMode === 'fill' ? '100%' : (p.width || '100%'),
          height: containerHeight + 'px',
        }}
      >
        <Image
          src={p.src} alt={p.alt || ''}
          fill
          style={imgStyle}
          priority={p.priority || false}
          loading={p.priority ? undefined : (p.loading || 'lazy')}
          unoptimized={p.unoptimized || isExternal || false}
          sizes={p.layoutMode === 'fill' ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
        />
      </div>
    </Wrap>
  );
}
