// src/components/builder/BuilderTopbar.jsx
'use client';
import { useState } from 'react';
import { Undo2, Redo2, Monitor, Smartphone, Save, Eye, Settings, ChevronLeft } from 'lucide-react';
import { T } from '@/constants/theme';
import { useBuilderStore } from '@/store/builderStore';
import { useRouter } from 'next/navigation';

export function BuilderTopbar({ onSave, isSaving }) {
  const { docTitle, docType, docSlug, undo, redo, past, future, isMobile, toggleMobile } = useBuilderStore();
  const router = useRouter();

  const previewUrl = docType === 'page' ? `/preview${docSlug === '/' ? '' : docSlug}` : `/preview/_${docType}`;

  return (
    <div style={{
      height: 52,
      borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center',
      background: '#fff',
      padding: '0 16px',
      gap: 8,
      flexShrink: 0,
      zIndex: 50,
    }}>
      {/* Back */}
      <button
        onClick={() => router.push('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          border: 'none', background: 'transparent',
          color: '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          padding: '5px 8px', borderRadius: 6,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = T.light; e.currentTarget.style.color = '#334155'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
      >
        <ChevronLeft size={15} /> Back
      </button>

      <div style={{ width: 1, height: 20, background: T.border, margin: '0 4px' }} />

      {/* Doc badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: T.light, borderRadius: 8, padding: '5px 12px',
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
          background: docType === 'header' ? '#eef2ff' : docType === 'footer' ? '#ecfdf5' : T.primarySoft,
          color: docType === 'header' ? '#6366f1' : docType === 'footer' ? '#10b981' : T.primary,
        }}>
          {docType === 'header' ? 'HEADER' : docType === 'footer' ? 'FOOTER' : 'PAGE'}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{docTitle}</span>
        {docType === 'page' && (
          <span style={{ fontSize: 11, color: '#94a3b8' }}>/{docSlug}</span>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Undo / Redo */}
      <div style={{ display: 'flex', gap: 2 }}>
        <TopBtn onClick={undo} disabled={past.length === 0} title="Undo">
          <Undo2 size={15} />
        </TopBtn>
        <TopBtn onClick={redo} disabled={future.length === 0} title="Redo">
          <Redo2 size={15} />
        </TopBtn>
      </div>

      <div style={{ width: 1, height: 20, background: T.border, margin: '0 4px' }} />

      {/* Preview toggle */}
      <div style={{ display: 'flex', background: T.light, borderRadius: 8, padding: 3, gap: 2 }}>
        <TopBtn active={!isMobile} onClick={() => isMobile && toggleMobile()} title="Desktop">
          <Monitor size={15} />
        </TopBtn>
        <TopBtn active={isMobile} onClick={() => !isMobile && toggleMobile()} title="Mobile">
          <Smartphone size={15} />
        </TopBtn>
      </div>

      <div style={{ width: 1, height: 20, background: T.border, margin: '0 4px' }} />

      {/* Preview */}
      <a
        href={previewUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          border: `1px solid ${T.border}`, borderRadius: 8,
          padding: '6px 14px', fontSize: 12, fontWeight: 600,
          color: '#334155', textDecoration: 'none', background: '#fff',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.color = T.primary; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = '#334155'; }}
      >
        <Eye size={14} /> Preview
      </a>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={isSaving}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: T.primary, color: '#fff', border: 'none',
          borderRadius: 8, padding: '7px 16px',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          opacity: isSaving ? 0.7 : 1,
          boxShadow: `0 2px 8px ${T.primary}40`,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { if (!isSaving) e.currentTarget.style.background = '#4f46e5'; }}
        onMouseLeave={e => { e.currentTarget.style.background = T.primary; }}
      >
        <Save size={14} /> {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

function TopBtn({ onClick, children, title, disabled, active }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        width: 32, height: 32, border: 'none',
        background: active ? T.primary : 'transparent',
        color: active ? '#fff' : disabled ? '#cbd5e1' : '#64748b',
        borderRadius: 7, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!disabled && !active) { e.currentTarget.style.background = T.light; e.currentTarget.style.color = '#334155'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = disabled ? '#cbd5e1' : '#64748b'; } }}
    >
      {children}
    </button>
  );
}
