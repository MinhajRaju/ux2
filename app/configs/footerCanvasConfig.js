import { footerElementMap } from '../elements/footer/footerElementMap';

export const footerCanvasConfig = {
  singleSection: true,
  allowMultipleSections: false,
  elementMap: footerElementMap,
  defaultState: {
    sections: [{
      id: 'footer-section-1',
      type: 'section',
      settings: { label: 'Footer Section', bg: '#1e293b', visible: true, padV: 0, padH: 0 },
      rows: [],
    }],
  },
};
