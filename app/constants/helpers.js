import { v4 as uuidv4 } from 'uuid';

export const genId = () => uuidv4();

export function makeSection(overrides = {}) {
  return {
    id: genId(),
    type: 'section',
    settings: {
      label: 'Section',
      bg: '#ffffff',
      bgType: 'color',
      // Support both shorthand (padV/padH) and individual keys.
      // StructureRenderer reads padV; SectionProps writes padTop/padBottom.
      padTop:    0,
      padBottom: 0,
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

/**
 * Standard column settings schema.
 * These keys are used by:
 *  - CanvasColumn (edit mode)
 *  - ColView / StructureRenderer (preview mode)
 *  - ColProps (right panel editor)
 * Never change key names without updating all three.
 */
export function makeColumn(overrides = {}) {
  return {
    id: genId(),
    type: 'column',
    settings: {
      // Layout
      align:   'flex-start',
      valign:  'flex-start',
      // Padding (individual keys — ColProps writes these)
      padTop:    8,
      padBottom: 8,
      padLeft:   12,
      padRight:  12,
      // Gap between elements
      gap: 12,
      // Background
      bgType: 'color',
      bg: '',
      // Border
      borderStyle: 'none',
      borderWidth: 1,
      borderColor: '#e2e8f0',
      radius: 0,
      // Shadow
      shadow: 'none',
      // Size
      minHeight: '',
      opacity: 100,
    },
    elements: [],
    // columns[] added dynamically when "Make Row" is used
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

export function makeGridCell(overrides = {}) {
  return {
    id: genId(),
    colStart: 1,
    colEnd: 2,
    rowStart: 1,
    rowEnd: 2,
    settings: {
      bg: '',
      bgType: 'color',
      padTop: 16, padBottom: 16, padLeft: 16, padRight: 16,
      radius: 0,
      shadow: 'none',
      align: 'flex-start',
      valign: 'flex-start',
      minHeight: '',
      borderStyle: 'none',
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    elements: [],
    ...overrides,
  };
}

export function makeGrid(overrides = {}) {
  return {
    id: genId(),
    type: 'grid',
    settings: {
      label: 'Grid',
      columns: 3,
      rows: 2,
      colGap: 16,
      rowGap: 16,
      padTop: 16, padBottom: 16, padLeft: 16, padRight: 16,
      bgType: 'color',
      bg: '',
      tabletColumns: 2,
      mobileColumns: 1,
      maxWidth: 1280,
      widthMode: 'boxed',
      visible: true,
    },
    cells: [],
    ...overrides,
  };
}
