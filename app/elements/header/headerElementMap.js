import LogoElement from './LogoElement';
import NavMenuElement from './NavMenuElement';
import SearchBarElement from './SearchBarElement';
import CTAButtonElement from './CTAButtonElement';
import AccountIconElement from './AccountIconElement';
import CartIconElement from './CartIconElement';

export const headerElementMap = {
  logo: {
    component: LogoElement,
    label: 'Logo',
    icon: '⊙',
    color: '#6366f1',
    defaultProps: { text: 'Brand', fontSize: 22, fontWeight: '700', color: '#0f172a', src: '' },
  },
  nav: {
    component: NavMenuElement,
    label: 'Nav Menu',
    icon: '≡',
    color: '#6366f1',
    defaultProps: {
      items: [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'About', href: '/about-us' },
        { id: '3', label: 'Contact', href: '/contact' },
      ],
      gap: 28,
      fontSize: 14,
      color: '#334155',
      fontWeight: '500',
    },
  },
  search: {
    component: SearchBarElement,
    label: 'Search Bar',
    icon: '🔍',
    color: '#8b5cf6',
    defaultProps: { placeholder: 'Search...', width: 220, borderRadius: 8 },
  },
  cta: {
    component: CTAButtonElement,
    label: 'CTA Button',
    icon: '⬛',
    color: '#f59e0b',
    defaultProps: {
      text: 'Get Started',
      bg: '#6366f1',
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
      borderRadius: 8,
      padH: 18,
      padV: 9,
    },
  },
  account: {
    component: AccountIconElement,
    label: 'Account',
    icon: '👤',
    color: '#10b981',
    defaultProps: { size: 22, color: '#334155' },
  },
  cart: {
    component: CartIconElement,
    label: 'Cart',
    icon: '🛒',
    color: '#f59e0b',
    defaultProps: { size: 22, color: '#334155', showCount: true, count: 0 },
  },
};
