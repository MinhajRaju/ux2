'use client';
export default function TextElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  return (
    <p
      onClick={mode === 'edit' ? onSelect : undefined}
      style={{
        fontSize: (p.fontSize || 16) + 'px',
        fontWeight: p.fontWeight || '400',
        color: p.color || '#334155',
        textAlign: p.textAlign || 'left',
        lineHeight: p.lineHeight || 1.7,
        margin: 0,
        cursor: mode === 'edit' ? 'pointer' : 'default',
        outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none',
        borderRadius: 4,
      }}
    >
      {p.content || 'Write your text content here.'}
    </p>
  );
}
