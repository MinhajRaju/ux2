import HeadingElement from './HeadingElement';
import TextElement from './TextElement';
import ImageElement from './ImageElement';
import ButtonElement from './ButtonElement';
import DividerElement from './DividerElement';
import VideoElement from './VideoElement';
import HtmlElement from './HtmlElement';

export const pageElementMap = {
  heading: {
    component: HeadingElement,
    label: 'Heading',
    icon: 'H',
    color: '#8b5cf6',
    defaultProps: {
      content: 'Your Heading Here',
      tag: 'h2',
      fontSize: 32,
      fontWeight: '700',
      color: '#0f172a',
      textAlign: 'left',
      lineHeight: 1.2,
    },
  },
  text: {
    component: TextElement,
    label: 'Text',
    icon: '¶',
    color: '#0ea5e9',
    defaultProps: {
      content: 'Write your text content here. Click to edit.',
      fontSize: 16,
      fontWeight: '400',
      color: '#334155',
      textAlign: 'left',
      lineHeight: 1.7,
    },
  },
  image: {
    component: ImageElement,
    label: 'Image',
    icon: '🖼',
    color: '#10b981',
    defaultProps: {
      src: '',
      alt: 'Image',
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: 8,
    },
  },
  button: {
    component: ButtonElement,
    label: 'Button',
    icon: '⬚',
    color: '#f59e0b',
    defaultProps: {
      text: 'Click Me',
      href: '#',
      bg: '#6366f1',
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
      borderRadius: 8,
      padH: 24,
      padV: 12,
      align: 'left',
    },
  },
  divider: {
    component: DividerElement,
    label: 'Divider',
    icon: '—',
    color: '#94a3b8',
    defaultProps: {
      style: 'solid',
      color: '#e2e8f0',
      thickness: 1,
      width: '100%',
      marginV: 8,
    },
  },
  video: {
    component: VideoElement,
    label: 'Video',
    icon: '▶',
    color: '#ef4444',
    defaultProps: {
      src: '',
      poster: '',
      width: '100%',
      borderRadius: 8,
      controls: true,
    },
  },
  html: {
    component: HtmlElement,
    label: 'HTML',
    icon: '</>',
    color: '#6366f1',
    defaultProps: {
      code: '<p>Custom HTML here</p>',
    },
  },
};
