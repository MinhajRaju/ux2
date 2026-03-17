'use client';
import { useRef } from 'react';
import { PropSec, FL, RInput, SliderInput, SegCtrl, Toggle, SpacingBox, Divider, NumberInput, SelectInput, ColorPick } from '../../../../../shared/ui';
import { T } from '../../../../../../constants/theme';

/* ── Media upload field ─────────────────────────────────────────────────── */
function ImageUploadField({ val, set }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set(ev.target.result);
    reader.readAsDataURL(file);
  };

  const openMediaCenter = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-media-center', {
        detail: { callback: (url) => set(url) },
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Preview */}
      {val ? (
        <div style={{ position: 'relative' }}>
          <img
            src={val}
            alt="preview"
            style={{
              width: '100%', height: 100, objectFit: 'cover',
              borderRadius: 8, border: `1.5px solid ${T.border}`, display: 'block',
            }}
          />
          <button
            onClick={() => set('')}
            style={{
              position: 'absolute', top: 5, right: 5, width: 22, height: 22,
              background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 5,
              color: '#fff', fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
      ) : (
        <div style={{
          height: 80, background: T.light, border: `2px dashed ${T.border}`,
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 4,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke={T.textLight} strokeWidth="1.5"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill={T.textLight}/>
            <path d="M3 15l5-5 4 4 3-3 6 6" stroke={T.textLight} strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 11, color: T.textLight }}>No image selected</span>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            padding: '7px 0', fontSize: 11, fontWeight: 600,
            border: `1.5px solid ${T.primary}`, borderRadius: 7,
            cursor: 'pointer', background: `${T.primary}12`, color: T.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v7M3 4l3-3 3 3M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Upload
        </button>
        <button
          onClick={openMediaCenter}
          style={{
            padding: '7px 0', fontSize: 11, fontWeight: 600,
            border: `1.5px solid ${T.border}`, borderRadius: 7,
            cursor: 'pointer', background: T.light, color: T.textMid,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}
        >
          🗂 Media
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      <RInput val={val || ''} set={set} placeholder="or paste image URL…" />
    </div>
  );
}

/* ── Info pill ──────────────────────────────────────────────────────────── */
function InfoNote({ children }) {
  return (
    <div style={{
      fontSize: 10, color: T.textLight, lineHeight: 1.6,
      padding: '5px 9px', background: T.light, borderRadius: 6,
      borderLeft: `2px solid ${T.primary}40`,
    }}>
      {children}
    </div>
  );
}

export function ImageProps({ el, onChange }) {
  const p  = el.props || {};
  const up = (k, v) => onChange({ [k]: v });

  const isExternal = p.src?.startsWith('http') || p.src?.startsWith('//');

  return (
    <>
      {/* ── 1. Source ── */}
      <PropSec title="Image Source">
        <ImageUploadField val={p.src || ''} set={v => up('src', v)} />
        <RInput label="Alt Text" val={p.alt || ''} set={v => up('alt', v)} placeholder="Describe the image for accessibility…" />
      </PropSec>

      {/* ── 2. Layout ── */}
      <PropSec title="Layout Mode">
        <SegCtrl
          label="Mode"
          val={p.layoutMode || 'responsive'}
          set={v => up('layoutMode', v)}
          opts={[
            { v: 'responsive', l: 'Responsive' },
            { v: 'fill',       l: 'Fill' },
            { v: 'fixed',      l: 'Fixed' },
          ]}
        />
        <InfoNote>
          {p.layoutMode === 'fill'
            ? '📐 Fill — image covers the entire parent container (needs parent height).'
            : p.layoutMode === 'fixed'
            ? '📌 Fixed — exact pixel dimensions, no scaling.'
            : '📱 Responsive — scales with container width. Height is set manually below. Next.js generates srcset automatically.'
          }
        </InfoNote>

        {p.layoutMode === 'fixed' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <NumberInput label="Width"  val={+(p.fixedWidth  || 400)} set={v => up('fixedWidth',  v)} min={10} max={2000} unit="px" />
            <NumberInput label="Height" val={+(p.fixedHeight || 300)} set={v => up('fixedHeight', v)} min={10} max={2000} unit="px" />
          </div>
        ) : (
          <>
            <RInput label="Width" val={p.width || '100%'} set={v => up('width', v)} placeholder="100%, 400px, auto…" />
            <SliderInput label="Height" val={+(p.height || 300)} set={v => up('height', v)} min={40} max={1200} unit="px" />
          </>
        )}

        {/* Aspect ratio shortcut */}
        <FL>Aspect Ratio Preset</FL>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { l: 'Free',  h: null },
            { l: '1:1',   h: (w) => w },
            { l: '4:3',   h: (w) => Math.round(w * 3/4) },
            { l: '16:9',  h: (w) => Math.round(w * 9/16) },
            { l: '3:2',   h: (w) => Math.round(w * 2/3) },
            { l: '9:16',  h: (w) => Math.round(w * 16/9) },
          ].map(({ l, h }) => (
            <button
              key={l}
              onClick={() => { if (h) { const w = +(p.fixedWidth || 400); up('fixedHeight', h(w)); up('layoutMode', 'fixed'); } else up('layoutMode', 'responsive'); }}
              style={{
                padding: '4px 8px', fontSize: 10, fontWeight: 600,
                border: `1.5px solid ${T.border}`, borderRadius: 5,
                cursor: 'pointer', background: T.light, color: T.textMid,
              }}
            >{l}</button>
          ))}
        </div>
      </PropSec>

      {/* ── 3. Fit & Position ── */}
      <PropSec title="Fit & Position">
        <SegCtrl
          label="Object Fit"
          val={p.objectFit || 'cover'}
          set={v => up('objectFit', v)}
          opts={[
            { v: 'cover',   l: 'Cover' },
            { v: 'contain', l: 'Contain' },
            { v: 'fill',    l: 'Stretch' },
            { v: 'none',    l: 'None' },
          ]}
        />
        <SegCtrl
          label="Focus Point"
          val={p.objectPosition || 'center'}
          set={v => up('objectPosition', v)}
          opts={[
            { v: 'top',    l: '↑ Top' },
            { v: 'center', l: '⊙ Center' },
            { v: 'bottom', l: '↓ Bottom' },
          ]}
        />
        <SegCtrl
          label="H. Focus"
          val={p.objectPositionX || 'center'}
          set={v => up('objectPositionX', v)}
          opts={[
            { v: 'left',   l: '← Left' },
            { v: 'center', l: '⊙ Center' },
            { v: 'right',  l: '→ Right' },
          ]}
        />
      </PropSec>

      {/* ── 4. Style ── */}
      <PropSec title="Style">
        <SliderInput label="Border Radius" val={+(p.borderRadius ?? 8)}  set={v => up('borderRadius', v)} min={0} max={100} unit="px" />
        <SliderInput label="Opacity"       val={+(p.opacity ?? 100)}      set={v => up('opacity', v)}      min={0} max={100} unit="%" />

        {/* CSS filter */}
        <SelectInput
          label="Filter"
          val={p.filter || 'none'}
          set={v => up('filter', v)}
          opts={[
            { v: 'none',       l: 'None' },
            { v: 'grayscale',  l: '⬛ Grayscale' },
            { v: 'sepia',      l: '🟤 Sepia' },
            { v: 'blur',       l: '🌫 Blur' },
            { v: 'brightness', l: '☀ Brightness' },
            { v: 'contrast',   l: '◑ Contrast' },
            { v: 'saturate',   l: '🎨 Saturate' },
            { v: 'invert',     l: '🔄 Invert' },
          ]}
        />
        {p.filter && p.filter !== 'none' && (
          <SliderInput
            label={`${p.filter.charAt(0).toUpperCase() + p.filter.slice(1)} Amount`}
            val={+(p.filterAmount ?? 100)}
            set={v => up('filterAmount', v)}
            min={0} max={p.filter === 'blur' ? 20 : 200}
            unit={p.filter === 'blur' ? 'px' : '%'}
          />
        )}

        {/* Box shadow */}
        <SelectInput
          label="Shadow"
          val={p.shadow || 'none'}
          set={v => up('shadow', v)}
          opts={[
            { v: 'none',                                   l: 'None' },
            { v: '0 2px 8px rgba(0,0,0,0.10)',             l: 'Soft' },
            { v: '0 4px 16px rgba(0,0,0,0.15)',            l: 'Medium' },
            { v: '0 8px 28px rgba(0,0,0,0.20)',            l: 'Strong' },
            { v: '0 16px 48px rgba(0,0,0,0.25)',           l: 'Heavy' },
            { v: '0 0 0 3px #6366f1',                      l: '🔵 Ring' },
            { v: '0 0 0 3px #10b981',                      l: '🟢 Ring Green' },
            { v: '0 0 0 3px #ef4444',                      l: '🔴 Ring Red' },
          ]}
        />

        {/* Mix blend */}
        <SelectInput
          label="Blend Mode"
          val={p.mixBlendMode || 'normal'}
          set={v => up('mixBlendMode', v)}
          opts={[
            { v: 'normal',      l: 'Normal' },
            { v: 'multiply',    l: 'Multiply' },
            { v: 'screen',      l: 'Screen' },
            { v: 'overlay',     l: 'Overlay' },
            { v: 'darken',      l: 'Darken' },
            { v: 'lighten',     l: 'Lighten' },
            { v: 'color-dodge', l: 'Color Dodge' },
            { v: 'color-burn',  l: 'Color Burn' },
            { v: 'hard-light',  l: 'Hard Light' },
            { v: 'soft-light',  l: 'Soft Light' },
          ]}
        />
      </PropSec>

      {/* ── 5. Link ── */}
      <PropSec title="Link (Clickable)">
        <Toggle val={p.linkEnabled || false} set={v => up('linkEnabled', v)} label="Make image clickable" />
        {p.linkEnabled && (
          <>
            <RInput label="URL" val={p.linkHref || ''} set={v => up('linkHref', v)} placeholder="https://…" />
            <SegCtrl
              label="Open in"
              val={p.linkTarget || '_self'}
              set={v => up('linkTarget', v)}
              opts={[{ v: '_self', l: 'Same Tab' }, { v: '_blank', l: 'New Tab' }]}
            />
          </>
        )}
      </PropSec>

      {/* ── 6. Next.js Loading ── */}
      <PropSec title="Loading & Performance">
        <Toggle
          val={p.priority || false}
          set={v => up('priority', v)}
          label="Priority (preload LCP image)"
        />
        {!p.priority && (
          <SegCtrl
            label="Loading Strategy"
            val={p.loading || 'lazy'}
            set={v => up('loading', v)}
            opts={[
              { v: 'lazy',  l: '💤 Lazy' },
              { v: 'eager', l: '⚡ Eager' },
            ]}
          />
        )}
        <Divider />
        <Toggle
          val={p.unoptimized || false}
          set={v => up('unoptimized', v)}
          label="Unoptimized (bypass Next.js)"
        />
        <InfoNote>
          {p.priority
            ? '⚡ Priority ON — image preloads immediately. Use for above-fold / hero images only.'
            : p.loading === 'lazy'
            ? '💤 Lazy — image loads when it enters viewport. Best for below-fold images.'
            : '⚡ Eager — image loads immediately. Use for critical visible images.'
          }
          {p.unoptimized ? ' · ⚠ Unoptimized is ON — Next.js will not compress or convert this image.' : isExternal ? '' : ' · Local images are auto-optimized by Next.js.'}
        </InfoNote>
        {!isExternal && !p.unoptimized && (
          <InfoNote>
            💡 For external URLs, add the domain to <code style={{ background: T.border, padding: '1px 4px', borderRadius: 3 }}>next.config.js</code> images.remotePatterns.
          </InfoNote>
        )}
      </PropSec>

      {/* ── 7. Spacing ── */}
      <PropSec title="Spacing">
        <SpacingBox
          label="Padding"
          top={+(p.padTop    ?? 0)} right={+(p.padRight  ?? 0)}
          bottom={+(p.padBottom ?? 0)} left={+(p.padLeft   ?? 0)}
          setTop={v    => up('padTop',    v)} setRight={v  => up('padRight',  v)}
          setBottom={v => up('padBottom', v)} setLeft={v   => up('padLeft',   v)}
        />
        <Divider />
        <SpacingBox
          label="Margin"
          top={+(p.marginTop    ?? 0)} right={+(p.marginRight  ?? 0)}
          bottom={+(p.marginBottom ?? 0)} left={+(p.marginLeft   ?? 0)}
          setTop={v    => up('marginTop',    v)} setRight={v  => up('marginRight',  v)}
          setBottom={v => up('marginBottom', v)} setLeft={v   => up('marginLeft',   v)}
        />
      </PropSec>
    </>
  );
}

