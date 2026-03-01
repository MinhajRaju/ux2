'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BuilderShell } from '@/components/builder/BuilderShell';
import { useFooterStore } from '@/store/useBuilderStore';
import { footerCanvasConfig } from '@/configs/footerCanvasConfig';
import { getFooters, saveFooter } from '@/lib/db';

export default function FooterBuilderPage() {
  const params = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const footers = getFooters();
    const f = footers.find(f => f.id === params.id);
    setDoc(f || null);
  }, [params.id]);

  if (!doc) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#94a3b8' }}>Loading…</div>;

  return (
    <BuilderShell
      store={useFooterStore}
      config={footerCanvasConfig}
      docType="footer"
      docId={doc.id}
      docSlug=""
      docTitle={doc.name}
      sections={doc.sections || []}
      onSave={(sections) => { saveFooter({ ...doc, sections }); return Promise.resolve(); }}
    />
  );
}
