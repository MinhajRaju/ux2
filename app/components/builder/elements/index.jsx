// src/components/builder/elements/index.jsx
'use client';
import { propsToStyle } from '@/lib/propsToStyle';
import { ShoppingCart, Heart, User, Search, Menu as MenuIcon } from 'lucide-react';

// ── Base wrapper ───────────────────────────────────────────────
function ElemWrap({ mode, isSelected, onSelect, children, style = {} }) {
  const editStyle = mode === 'edit' ? {
    cursor: 'pointer',
    outline: isSelected ? '2px solid #6366f1' : '1px solid transparent',
    outlineOffset: 2,
    borderRadius: 4,
    transition: 'outline 0.15s',
  } : {};
  return (
    <div
      onClick={mode === 'edit' ? onSelect : undefined}
      style={{ ...editStyle, ...style }}
    >
      {children}
    </div>
  );
}

// ── HEADING ────────────────────────────────────────────────────
export function HeadingElement({ props: p, mode = 'view', isSelected, onSelect }) {
  const s = propsToStyle(p);
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect}>
      <div style={{ ...s, wordBreak: 'break-word' }}>{p.content || 'Heading'}</div>
    </ElemWrap>
  );
}

// ── TEXT ───────────────────────────────────────────────────────
export function TextElement({ props: p, mode = 'view', isSelected, onSelect }) {
  const s = propsToStyle(p);
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect}>
      <p style={{ margin: 0, ...s }}>{p.content || 'Text block'}</p>
    </ElemWrap>
  );
}

// ── IMAGE ──────────────────────────────────────────────────────
export function ImageElement({ props: p, mode = 'view', isSelected, onSelect }) {
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.src || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image'}
        alt={p.alt || ''}
        style={{
          width: p.width || '100%',
          height: p.height || 'auto',
          maxWidth: '100%',
          borderRadius: p.borderRadius ? `${p.borderRadius}px` : 0,
          objectFit: p.objectFit || 'cover',
          display: 'block',
        }}
      />
    </ElemWrap>
  );
}

// ── BUTTON ─────────────────────────────────────────────────────
export function ButtonElement({ props: p, mode = 'view', isSelected, onSelect }) {
  const Tag = mode === 'view' ? 'a' : 'div';
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect} style={{ display: 'inline-block' }}>
      <Tag
        href={mode === 'view' ? (p.href || '#') : undefined}
        style={{
          display: 'inline-block',
          background: p.bg || '#6366f1',
          color: p.color || '#fff',
          fontSize: `${p.fontSize || 14}px`,
          fontWeight: p.fontWeight || '600',
          borderRadius: `${p.borderRadius || 8}px`,
          padding: `${p.padTop || 12}px ${p.padRight || 24}px ${p.padBottom || 12}px ${p.padLeft || 24}px`,
          textDecoration: 'none',
          cursor: mode === 'view' ? 'pointer' : 'default',
          border: p.borderStyle && p.borderStyle !== 'none'
            ? `${p.borderWidth || 1}px ${p.borderStyle} ${p.borderColor || '#6366f1'}`
            : 'none',
          transition: 'opacity 0.2s',
        }}
      >
        {p.label || 'Button'}
      </Tag>
    </ElemWrap>
  );
}

// ── VIDEO ──────────────────────────────────────────────────────
export function VideoElement({ props: p, mode = 'view', isSelected, onSelect }) {
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect}>
      {p.src ? (
        <video
          src={p.src}
          poster={p.poster}
          controls={p.controls !== false}
          style={{ width: p.width || '100%', borderRadius: `${p.borderRadius || 8}px`, display: 'block' }}
        />
      ) : (
        <div style={{
          width: '100%', aspectRatio: '16/9', background: '#0f172a',
          borderRadius: `${p.borderRadius || 8}px`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#64748b', fontSize: 32,
        }}>▶</div>
      )}
    </ElemWrap>
  );
}

// ── DIVIDER ────────────────────────────────────────────────────
export function DividerElement({ props: p, mode = 'view', isSelected, onSelect }) {
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect}
      style={{ paddingTop: `${p.marginTop || 16}px`, paddingBottom: `${p.marginBottom || 16}px` }}>
      <hr style={{
        border: 'none',
        borderTop: `${p.height || 1}px ${p.style || 'solid'} ${p.color || '#e2e8f0'}`,
        width: p.width || '100%',
        margin: 0,
      }} />
    </ElemWrap>
  );
}

// ── HTML ───────────────────────────────────────────────────────
export function HtmlElement({ props: p, mode = 'view', isSelected, onSelect }) {
  if (mode === 'view') {
    return <div dangerouslySetInnerHTML={{ __html: p.code || '' }} />;
  }
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect}>
      <div style={{
        background: '#f8fafc', border: '1px dashed #94a3b8',
        borderRadius: 6, padding: '8px 12px',
        fontFamily: 'monospace', fontSize: 12, color: '#64748b',
        minHeight: 40,
      }}>
        {'<HTML> ' + (p.code || '').slice(0, 40) + (p.code?.length > 40 ? '...' : '')}
      </div>
    </ElemWrap>
  );
}

// ── LOGO ───────────────────────────────────────────────────────
export function LogoElement({ props: p, mode = 'view', isSelected, onSelect }) {
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect} style={{ display: 'inline-block' }}>
      {p.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.src} alt="Logo" style={{ width: `${p.width || 120}px`, height: 'auto', display: 'block' }} />
      ) : (
        <span style={{
          fontSize: `${p.fontSize || 20}px`,
          fontWeight: p.fontWeight || '800',
          color: p.color || '#0f172a',
          letterSpacing: '-0.5px',
        }}>
          {p.text || 'Logo'}
        </span>
      )}
    </ElemWrap>
  );
}

// ── MENU ───────────────────────────────────────────────────────
export function MenuElement({ props: p, mode = 'view', isSelected, onSelect }) {
  const items = p.items || [];
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: `${p.gap || 24}px`, flexWrap: 'wrap' }}>
        {items.map(item => (
          <a
            key={item.id}
            href={mode === 'view' ? item.href : undefined}
            style={{
              fontSize: `${p.fontSize || 14}px`,
              fontWeight: p.fontWeight || '500',
              color: p.color || '#334155',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              cursor: mode === 'view' ? 'pointer' : 'default',
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </ElemWrap>
  );
}

// ── SEARCH BAR ─────────────────────────────────────────────────
export function SearchBarElement({ props: p, mode = 'view', isSelected, onSelect }) {
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: p.bg || '#f1f5f9',
        borderRadius: `${p.borderRadius || 8}px`,
        padding: '8px 14px',
        width: `${p.width || 200}px`,
        maxWidth: '100%',
      }}>
        <Search size={16} color={p.color || '#64748b'} />
        <span style={{ fontSize: 13, color: p.color || '#94a3b8' }}>{p.placeholder || 'Search...'}</span>
      </div>
    </ElemWrap>
  );
}

// ── CART ICON ──────────────────────────────────────────────────
export function CartIconElement({ props: p, mode = 'view', isSelected, onSelect }) {
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect} style={{ display: 'inline-block' }}>
      <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
        <ShoppingCart size={p.size || 22} color={p.color || '#334155'} />
        {p.showCount && (
          <span style={{
            position: 'absolute', top: -6, right: -6,
            background: '#6366f1', color: '#fff',
            fontSize: 9, fontWeight: 700, borderRadius: '50%',
            width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>0</span>
        )}
      </div>
    </ElemWrap>
  );
}

// ── WISHLIST ICON ─────────────────────────────────────────────
export function WishlistIconElement({ props: p, mode = 'view', isSelected, onSelect }) {
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect} style={{ display: 'inline-block' }}>
      <Heart size={p.size || 22} color={p.color || '#334155'} style={{ cursor: 'pointer' }} />
    </ElemWrap>
  );
}

// ── USER ICON ─────────────────────────────────────────────────
export function UserIconElement({ props: p, mode = 'view', isSelected, onSelect }) {
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect} style={{ display: 'inline-block' }}>
      <User size={p.size || 22} color={p.color || '#334155'} style={{ cursor: 'pointer' }} />
    </ElemWrap>
  );
}

// ── CATEGORIES ────────────────────────────────────────────────
export function CategoriesElement({ props: p, mode = 'view', isSelected, onSelect }) {
  return (
    <ElemWrap mode={mode} isSelected={isSelected} onSelect={onSelect} style={{ display: 'inline-block' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
        <MenuIcon size={16} color={p.color || '#334155'} />
        <span style={{ fontSize: `${p.fontSize || 14}px`, fontWeight: p.fontWeight || '500', color: p.color || '#334155' }}>
          {p.label || 'Categories'}
        </span>
      </div>
    </ElemWrap>
  );
}

// ── Element Map ────────────────────────────────────────────────
export const ELEMENT_MAP = {
  heading:       HeadingElement,
  text:          TextElement,
  image:         ImageElement,
  button:        ButtonElement,
  video:         VideoElement,
  divider:       DividerElement,
  html:          HtmlElement,
  logo:          LogoElement,
  menu:          MenuElement,
  'search-bar':  SearchBarElement,
  'cart-icon':   CartIconElement,
  'wishlist-icon':WishlistIconElement,
  'user-icon':   UserIconElement,
  categories:    CategoriesElement,
};
