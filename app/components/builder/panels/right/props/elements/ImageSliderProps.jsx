'use client';
import { useRef } from 'react';
import { PropSec, FL, RInput, NumberInput, SliderInput, SegCtrl, Toggle, ColorPick, Divider } from '../../../../../shared/ui';
import { T } from '../../../../../../constants/theme';

function SlideEditor({ slides = [], set }) {
  const fileRefs = useRef({});

  const update = (i, key, val) => {
    const next = slides.map((s, idx) => idx === i ? { ...s, [key]: val } : s);
    set(next);
  };
  const addSlide = () => set([...slides, { src: '', caption: '', link: '' }]);
  const removeSlide = (i) => set(slides.filter((_, idx) => idx !== i));
  const handleFile = (i, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => update(i, 'src', ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {slides.map((slide, i) => (
        <div key={i} style={{ background: T.light, borderRadius: 10, padding: 10, border: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.textMid }}>Slide {i + 1}</span>
            {slides.length > 1 && (
              <button onClick={() => removeSlide(i)} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>✕ Remove</button>
            )}
          </div>
          {/* Image */}
          {slide.src ? (
            <div style={{ position: 'relative', marginBottom: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.src} alt="" style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 7, border: `1px solid ${T.border}` }} />
              <button onClick={() => update(i, 'src', '')} style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 4, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer' }}>✕</button>
            </div>
          ) : (
            <div onClick={() => fileRefs.current[i]?.click()} style={{ height: 60, background: '#fff', border: `2px dashed ${T.border}`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, color: T.textLight, marginBottom: 6 }}>
              + Upload Image
            </div>
          )}
          <RInput val={slide.src || ''} set={v => update(i, 'src', v)} placeholder="or paste image URL…" />
          <RInput val={slide.caption || ''} set={v => update(i, 'caption', v)} placeholder="Caption (optional)" />
          <RInput val={slide.link || ''} set={v => update(i, 'link', v)} placeholder="Link URL (optional)" />
          <input ref={el => fileRefs.current[i] = el} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(i, e)} />
        </div>
      ))}
      <button onClick={addSlide} style={{ padding: '8px 0', fontSize: 12, fontWeight: 600, border: `1.5px dashed ${T.primary}`, borderRadius: 8, background: `${T.primary}08`, color: T.primary, cursor: 'pointer' }}>
        + Add Slide
      </button>
    </div>
  );
}

export function ImageSliderProps({ el, onChange }) {
  const p = el.props || {};
  const up = (k, v) => onChange({ [k]: v });
  return (
    <>
      <PropSec title="Slides">
        <SlideEditor slides={p.slides || []} set={v => up('slides', v)} />
      </PropSec>
      <PropSec title="Display">
        <SliderInput label="Height" val={+(p.height || 400)} set={v => up('height', v)} min={100} max={800} unit="px" />
        <SliderInput label="Border Radius" val={+(p.borderRadius || 0)} set={v => up('borderRadius', v)} min={0} max={40} unit="px" />
        <SegCtrl label="Object Fit" val={p.objectFit || 'cover'} set={v => up('objectFit', v)} opts={[{v:'cover',l:'Cover'},{v:'contain',l:'Contain'},{v:'fill',l:'Fill'}]} />
      </PropSec>
      <PropSec title="Controls">
        <Toggle val={p.showArrows !== false} set={v => up('showArrows', v)} label="Show Arrows" />
        <Toggle val={p.showDots !== false} set={v => up('showDots', v)} label="Show Dots" />
        <Toggle val={p.showCaptions !== false} set={v => up('showCaptions', v)} label="Show Captions" />
        <Divider />
        <Toggle val={p.autoplay || false} set={v => up('autoplay', v)} label="Autoplay" />
        {p.autoplay && <NumberInput label="Interval (seconds)" val={+(p.interval || 4)} set={v => up('interval', v)} min={1} max={20} unit="s" />}
      </PropSec>
    </>
  );
}
