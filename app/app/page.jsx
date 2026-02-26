import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 520, padding: '40px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>PageBuilder</h1>
        <p style={{ fontSize: 15, color: '#64748b', marginBottom: 40, lineHeight: 1.7 }}>
          A visual drag-and-drop page builder with separate Header, Page, and Footer builders.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/builder" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', background: '#6366f1', color: '#fff',
            borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
          }}>
            Open Builder 
          </Link>
        </div>
      </div>
    </div>
  );
}
