'use client';
import { Settings } from 'lucide-react';
import { HeadingTextProps }      from './elements/HeadingTextProps';
import { ImageProps }            from './elements/ImageProps';
import { ButtonProps }           from './elements/ButtonProps';
import { NavProps }              from './elements/NavProps';
import { ProductCardProps }      from './elements/ProductCardProps';
import { ProductGridProps }      from './elements/ProductGridProps';
import { CountdownTimerProps }   from './elements/CountdownTimerProps';
import { BadgeProps }            from './elements/BadgeProps';
import { RatingProps }           from './elements/RatingProps';
import { TestimonialProps }      from './elements/TestimonialProps';
import { ImageSliderProps }      from './elements/ImageSliderProps';
import { AnnouncementBarProps }  from './elements/AnnouncementBarProps';
import { PriceTagProps }         from './elements/PriceTagProps';
import { AddToCartProps }        from './elements/AddToCartProps';

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
    case 'product-card':
      return <ProductCardProps el={el} onChange={onChange} />;
    case 'product-grid':
      return <ProductGridProps el={el} onChange={onChange} />;
    case 'countdown-timer':
      return <CountdownTimerProps el={el} onChange={onChange} />;
    case 'badge':
      return <BadgeProps el={el} onChange={onChange} />;
    case 'rating':
      return <RatingProps el={el} onChange={onChange} />;
    case 'testimonial':
      return <TestimonialProps el={el} onChange={onChange} />;
    case 'image-slider':
      return <ImageSliderProps el={el} onChange={onChange} />;
    case 'announcement-bar':
      return <AnnouncementBarProps el={el} onChange={onChange} />;
    case 'price-tag':
      return <PriceTagProps el={el} onChange={onChange} />;
    case 'add-to-cart':
      return <AddToCartProps el={el} onChange={onChange} />;
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
