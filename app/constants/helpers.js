import { v4 as uuidv4 } from 'uuid';

export const genId = () => uuidv4();

export function makeSection(overrides = {}) {
  return {
    id: genId(),
    type: 'section',
    settings: {
      label: 'Section',
      bg: '#ffffff',
      padV: 0,
      padH: 0,
      visible: true,
    },
    rows: [],
    ...overrides,
  };
}

export function makeRow(overrides = {}) {
  return {
    id: genId(),
    type: 'row',
    settings: {
      label: 'Row',
      bg: '#ffffff',
      bgType: 'color',
      height: 80,
      minHeight: 60,
      maxWidth: 1280,
      widthMode: 'boxed',
      padH: 32,
      colGap: 20,
      elGap: 12,
      visible: true,
    },
    columns: [],
    colWidths: [],
    ...overrides,
  };
}

export function makeColumn(overrides = {}) {
  return {
    id: genId(),
    type: 'column',
    settings: {
      bg: '',
      padV: 8,
      padH: 12,
      align: 'flex-start',
      valign: 'center',
      gap: 12,
    },
    elements: [],
    ...overrides,
  };
}

export function makeElement(type, defaultProps = {}) {
  return {
    id: genId(),
    type,
    props: { ...defaultProps },
  };
}

export function propsToStyle(props) {
  if (!props) return {};
  const style = {};
  if (props.padding) {
    const p = props.padding;
    style.padding = `${p.top || 0}px ${p.right || 0}px ${p.bottom || 0}px ${p.left || 0}px`;
  }
  if (props.margin) {
    const m = props.margin;
    style.margin = `${m.top || 0}px ${m.right || 0}px ${m.bottom || 0}px ${m.left || 0}px`;
  }
  return style;
}
