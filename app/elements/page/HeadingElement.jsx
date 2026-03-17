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
        background: p.bg || undefined,
        textAlign: p.textAlign || 'left',
        lineHeight: p.lineHeight || 1.2,
        letterSpacing: p.letterSpacing ? `${p.letterSpacing}px` : undefined,
        margin: 0,
        paddingTop:    (p.padTop    ?? 4) + 'px',
        paddingRight:  (p.padRight  ?? 0) + 'px',
        paddingBottom: (p.padBottom ?? 4) + 'px',
        paddingLeft:   (p.padLeft   ?? 0) + 'px',
        marginTop:    p.marginTop    ? p.marginTop    + 'px' : undefined,
        marginRight:  p.marginRight  ? p.marginRight  + 'px' : undefined,
        marginBottom: p.marginBottom ? p.marginBottom + 'px' : undefined,
        marginLeft:   p.marginLeft   ? p.marginLeft   + 'px' : undefined,
        maxWidth: '100%',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        cursor: mode === 'edit' ? 'pointer' : 'default',
        outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none',
        borderRadius: 4,
        boxSizing: 'border-box',
      }}
    >
      {p.content || 'Your Heading Here'}
    </Tag>
  );
}
