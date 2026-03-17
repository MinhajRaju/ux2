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
        background: p.bg || undefined,
        textAlign: p.textAlign || 'left',
        lineHeight: p.lineHeight || 1.7,
        letterSpacing: p.letterSpacing ? `${p.letterSpacing}px` : undefined,
        margin: 0,
        paddingTop:    (p.padTop    ?? 0) + 'px',
        paddingRight:  (p.padRight  ?? 0) + 'px',
        paddingBottom: (p.padBottom ?? 0) + 'px',
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
      {p.content || 'Write your text content here.'}
    </p>
  );
}

