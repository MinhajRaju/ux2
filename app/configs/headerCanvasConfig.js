import { headerElementMap } from '../elements/header/headerElementMap';

export const headerCanvasConfig = {
  singleSection: true,
  allowMultipleSections: false,
  elementMap: headerElementMap,
  defaultState: {
    sections: [{
      id: 'header-section-1',
      type: 'section',
      settings: { label: 'Header Section', bg: '#ffffff', visible: true, padV: 0, padH: 0 },
      rows: [],
    }],
  },
};
