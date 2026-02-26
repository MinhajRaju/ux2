'use client';
export default function HtmlElement({ props, mode }) {
  const p = props || {};
  if (mode === 'edit') {
    return (
      <div style={{
        padding: '10px 14px', background: '#f8fafc',
        border: '1.5px dashed #94a3b8', borderRadius: 6,
        fontSize: 11, color: '#64748b', fontFamily: 'monospace',
      }}>
        {'<HTML>'} {p.code ? p.code.substring(0, 60) + '...' : 'Custom HTML'}
      </div>
    );
  }
  return <div dangerouslySetInnerHTML={{ __html: p.code || '' }} />;
}
