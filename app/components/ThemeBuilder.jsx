'use client';
/**
 * ThemeBuilder — multi-template dashboard
 * Routes to the correct builder based on template type.
 * Data is persisted to localStorage via themeStore.
 */
import { useState, useEffect } from 'react';
import { uid, slugify, saveStore, getInitialData } from '../lib/themeStore';
import { T } from '../constants/theme';
import PageBuilder from '../builders/PageBuilder';
import TemplateBuilder from '../builders/TemplateBuilder';
import { useHeaderStore, useFooterStore } from '../store/useBuilderStore';
import { headerCanvasConfig } from '../configs/headerCanvasConfig';
import { footerCanvasConfig } from '../configs/footerCanvasConfig';
import { LivePreview } from './LivePreview';

// ── Dashboard Design Tokens ────────────────────────────────
// Unique to ThemeBuilder dashboard (intentionally pink, separate from builder indigo).
// Shared tokens (text, border, bg) delegate to T from constants/theme.
const PK = {
  // Dashboard-unique accent colors
  primary:     '#db2777', // Pink-600 — dashboard CTA
  primaryLight:'#fce7f3', // Pink-100
  mid:         '#7c3aed', // Violet-600
  // Shared with T
  bg:          T.bg,
  surface:     T.panel,
  border:      T.border,
  borderHover: '#D1D5DB',
  text:        T.text,
  textMid:     T.textMid,
  textLight:   T.textLight,
  shadow:      '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
  shadowHover: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
  radius:      '12px',
};

// Refined Type Colors
const TYPE = {
  header: { color: '#4F46E5', light: '#EEF2FF', border: '#C7D2FE', icon: '⊤', label: 'Header' }, // Indigo
  footer: { color: '#0891B2', light: '#ECFEFF', border: '#A5F3FC', icon: '⊥', label: 'Footer' }, // Cyan
  page:   { color: '#DB2777', light: '#FDF2F8', border: '#FBCFE8', icon: '◻', label: 'Page' },   // Pink
};

const now = () => new Date().toLocaleString('en-BD', {
  hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
});
const deepClone = o => JSON.parse(JSON.stringify(o));
const DEFAULT_SETTINGS = { activeHeaderId: null, activeFooterId: null, siteName: '', siteUrl: '' };

// ── GlobalSettings Side Panel ─────────────────────────────────
function GlobalSettingsPanel({ templates, globalSettings, onChange, onClose }) {
  const headers = templates.filter(t => t.type === 'header');
  const footers = templates.filter(t => t.type === 'footer');

  const SelectRow = ({ label, color, options, value, onSet }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: PK.textMid, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Active {label}
      </div>
      {options.length === 0 ? (
        <div style={{ padding: '16px', borderRadius: PK.radius, border: `1px dashed ${PK.border}`, fontSize: 13, color: PK.textLight, textAlign: 'center', background: '#F9FAFB' }}>
          No {label.toLowerCase()} templates found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map(t => {
            const isActive = value === t.id;
            return (
              <button key={t.id} onClick={() => onSet(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  borderRadius: PK.radius,
                  border: `1px solid ${isActive ? color : PK.border}`,
                  background: isActive ? `${color}08` : '#fff',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? `0 0 0 1px ${color}` : 'none'
                }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: `2px solid ${isActive ? color : '#D1D5DB'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: PK.text }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: PK.textLight }}>Updated {t.lastEdited}</div>
                </div>
                {isActive && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: color, color: '#fff' }}>Active</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', display: 'flex' }} onClick={onClose}>
      <div style={{
        marginLeft: 'auto', width: 360, height: '100%', background: '#fff',
        borderLeft: `1px solid ${PK.border}`, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.08)', animation: 'slideIn 0.3s ease'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: `1px solid ${PK.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: PK.text }}>Global Settings</div>
            <div style={{ fontSize: 13, color: PK.textMid, marginTop: 4 }}>Configure site-wide defaults</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: 'none', background: '#F3F4F6',
            cursor: 'pointer', fontSize: 18, color: PK.textMid, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>×</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <SelectRow label="Header" color={TYPE.header.color} options={headers} value={globalSettings.activeHeaderId} onSet={id => onChange({ ...globalSettings, activeHeaderId: id })} />
          <SelectRow label="Footer" color={TYPE.footer.color} options={footers} value={globalSettings.activeFooterId} onSet={id => onChange({ ...globalSettings, activeFooterId: id })} />
          
          <div style={{ borderTop: `1px solid ${PK.border}`, paddingTop: 24, marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: PK.textMid, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Site Metadata</div>
            {[{ label: 'Site Name', key: 'siteName' }, { label: 'Site URL', key: 'siteUrl' }].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: PK.textMid, marginBottom: 6 }}>{f.label}</label>
                <input
                  value={globalSettings[f.key] || ''}
                  onChange={e => onChange({ ...globalSettings, [f.key]: e.target.value })}
                  placeholder={`Enter ${f.label.toLowerCase()}...`}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${PK.border}`,
                    fontSize: 13, color: PK.text, outline: 'none', boxSizing: 'border-box',
                    transition: 'border 0.2s', background: '#F9FAFB'
                  }}
                  onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = PK.primary; }}
                  onBlur={e => { e.target.style.background = '#F9FAFB'; e.target.style.borderColor = PK.border; }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '20px 24px', borderTop: `1px solid ${PK.border}`, background: '#F9FAFB' }}>
          <button onClick={onClose} style={{
            width: '100%', padding: '12px', borderRadius: 8, border: 'none',
            background: PK.text, color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ── Template Card ─────────────────────────────────────────────
function TemplateCard({ tpl, isActiveHeader, isActiveFooter, onEdit, onDelete, onDuplicate, onSetActive }) {
  const [hov, setHov] = useState(false);
  const [menu, setMenu] = useState(false);
  const tm = TYPE[tpl.type];
  const isGlobal = isActiveHeader || isActiveFooter;
  const pageUrl = tpl.type === 'page' ? (tpl.slug === '/' ? '/' : '/' + tpl.slug) : null;
  const sections = tpl.type === 'header' ? tpl.headerData?.sections
    : tpl.type === 'footer' ? tpl.footerData?.sections
    : tpl.sections;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setMenu(false); }}
      style={{
        borderRadius: PK.radius,
        border: `1px solid ${hov ? tm.border : PK.border}`,
        background: '#fff', overflow: 'visible', cursor: 'pointer',
        boxShadow: hov ? PK.shadowHover : '0 1px 2px rgba(0,0,0,0.05)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)'
      }}
    >
      {/* Visual Preview / Thumbnail */}
      <div onClick={onEdit} style={{
        height: 120, background: tm.light,
        borderTopLeftRadius: PK.radius, borderTopRightRadius: PK.radius,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Mini UI Mockup */}
        <div style={{
          width: '80%', height: '70%', background: '#fff', borderRadius: 6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)', padding: 8,
          display: 'flex', flexDirection: 'column', gap: 6, opacity: 0.9
        }}>
           {(!sections || sections.length === 0) ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${tm.border}`, borderRadius: 4 }}>
              <div style={{ fontSize: 10, color: tm.color, fontWeight: 600 }}>Empty Canvas</div>
            </div>
           ) : (
            <>
              {sections.slice(0, 3).map((_, i) => (
                <div key={i} style={{
                  height: i === 0 ? 14 : 8, borderRadius: 3,
                  background: i === 0 ? tm.color : `${tm.color}30`,
                  width: i === 0 ? '100%' : i === 1 ? '70%' : '50%',
                  opacity: 0.7
                }} />
              ))}
              <div style={{ flex: 1 }} />
              <div style={{ height: 4, width: '30%', background: '#E5E7EB', borderRadius: 2 }} />
            </>
           )}
        </div>

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          <div style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: '#fff', color: tm.color, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            {tm.icon} {tpl.type}
          </div>
        </div>
        {isGlobal && (
          <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: '#10B981', color: '#fff', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}>
            Active
          </div>
        )}
      </div>

      {/* Card Info */}
      <div style={{ padding: '14px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: PK.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tpl.name}
            </div>
            {pageUrl ? (
              <div style={{ fontSize: 11, color: tm.color, fontFamily: 'monospace', marginTop: 3 }}>
                {pageUrl}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: PK.textLight, marginTop: 3 }}>
                Edited {tpl.lastEdited}
              </div>
            )}
          </div>
          
          <button onClick={e => { e.stopPropagation(); setMenu(v => !v); }} 
            style={{ 
              width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', 
              cursor: 'pointer', color: PK.textLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontWeight: 900, fontSize: 14, lineHeight: 0 }}>⋯</span>
          </button>
        </div>

        {/* Floating Menu */}
        {menu && (
          <div style={{
            position: 'absolute', top: 30, right: 10, zIndex: 50,
            background: '#fff', borderRadius: 8, border: `1px solid ${PK.border}`,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden', minWidth: 160,
            animation: 'fadeIn 0.1s ease'
          }}>
            {[
              { label: 'Edit Design', action: onEdit, icon: '✏️' },
              { label: 'Duplicate', action: onDuplicate, icon: '⧉' },
              ...(tpl.type !== 'page' ? [{ label: `Set Active`, action: onSetActive, icon: '★' }] : []),
              { label: 'Delete', action: onDelete, danger: true, icon: '✕' },
            ].map(item => (
              <button key={item.label} onClick={e => { e.stopPropagation(); setMenu(false); item.action(); }}
                style={{
                  width: '100%', padding: '10px 14px', border: 'none', background: 'transparent',
                  textAlign: 'left', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  color: item.danger ? '#DC2626' : PK.text,
                  borderBottom: `1px solid ${PK.border}40`, display: 'flex', alignItems: 'center', gap: 8
                }}
                onMouseEnter={e => e.currentTarget.style.background = item.danger ? '#FEF2F2' : '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 10, opacity: 0.7 }}>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Template Lane ─────────────────────────────────────────────
function TemplateLane({ type, templates, globalSettings, onEdit, onNew, onDelete, onDuplicate, onSetActive }) {
  const tm = TYPE[type];
  const items = templates.filter(t => t.type === type);
  
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 10, background: tm.light, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: 16, color: tm.color, border: `1px solid ${tm.border}` 
          }}>
            {tm.icon}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: PK.text, lineHeight: 1.2 }}>
              {tm.label} Templates
            </div>
            <div style={{ fontSize: 12, color: PK.textMid }}>
              {type === 'page' ? 'Standalone page layouts' : `Global ${type} sections`}
            </div>
          </div>
          {type !== 'page' && (
             <div style={{ 
               marginLeft: 12, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, 
               background: globalSettings[`active${type.charAt(0).toUpperCase() + type.slice(1)}Id`] ? '#ECFDF5' : '#F3F4F6',
               color: globalSettings[`active${type.charAt(0).toUpperCase() + type.slice(1)}Id`] ? '#059669' : PK.textLight,
               border: `1px solid transparent` 
              }}>
               {globalSettings[`active${type.charAt(0).toUpperCase() + type.slice(1)}Id`] ? '● Active Set' : '○ Not Set'}
             </div>
          )}
        </div>
        
        <button onClick={onNew} style={{ 
          padding: '8px 16px', borderRadius: 8, border: `1px solid ${PK.border}`, 
          background: '#fff', color: PK.text, fontSize: 12, fontWeight: 600, 
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = tm.color; e.currentTarget.style.color = tm.color; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = PK.border; e.currentTarget.style.color = PK.text; }}
        >
          <span style={{ fontSize: 16, lineHeight: 0.5 }}>+</span> New {tm.label}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 24 }}>
        {items.map(tpl => (
          <TemplateCard key={tpl.id} tpl={tpl}
            isActiveHeader={globalSettings.activeHeaderId === tpl.id}
            isActiveFooter={globalSettings.activeFooterId === tpl.id}
            onEdit={() => onEdit(tpl)} onDelete={() => onDelete(tpl.id)}
            onDuplicate={() => onDuplicate(tpl)} onSetActive={() => onSetActive(tpl)} />
        ))}
        
        {/* New Item Placeholder */}
        <button onClick={onNew}
          style={{ 
            borderRadius: PK.radius, border: `2px dashed ${PK.border}`, height: 200, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, 
            cursor: 'pointer', background: 'transparent', transition: 'all 0.2s',
            color: PK.textLight
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = tm.color; e.currentTarget.style.background = tm.light; e.currentTarget.style.color = tm.color; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = PK.border; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = PK.textLight; }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: '50%', background: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: 'inherit'
          }}>+</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Create New {tm.label}</div>
        </button>
      </div>
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────
function StatsBar({ templates, globalSettings }) {
  const headers = templates.filter(t => t.type === 'header').length;
  const footers = templates.filter(t => t.type === 'footer').length;
  const pages   = templates.filter(t => t.type === 'page').length;
  
  const StatItem = ({ label, value, color, bg }) => (
    <div style={{ 
      flex: 1, padding: '16px 20px', borderRadius: PK.radius, background: '#fff', 
      border: `1px solid ${PK.border}`, display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
    }}>
      <div style={{ 
        width: 42, height: 42, borderRadius: 10, background: bg, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: 18, fontWeight: 700, color: color 
      }}>{value}</div>
      <div>
        <div style={{ fontSize: 13, color: PK.textMid, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: PK.textLight }}>Total Count</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
      <StatItem label="Header Templates" value={headers} color={TYPE.header.color} bg={TYPE.header.light} />
      <StatItem label="Footer Templates" value={footers} color={TYPE.footer.color} bg={TYPE.footer.light} />
      <StatItem label="Page Layouts"     value={pages}   color={TYPE.page.color}   bg={TYPE.page.light} />
    </div>
  );
}

// ── New Template Modal ────────────────────────────────────────
function NewTemplateModal({ defaultType, onConfirm, onClose }) {
  const [name, setName] = useState('');
  const [type, setType] = useState(defaultType || 'page');
  const [slugEdited, setSlugEdited] = useState(false);
  const [slug, setSlug] = useState('');

  const handleNameChange = val => { setName(val); if (!slugEdited && type === 'page') setSlug(slugify(val)); };
  const handleSlugChange = val => { setSlugEdited(true); setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^\//, '')); };
  const finalSlug = slug === '' ? '/' : slug;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: 480, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', transform: 'translateY(0)', animation: 'popIn 0.2s ease-out' }}>
        
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${PK.border}` }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: PK.text }}>New Template</div>
          <div style={{ fontSize: 13, color: PK.textMid, marginTop: 4 }}>Select a type and name your new design.</div>
        </div>
        
        <div style={{ padding: 28 }}>
          {/* Type Selection */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: PK.text, marginBottom: 10 }}>TEMPLATE TYPE</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {(['page', 'header', 'footer']).map(t => {
                const tm = TYPE[t];
                const active = type === t;
                return (
                  <button key={t} onClick={() => { setType(t); if (t !== 'page') { setSlug(''); setSlugEdited(false); } }}
                    style={{ 
                      flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer', 
                      border: `1px solid ${active ? tm.color : PK.border}`, 
                      background: active ? tm.light : '#fff', 
                      transition: 'all 0.2s', textAlign: 'center'
                    }}>
                    <div style={{ fontSize: 18, marginBottom: 6, color: active ? tm.color : PK.textMid }}>{tm.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: active ? tm.color : PK.textMid }}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Input */}
          <div style={{ marginBottom: type === 'page' ? 16 : 0 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: PK.text, marginBottom: 8 }}>NAME</label>
            <input autoFocus value={name} onChange={e => handleNameChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && onConfirm(type, name.trim(), finalSlug)}
              placeholder={`e.g. ${type === 'header' ? 'Main Navigation' : 'Landing Page'}`}
              style={{ 
                width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${PK.border}`, 
                outline: 'none', fontSize: 14, color: PK.text, boxSizing: 'border-box',
                transition: 'border 0.2s', background: '#F9FAFB'
              }}
              onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = TYPE[type].color; }}
              onBlur={e => { e.target.style.background = '#F9FAFB'; e.target.style.borderColor = PK.border; }}
            />
          </div>

          {/* Slug Input (Page only) */}
          {type === 'page' && (
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: PK.text, marginBottom: 8 }}>URL SLUG</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '0 14px', borderRadius: 8, border: `1px solid ${PK.border}`, background: '#F9FAFB' }}>
                <span style={{ color: PK.textLight, fontSize: 14, fontWeight: 500 }}>/</span>
                <input value={slug} onChange={e => handleSlugChange(e.target.value)}
                  placeholder="page-url"
                  style={{ flex: 1, padding: '12px 4px', border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: PK.text, fontFamily: 'monospace' }} />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: '20px 28px', background: '#F9FAFB', borderTop: `1px solid ${PK.border}`, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 8, border: `1px solid ${PK.border}`, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: PK.textMid }}>Cancel</button>
          <button onClick={() => name.trim() && onConfirm(type, name.trim(), finalSlug)} disabled={!name.trim()}
            style={{ 
              padding: '10px 24px', borderRadius: 8, border: 'none', 
              background: name.trim() ? PK.text : '#D1D5DB', 
              color: '#fff', cursor: name.trim() ? 'pointer' : 'not-allowed', 
              fontSize: 13, fontWeight: 600, boxShadow: name.trim() ? '0 2px 5px rgba(0,0,0,0.2)' : 'none'
            }}>
            Create & Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  MAIN THEME BUILDER
// ════════════════════════════════════════════════════════════════
export default function ThemeBuilder() {
  const [templates,          setTemplates]         = useState([]);
  const [globalSettings,     setGlobalSettings]    = useState(DEFAULT_SETTINGS);
  const [hydrated,           setHydrated]          = useState(false);
  const [editingTemplate,    setEditingTemplate]   = useState(null);
  const [showGlobalSettings, setShowGlobalSettings]= useState(false);
  const [showNewModal,       setShowNewModal]      = useState(null);
  const [search,             setSearch]            = useState('');
  const [showPreview,        setShowPreview]       = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const data = getInitialData();
    setTemplates(data.templates);
    setGlobalSettings(data.globalSettings);
    setHydrated(true);
  }, []);

  // Persist whenever data changes
  useEffect(() => {
    if (!hydrated) return;
    saveStore(templates, globalSettings);
  }, [templates, globalSettings, hydrated]);

  if (!hydrated) return null;

  // ── CRUD ────────────────────────────────────────────────────
  const createTemplate = (type, name, slug) => {
    const tpl = {
      id: uid(), type, name,
      slug: type === 'page' ? (slug || slugify(name)) : null,
      sections: [],
      headerData: type === 'header' ? deepClone({ sections: [{ id: 'header-section-1', type: 'section', settings: { label: 'Header Section', bg: '#ffffff', visible: true, padV: 0, padH: 0 }, rows: [] }] }) : null,
      footerData: type === 'footer' ? deepClone({ sections: [{ id: 'footer-section-1', type: 'section', settings: { label: 'Footer Section', bg: '#1e293b', visible: true, padV: 0, padH: 0 }, rows: [] }] }) : null,
      lastEdited: now(),
    };
    setTemplates(p => [...p, tpl]);
    setShowNewModal(null);
    setEditingTemplate(tpl);
  };

  const saveTemplate = (tplId, payload) => {
    setTemplates(prev => prev.map(t =>
      t.id !== tplId ? t : { ...t, ...payload, lastEdited: now() }
    ));
  };

  const deleteTemplate = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    setGlobalSettings(prev => ({
      ...prev,
      activeHeaderId: prev.activeHeaderId === id ? null : prev.activeHeaderId,
      activeFooterId: prev.activeFooterId === id ? null : prev.activeFooterId,
    }));
  };

  const duplicateTemplate = (tpl) => {
    const slug = tpl.type === 'page' ? slugify(`${tpl.name}-copy`) : null;
    const clone = { ...deepClone(tpl), id: uid(), name: `${tpl.name} (Copy)`, slug, lastEdited: now() };
    setTemplates(prev => [...prev, clone]);
  };

  const setActiveTemplate = (tpl) => {
    if (tpl.type === 'header') setGlobalSettings(prev => ({ ...prev, activeHeaderId: tpl.id }));
    if (tpl.type === 'footer') setGlobalSettings(prev => ({ ...prev, activeFooterId: tpl.id }));
  };

  // ── Route to builders ───────────────────────────────────────
  if (editingTemplate) {
    const { type } = editingTemplate;

    if (type === 'page') {
      return (
        <PageBuilder
          templateName={editingTemplate.name}
          slug={editingTemplate.slug || '/'}
          initialSections={editingTemplate.sections || []}
          onSave={(sections) => saveTemplate(editingTemplate.id, { sections })}
          onBack={() => setEditingTemplate(null)}
        />
      );
    }

    if (type === 'header') {
      return (
        <TemplateBuilder
          type="header"
          store={useHeaderStore}
          config={headerCanvasConfig}
          templateName={editingTemplate.name}
          initialData={editingTemplate.headerData || { sections: [] }}
          onSave={(sections) => saveTemplate(editingTemplate.id, { headerData: { sections } })}
          onBack={() => setEditingTemplate(null)}
        />
      );
    }

    if (type === 'footer') {
      return (
        <TemplateBuilder
          type="footer"
          store={useFooterStore}
          config={footerCanvasConfig}
          templateName={editingTemplate.name}
          initialData={editingTemplate.footerData || { sections: [] }}
          onSave={(sections) => saveTemplate(editingTemplate.id, { footerData: { sections } })}
          onBack={() => setEditingTemplate(null)}
        />
      );
    }
  }

  const filtered = templates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  // ── Dashboard ───────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: PK.bg, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", color: PK.text }}>
      
      {/* Top Navigation */}
      <nav style={{ 
        height: 64, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', 
        borderBottom: `1px solid ${PK.border}`, display: 'flex', alignItems: 'center', 
        padding: '0 32px', gap: 24, position: 'sticky', top: 0, zIndex: 100 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 10, background: PK.text, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 
          }}>✦</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>UX Builder</div>
          </div>
        </div>

        <div style={{ width: 1, height: 24, background: PK.border }} />

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: PK.textLight }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..."
            style={{ 
              width: '100%', padding: '10px 10px 10px 36px', borderRadius: 20, 
              border: `1px solid ${PK.border}`, background: '#fff', 
              fontSize: 13, color: PK.text, outline: 'none', boxSizing: 'border-box',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)', transition: 'all 0.2s'
            }}
            onFocus={e => { e.target.style.borderColor = PK.textLight; e.target.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.05)'; }}
            onBlur={e => { e.target.style.borderColor = PK.border; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'; }}
           />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <button onClick={() => setShowGlobalSettings(true)} style={{ 
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, 
            border: `1px solid transparent`, background: 'transparent', cursor: 'pointer', color: PK.textMid,
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >⚙ Settings</button>
          
          <button onClick={() => setShowPreview(true)} style={{ 
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, 
            border: `1px solid #D1FAE5`, background: '#ECFDF5', cursor: 'pointer', color: '#059669' 
          }}>Preview Site</button>
          
          <button onClick={() => setShowNewModal('page')} style={{ 
            padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, 
            border: 'none', background: PK.text, color: '#fff', cursor: 'pointer', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
          }}>+ New Template</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>
        
        {/* Intro */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: PK.text, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: PK.textMid, margin: 0, maxWidth: 600, lineHeight: 1.5 }}>
            Manage your website's visual structure. Create reusable headers and footers, or design standalone page layouts using the block builder.
          </p>
        </div>

        <StatsBar templates={templates} globalSettings={globalSettings} />

        {search ? (
          <div>
            <div style={{ fontSize: 14, color: PK.textMid, marginBottom: 20, fontWeight: 500 }}>
              Found {filtered.length} matching "{search}"
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 24 }}>
              {filtered.map(tpl => (
                <TemplateCard key={tpl.id} tpl={tpl}
                  isActiveHeader={globalSettings.activeHeaderId === tpl.id}
                  isActiveFooter={globalSettings.activeFooterId === tpl.id}
                  onEdit={() => setEditingTemplate(tpl)} onDelete={() => deleteTemplate(tpl.id)}
                  onDuplicate={() => duplicateTemplate(tpl)} onSetActive={() => setActiveTemplate(tpl)} />
              ))}
            </div>
          </div>
        ) : (
          ['header', 'page', 'footer'].map(type => (
            <TemplateLane key={type} type={type} templates={templates} globalSettings={globalSettings}
              onEdit={tpl => setEditingTemplate(tpl)} onNew={() => setShowNewModal(type)}
              onDelete={deleteTemplate} onDuplicate={duplicateTemplate} onSetActive={setActiveTemplate} />
          ))
        )}
      </div>

      {showNewModal && <NewTemplateModal defaultType={showNewModal} onConfirm={createTemplate} onClose={() => setShowNewModal(null)} />}
      {showGlobalSettings && <GlobalSettingsPanel templates={templates} globalSettings={globalSettings} onChange={setGlobalSettings} onClose={() => setShowGlobalSettings(false)} />}
      {showPreview && <LivePreview templates={templates} globalSettings={globalSettings} onClose={() => setShowPreview(false)} />}
    </div>
  );
}