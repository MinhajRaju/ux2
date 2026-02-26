// src/app/builder/[slug]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BuilderShell } from '@/components/builder/BuilderShell';
import { getPages, savePage } from '@/lib/db';

export default function PageBuilderPage() {
  const params = useParams();
  const rawSlug = params.slug;
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const pages = getPages();
    // Slug in URL is without leading slash; page.slug has leading slash
    const slug = rawSlug === 'home' ? '/' : `/${rawSlug}`;
    let page = pages.find(p => p.slug === slug);
    if (!page) {
      // Create it
      page = { id: rawSlug, slug, title: rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1), sections: [] };
      savePage(page);
    }
    setDoc(page);
  }, [rawSlug]);

  if (!doc) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#94a3b8' }}>Loading...</div>;

  return (
    <BuilderShell
      docType="page"
      docId={doc.id}
      docSlug={doc.slug}
      docTitle={doc.title}
      sections={doc.sections || []}
      onSave={(sections) => {
        savePage({ ...doc, sections });
        return Promise.resolve();
      }}
    />
  );
}
