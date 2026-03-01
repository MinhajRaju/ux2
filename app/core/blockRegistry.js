// src/core/blockRegistry.js

export const ELEMENT_TYPES = [
  { type: 'heading',       label: 'Heading',      color: '#8b5cf6', group: 'content' },
  { type: 'text',          label: 'Text',         color: '#0ea5e9', group: 'content' },
  { type: 'image',         label: 'Image',        color: '#10b981', group: 'content' },
  { type: 'button',        label: 'Button',       color: '#f59e0b', group: 'content' },
  { type: 'video',         label: 'Video',        color: '#ef4444', group: 'content' },
  { type: 'divider',       label: 'Divider',      color: '#94a3b8', group: 'content' },
  { type: 'html',          label: 'HTML',         color: '#6366f1', group: 'content' },
  { type: 'logo',          label: 'Logo',         color: '#6366f1', group: 'ecommerce' },
  { type: 'menu',          label: 'Nav Menu',     color: '#6366f1', group: 'ecommerce' },
  { type: 'search-bar',    label: 'Search',       color: '#8b5cf6', group: 'ecommerce' },
  { type: 'cart-icon',     label: 'Cart',         color: '#f59e0b', group: 'ecommerce' },
  { type: 'wishlist-icon', label: 'Wishlist',     color: '#ef4444', group: 'ecommerce' },
  { type: 'user-icon',     label: 'Account',      color: '#10b981', group: 'ecommerce' },
  { type: 'categories',    label: 'Categories',   color: '#06b6d4', group: 'ecommerce' },
];

export const ELEMENT_ICON = {
  heading:       'H',
  text:          '¶',
  image:         '🖼',
  button:        '⬚',
  video:         '▶',
  divider:       '—',
  html:          '<>',
  logo:          '✦',
  menu:          '☰',
  'search-bar':  '🔍',
  'cart-icon':   '🛒',
  'wishlist-icon':'♡',
  'user-icon':   '👤',
  categories:    '🗂',
};

/** Derived from ELEMENT_TYPES — single source of truth for colors */
export const ELEMENT_COLOR = Object.fromEntries(
  ELEMENT_TYPES.map(e => [e.type, e.color])
);

export function getElementTypes() {
  return ELEMENT_TYPES;
}

export function getElementType(type) {
  return ELEMENT_TYPES.find(e => e.type === type);
}

export const LAYOUT_BLOCKS = [
  { key: 'section', label: 'Section',  desc: 'Full-width page wrapper',   available: true,  color: '#334155' },
  { key: 'row',     label: 'Row',      desc: 'Column grid layout',         available: true,  color: '#6366f1' },
  { key: 'grid',    label: 'Grid',     desc: 'Complex area grid layout',   available: true,  color: '#06b6d4' },
  { key: 'slider',  label: 'Slider',   desc: 'Carousel / slideshow block', available: false, color: '#06b6d4' },
  { key: 'tabs',    label: 'Tabs',     desc: 'Tabbed section layout',      available: false, color: '#10b981' },
  { key: 'modal',   label: 'Modal',    desc: 'Popup overlay block',        available: false, color: '#a855f7' },
];
