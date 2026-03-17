import HeadingElement        from './HeadingElement';
import TextElement           from './TextElement';
import ImageElement          from './ImageElement';
import ButtonElement         from './ButtonElement';
import DividerElement        from './DividerElement';
import VideoElement          from './VideoElement';
import HtmlElement           from './HtmlElement';
import ProductCardElement    from './ProductCardElement';
import ProductGridElement    from './ProductGridElement';
import CountdownTimerElement from './CountdownTimerElement';
import BadgeElement          from './BadgeElement';
import RatingElement         from './RatingElement';
import TestimonialElement    from './TestimonialElement';
import ImageSliderElement    from './ImageSliderElement';
import AnnouncementBarElement from './AnnouncementBarElement';
import PriceTagElement       from './PriceTagElement';
import AddToCartElement      from './AddToCartElement';

export const pageElementMap = {

  // ── Typography ─────────────────────────────────────────────
  heading: {
    component: HeadingElement,
    label: 'Heading', icon: 'H', color: '#8b5cf6', group: 'Typography',
    defaultProps: { content: 'Your Heading Here', tag: 'h2', fontSize: 32, fontWeight: '700', color: '#0f172a', textAlign: 'left', lineHeight: 1.2 },
  },
  text: {
    component: TextElement,
    label: 'Text', icon: '¶', color: '#0ea5e9', group: 'Typography',
    defaultProps: { content: 'Write your text content here.', fontSize: 16, fontWeight: '400', color: '#334155', textAlign: 'left', lineHeight: 1.7 },
  },

  // ── Media ──────────────────────────────────────────────────
  image: {
    component: ImageElement,
    label: 'Image', icon: '🖼', color: '#10b981', group: 'Media',
    defaultProps: { src: '', alt: 'Image', layoutMode: 'responsive', width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 },
  },
  video: {
    component: VideoElement,
    label: 'Video', icon: '▶', color: '#ef4444', group: 'Media',
    defaultProps: { src: '', poster: '', width: '100%', borderRadius: 8, controls: true },
  },
  'image-slider': {
    component: ImageSliderElement,
    label: 'Slider', icon: '🎠', color: '#8b5cf6', group: 'Media',
    defaultProps: {
      height: 400, borderRadius: 0, objectFit: 'cover',
      showArrows: true, showDots: true, showCaptions: true, autoplay: false, interval: 4,
      slides: [
        { src: '', caption: 'Slide 1', link: '' },
        { src: '', caption: 'Slide 2', link: '' },
      ],
    },
  },

  // ── Interactive ────────────────────────────────────────────
  button: {
    component: ButtonElement,
    label: 'Button', icon: '⬚', color: '#f59e0b', group: 'Interactive',
    defaultProps: { text: 'Click Me', href: '#', bg: '#6366f1', color: '#ffffff', fontSize: 14, fontWeight: '600', borderRadius: 8, padH: 24, padV: 12, align: 'left' },
  },
  'add-to-cart': {
    component: AddToCartElement,
    label: 'Add to Cart', icon: '🛒', color: '#10b981', group: 'Interactive',
    defaultProps: { text: 'Add to Cart', bg: '#10b981', color: '#ffffff', fontSize: 15, fontWeight: 700, borderRadius: 8, padV: 14, padH: 28, showIcon: true, fullWidth: false },
  },

  // ── E-Commerce ─────────────────────────────────────────────
  'product-card': {
    component: ProductCardElement,
    label: 'Product Card', icon: '🛍', color: '#6366f1', group: 'E-Commerce',
    defaultProps: {
      title: 'Premium Product', category: 'Category',
      price: 49.99, salePrice: 34.99, currency: '$',
      imageSrc: '', imageHeight: 220, maxWidth: 280,
      borderRadius: 12, cardBg: '#ffffff', borderColor: '#e2e8f0',
      accentColor: '#6366f1', priceColor: '#0f172a', salePriceColor: '#ef4444',
      showDiscount: true, showRating: true, rating: 4, reviewCount: '(128)',
      showWishlist: true, showCartBtn: true,
      btnText: 'Add to Cart', btnBg: '#6366f1', btnColor: '#ffffff', btnRadius: 8, btnFontSize: 13,
      badgeText: 'SALE', badgeColor: '#ef4444', padding: 14,
    },
  },
  'product-grid': {
    component: ProductGridElement,
    label: 'Product Grid', icon: '⊞', color: '#6366f1', group: 'E-Commerce',
    defaultProps: {
      dataSource: 'all',
      limit: 8,
      columns: 3,
      gap: 20,
      padH: 0, padV: 0,
      imageHeight: 220,
      cardRadius: 12,
      cardPadding: 14,
      cardBg: '#ffffff',
      cardBorder: '#e2e8f0',
      accentColor: '#6366f1',
      priceSize: 16,
      titleSize: 13,
      showRating: true,
      showDiscount: true,
      showWishlist: false,
      showCartBtn: true,
      btnText: 'Add to Cart',
      btnBg: '#6366f1',
      btnColor: '#ffffff',
      btnRadius: 8,
      btnFontSize: 12,
      sectionTitle: '',
      sectionSubtitle: '',
      titleAlign: 'left',
      showViewAll: false,
      viewAllText: 'View All Products',
      viewAllHref: '#',
    },
  },
  'price-tag': {
    component: PriceTagElement,
    label: 'Price Tag', icon: '💲', color: '#ef4444', group: 'E-Commerce',
    defaultProps: { price: '49.99', originalPrice: '79.99', salePrice: '34.99', currency: '$', priceSize: 28, priceColor: '#0f172a', salePriceColor: '#ef4444', showDiscount: true },
  },
  badge: {
    component: BadgeElement,
    label: 'Badge', icon: '🏷', color: '#ef4444', group: 'E-Commerce',
    defaultProps: { text: 'NEW', bg: '#10b981', color: '#fff', variant: 'solid', fontSize: 11, borderRadius: 99, padV: 4, padH: 10, uppercase: true },
  },
  rating: {
    component: RatingElement,
    label: 'Rating', icon: '⭐', color: '#f59e0b', group: 'E-Commerce',
    defaultProps: { rating: 4, maxRating: 5, size: 18, gap: 2, starColor: '#f59e0b', emptyColor: '#e2e8f0', showValue: true, reviewText: '(128 reviews)', fontSize: 13 },
  },
  testimonial: {
    component: TestimonialElement,
    label: 'Testimonial', icon: '💬', color: '#8b5cf6', group: 'E-Commerce',
    defaultProps: {
      text: 'This product exceeded my expectations. The quality is incredible!',
      name: 'Sarah Johnson', role: 'Verified Buyer', avatarSrc: '',
      rating: 5, showRating: true, showQuoteIcon: true, verifiedBuyer: true,
      bg: '#ffffff', borderRadius: 16, padding: 24, textSize: 14, italic: true, accentColor: '#6366f1',
    },
  },
  'countdown-timer': {
    component: CountdownTimerElement,
    label: 'Countdown', icon: '⏱', color: '#f59e0b', group: 'E-Commerce',
    defaultProps: {
      label: '🔥 Sale ends in:',
      targetDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
      showDays: true, boxBg: '#0f172a', numColor: '#fff', labelColor: '#334155',
      numSize: 28, boxSize: 64, boxRadius: 8, gap: 10, labelSize: 15, endText: 'Sale has ended!',
    },
  },
  'announcement-bar': {
    component: AnnouncementBarElement,
    label: 'Announcement', icon: '📢', color: '#0f172a', group: 'E-Commerce',
    defaultProps: { text: '🎉 Free shipping on orders over $50!', bg: '#0f172a', color: '#ffffff', fontSize: 13, padV: 10, padH: 20, ctaText: 'Shop Now →', ctaHref: '#', ctaColor: '#fbbf24' },
  },

  // ── Layout ─────────────────────────────────────────────────
  divider: {
    component: DividerElement,
    label: 'Divider', icon: '—', color: '#94a3b8', group: 'Layout',
    defaultProps: { style: 'solid', color: '#e2e8f0', thickness: 1, width: '100%', marginV: 8 },
  },

  // ── Advanced ───────────────────────────────────────────────
  html: {
    component: HtmlElement,
    label: 'HTML', icon: '</>', color: '#6366f1', group: 'Advanced',
    defaultProps: { code: '<p>Custom HTML here</p>' },
  },
};
