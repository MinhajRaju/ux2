// src/app/builder/header/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BuilderShell } from '@/components/builder/BuilderShell';
import { getHeaders, saveHeader } from '@/lib/db';

export default function HeaderBuilderPage() {
  const params = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const headers = getHeaders();
    const h = headers.find(h => h.id === params.id);
    setDoc(h || null);
  }, [params.id]);

  if (!doc) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#94a3b8' }}>Loading...</div>;

  return (
    <BuilderShell
      docType="header"
      docId={doc.id}
      docSlug=""
      docTitle={doc.name}
      sections={doc.sections || []}
      onSave={(sections) => {
        saveHeader({ ...doc, sections });
        return Promise.resolve();
      }}
    />
  );
}
