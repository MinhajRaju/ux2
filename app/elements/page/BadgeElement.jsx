'use client';
export default function BadgeElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  const variants = {
    solid:   { background: p.bg || '#ef4444', color: p.color || '#fff', border: 'none' },
    outline: { background: 'transparent', color: p.bg || '#ef4444', border: `2px solid ${p.bg || '#ef4444'}` },
    soft:    { background: (p.bg || '#ef4444') + '18', color: p.bg || '#ef4444', border: 'none' },
  };
  const style = variants[p.variant || 'solid'];
  return (
    <div onClick={mode === 'edit' ? onSelect : undefined}
      style={{ cursor: mode === 'edit' ? 'pointer' : 'default', outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none', display: 'inline-block' }}>
      <span style={{
        ...style,
        fontSize: (p.fontSize || 11) + 'px',
        fontWeight: p.fontWeight || 700,
        borderRadius: (p.borderRadius ?? 99) + 'px',
        padding: `${p.padV || 4}px ${p.padH || 10}px`,
        textTransform: p.uppercase ? 'uppercase' : 'none',
        letterSpacing: p.uppercase ? '0.06em' : 'normal',
        display: 'inline-flex', alignItems: 'center', gap: 4,
      }}>
        {p.icon && <span>{p.icon}</span>}
        {p.text || 'NEW'}
      </span>
    </div>
  );
}
