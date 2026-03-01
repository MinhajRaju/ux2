/**
 * DEPTH_PALETTE — color scheme for nested column depths.
 * Used by: CanvasColumn, ColProps, LayersPanel.
 * Single source of truth — never duplicate this array.
 */
export const DEPTH_PALETTE = [
  { accent: '#6366f1', light: '#eef2ff' },
  { accent: '#0ea5e9', light: '#f0f9ff' },
  { accent: '#10b981', light: '#ecfdf5' },
  { accent: '#f59e0b', light: '#fffbeb' },
  { accent: '#ef4444', light: '#fee2e2' },
];

/** Helper: get palette entry for a given depth, clamped to array bounds */
export const depthPalette = (depth) => DEPTH_PALETTE[Math.min(depth, DEPTH_PALETTE.length - 1)];

export const T = {
  primary: '#6366f1',
  primaryLight: '#eef2ff',
  primaryDark: '#4338ca',
  danger: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  text: '#0f172a',
  textMid: '#334155',
  textLight: '#64748b',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  bg: '#f4f6fb',
  panel: '#ffffff',
  light: '#f8fafc',
};

export const SHADOWS = [
  'none',
  '0 1px 3px rgba(0,0,0,0.08)',
  '0 4px 12px rgba(0,0,0,0.08)',
  '0 8px 24px rgba(0,0,0,0.10)',
  '0 12px 32px rgba(0,0,0,0.12)',
  '0 20px 48px rgba(0,0,0,0.14)',
];
