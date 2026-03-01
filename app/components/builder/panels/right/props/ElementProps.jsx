'use client';
import { Settings } from 'lucide-react';
import { HeadingTextProps } from './elements/HeadingTextProps';
import { ImageProps }       from './elements/ImageProps';
import { ButtonProps }      from './elements/ButtonProps';
import { NavProps }         from './elements/NavProps';

/**
 * Routes to the correct element props panel based on el.type.
 * To add a new element type: import its props component and add a case below.
 *
 * Props:
 *  el          – element object { id, type, props }
 *  elementMap  – global element map
 *  onChange    – (patch) => void
 */
export function ElementProps({ el, elementMap, onChange }) {
  switch (el.type) {
    case 'heading':
    case 'text':
      return <HeadingTextProps el={el} onChange={onChange} />;

    case 'image':
      return <ImageProps el={el} onChange={onChange} />;

    case 'button':
    case 'cta':
      return <ButtonProps el={el} onChange={onChange} />;

    case 'nav':
      return <NavProps el={el} onChange={onChange} />;

    default:
      return (
        <div style={{ padding: 20, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
          <Settings size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
          <p>No properties available for this element type.</p>
          <p style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>type: {el.type}</p>
        </div>
      );
  }
}
