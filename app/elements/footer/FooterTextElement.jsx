'use client';
export default function FooterTextElement({ props }) {
  const p = props || {};
  return (
    <p style={{
      fontSize: (p.fontSize || 13) + 'px',
      color: p.color || '#64748b',
      textAlign: p.textAlign || 'left',
      margin: 0,
      lineHeight: 1.6,
    }}>
      {p.content || '© 2024 Brand. All rights reserved.'}
    </p>
  );
}
