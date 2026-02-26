import FooterTextElement from './FooterTextElement';
import SocialLinksElement from './SocialLinksElement';
import FooterLinksElement from './FooterLinksElement';
import FooterLogoElement from './FooterLogoElement';

export const footerElementMap = {
  footerLogo: {
    component: FooterLogoElement,
    label: 'Logo',
    icon: '⊙',
    color: '#6366f1',
    defaultProps: { text: 'Brand', fontSize: 20, fontWeight: '700', color: '#0f172a' },
  },
  footerText: {
    component: FooterTextElement,
    label: 'Footer Text',
    icon: '¶',
    color: '#64748b',
    defaultProps: {
      content: '© 2024 Brand. All rights reserved.',
      fontSize: 13,
      color: '#64748b',
      textAlign: 'left',
    },
  },
  socialLinks: {
    component: SocialLinksElement,
    label: 'Social Links',
    icon: '🔗',
    color: '#0ea5e9',
    defaultProps: {
      links: [
        { id: '1', platform: 'twitter', href: '#', label: 'Twitter' },
        { id: '2', platform: 'facebook', href: '#', label: 'Facebook' },
        { id: '3', platform: 'instagram', href: '#', label: 'Instagram' },
      ],
      size: 20,
      color: '#64748b',
      gap: 16,
    },
  },
  footerLinks: {
    component: FooterLinksElement,
    label: 'Footer Links',
    icon: '☰',
    color: '#10b981',
    defaultProps: {
      title: 'Quick Links',
      items: [
        { id: '1', label: 'About Us', href: '/about-us' },
        { id: '2', label: 'Contact', href: '/contact' },
        { id: '3', label: 'Privacy Policy', href: '/privacy' },
      ],
      titleSize: 14,
      titleColor: '#0f172a',
      linkSize: 13,
      linkColor: '#64748b',
      gap: 8,
    },
  },
};
