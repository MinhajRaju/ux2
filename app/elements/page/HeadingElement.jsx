'use client';
export default function HeadingElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  const Tag = p.tag || 'h2';
  return (
    <Tag
      onClick={mode === 'edit' ? onSelect : undefined}
      style={{
        fontSize: (p.fontSize || 32) + 'px',
        fontWeight: p.fontWeight || '700',
        color: p.color || '#0f172a',
        textAlign: p.textAlign || 'left',
        lineHeight: p.lineHeight || 1.2,
        margin: 0,
        maxWidth: '100%',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        cursor: mode === 'edit' ? 'pointer' : 'default',
        outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none',
        borderRadius: 4,
      }}
    >
      {p.content || 'Your Heading Here'}
    </Tag>
  );
}
