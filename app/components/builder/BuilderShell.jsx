// src/components/builder/BuilderShell.jsx
'use client';
import { useEffect, useState } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { LeftSidebar } from './panels/LeftSidebar';
import { RightPanel }  from './panels/RightPanel';
import { Canvas }      from './canvas/Canvas';
import { BuilderTopbar } from './BuilderTopbar';

export function BuilderShell({ docType, docId, docSlug, docTitle, sections: initialSections, onSave }) {
  const { initDoc, sections } = useBuilderStore();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    initDoc(docType, docId, docSlug, docTitle, initialSections || []);
  }, [docType, docId, docSlug, docTitle]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(sections);
    } finally {
      setTimeout(() => setIsSaving(false), 600);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <BuilderTopbar onSave={handleSave} isSaving={isSaving} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LeftSidebar />
        <Canvas />
        <RightPanel />
      </div>
    </div>
  );
}
