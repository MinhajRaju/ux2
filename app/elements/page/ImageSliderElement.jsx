'use client';
import { useState, useEffect, useCallback } from 'react';

export default function ImageSliderElement({ props, mode, onSelect, isSelected }) {
  const p = props || {};
  const slides = p.slides?.length ? p.slides : [
    { src: '', caption: 'Slide 1', link: '' },
    { src: '', caption: 'Slide 2', link: '' },
    { src: '', caption: 'Slide 3', link: '' },
  ];
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!p.autoplay || mode === 'edit') return;
    const id = setInterval(next, (p.interval || 3) * 1000);
    return () => clearInterval(id);
  }, [p.autoplay, p.interval, mode, next]);

  const slide = slides[current] || {};
  const h = (p.height || 400) + 'px';

  return (
    <div
      onClick={mode === 'edit' ? onSelect : undefined}
      style={{
        cursor: mode === 'edit' ? 'pointer' : 'default',
        outline: mode === 'edit' && isSelected ? '2px solid #6366f1' : 'none',
        outlineOffset: -2,
        position: 'relative', width: '100%', height: h,
        overflow: 'hidden', borderRadius: (p.borderRadius || 0) + 'px',
        background: '#0f172a',
        userSelect: 'none',
      }}
    >
      {/* Image */}
      {slide.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={slide.src} alt={slide.caption || ''}
          style={{ width: '100%', height: '100%', objectFit: p.objectFit || 'cover', display: 'block', transition: 'opacity 0.4s' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: `hsl(${220 + current * 30},60%,${15 + current * 5}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#64748b" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" fill="#64748b"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke="#64748b" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          <span style={{ color: '#64748b', fontSize: 13 }}>{slide.caption || `Slide ${current + 1}`}</span>
        </div>
      )}

      {/* Overlay */}
      {(slide.caption && p.showCaptions !== false) && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '32px 20px 16px', color: '#fff', fontSize: (p.captionSize || 16) + 'px', fontWeight: 600 }}>
          {slide.caption}
        </div>
      )}

      {/* Arrows */}
      {p.showArrows !== false && slides.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); prev(); }} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={e => { e.stopPropagation(); next(); }} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </>
      )}

      {/* Dots */}
      {p.showDots !== false && slides.length > 1 && (
        <div style={{ position: 'absolute', bottom: (slide.caption && p.showCaptions !== false) ? 48 : 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
              style={{ width: i === current ? 20 : 8, height: 8, borderRadius: 4, background: i === current ? '#fff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }} />
          ))}
        </div>
      )}
    </div>
  );
}
