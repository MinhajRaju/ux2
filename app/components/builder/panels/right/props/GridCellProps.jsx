'use client';
/**
 * GridCellProps.jsx — Right-panel for a selected Grid Cell.
 * Sections: Position & Span, Style, Spacing, Background
 */
import {
  PropSec, FL, NumberInput, SelectInput, ColorPick,
  SegCtrl, SpacingBox, Divider, Toggle, BackgroundEditor,
} from '../../../../shared/ui';
import { T } from '../../../../../constants/theme';

export function GridCellProps({ cell, grid, onChangeCellSettings, onChangeCellSpan }) {
  const cs = cell.settings || {};
  const gs = grid?.settings || {};
  const up = (k, v) => onChangeCellSettings({ [k]: v });

  const cols = gs.columns || 3;
  const rows = gs.rows || 2;

  return (
    <>
      {/* 1 — Position & Span */}
      <PropSec title="Position & Span">
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, lineHeight: 1.5 }}>
          Set where this cell starts and how many columns/rows it spans.
          Grid is <strong>{cols}×{rows}</strong>.
        </div>

        {/* Visual span preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 24px)`,
          gap: 3, marginBottom: 12, padding: 8,
          background: '#f8fafc', borderRadius: 8, border: `1px solid ${T.border}`,
        }}>
          {Array.from({ length: cols * rows }).map((_, idx) => {
            const col = (idx % cols) + 1;
            const row = Math.floor(idx / cols) + 1;
            const isInCell =
              col >= (cell.colStart || 1) && col < (cell.colEnd || 2) &&
              row >= (cell.rowStart || 1) && row < (cell.rowEnd || 2);
            return (
              <div key={idx} style={{
                background: isInCell ? '#6366f1' : '#e2e8f0',
                borderRadius: 3,
                transition: 'background 0.2s',
              }} />
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <NumberInput
            label="Col Start" val={cell.colStart || 1}
            set={v => onChangeCellSpan({ colStart: Math.max(1, Math.min(v, cols)) })}
            min={1} max={cols} unit=""
          />
          <NumberInput
            label="Col End" val={cell.colEnd || 2}
            set={v => onChangeCellSpan({ colEnd: Math.max((cell.colStart||1)+1, Math.min(v, cols+1)) })}
            min={(cell.colStart||1)+1} max={cols+1} unit=""
          />
          <NumberInput
            label="Row Start" val={cell.rowStart || 1}
            set={v => onChangeCellSpan({ rowStart: Math.max(1, Math.min(v, rows)) })}
            min={1} max={rows} unit=""
          />
          <NumberInput
            label="Row End" val={cell.rowEnd || 2}
            set={v => onChangeCellSpan({ rowEnd: Math.max((cell.rowStart||1)+1, Math.min(v, rows+1)) })}
            min={(cell.rowStart||1)+1} max={rows+1} unit=""
          />
        </div>

        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
          Spans: {(cell.colEnd||2)-(cell.colStart||1)} col × {(cell.rowEnd||2)-(cell.rowStart||1)} row
        </div>
      </PropSec>

      {/* 2 — Layout */}
      <PropSec title="Layout">
        <SegCtrl
          label="Align (horizontal)"
          val={cs.align || 'flex-start'}
          set={v => up('align', v)}
          opts={[
            { v: 'flex-start', l: '⬡ Start' },
            { v: 'center',     l: '⊙ Center' },
            { v: 'flex-end',   l: '⬡ End' },
          ]}
        />
        <SegCtrl
          label="Valign (vertical)"
          val={cs.valign || 'flex-start'}
          set={v => up('valign', v)}
          opts={[
            { v: 'flex-start', l: 'Top' },
            { v: 'center',     l: 'Mid' },
            { v: 'flex-end',   l: 'Bot' },
          ]}
        />
        <NumberInput label="Min Height" val={cs.minHeight != null ? +cs.minHeight : ''} set={v => up('minHeight', v)} min={0} max={1200} unit="px" />
        <NumberInput label="Element Gap" val={cs.gap ?? 10} set={v => up('gap', v)} min={0} max={60} unit="px" />
      </PropSec>

      {/* 3 — Spacing */}
      <PropSec title="Spacing">
        <SpacingBox
          label="Padding"
          top={+(cs.padTop ?? 16)} right={+(cs.padRight ?? 16)} bottom={+(cs.padBottom ?? 16)} left={+(cs.padLeft ?? 16)}
          setTop={v => up('padTop', v)} setRight={v => up('padRight', v)}
          setBottom={v => up('padBottom', v)} setLeft={v => up('padLeft', v)}
        />
      </PropSec>

      {/* 4 — Style */}
      <PropSec title="Style">
        <NumberInput label="Border Radius" val={+(cs.radius ?? 0)} set={v => up('radius', v)} min={0} max={80} unit="px" />
        <SelectInput
          label="Shadow"
          val={cs.shadow || 'none'}
          set={v => up('shadow', v)}
          opts={[
            { v: 'none', l: 'None' },
            { v: 'sm',   l: 'Small' },
            { v: 'md',   l: 'Medium' },
            { v: 'lg',   l: 'Large' },
            { v: 'xl',   l: 'X-Large' },
          ]}
        />
        <Divider />
        <SelectInput
          label="Border Style"
          val={cs.borderStyle || 'none'}
          set={v => up('borderStyle', v)}
          opts={[
            { v: 'none',   l: 'None' },
            { v: 'solid',  l: 'Solid' },
            { v: 'dashed', l: 'Dashed' },
            { v: 'dotted', l: 'Dotted' },
          ]}
        />
        {cs.borderStyle && cs.borderStyle !== 'none' && (
          <>
            <NumberInput label="Border Width" val={+(cs.borderWidth ?? 1)} set={v => up('borderWidth', v)} min={1} max={12} unit="px" />
            <ColorPick label="Border Color" val={cs.borderColor || '#e2e8f0'} set={v => up('borderColor', v)} />
          </>
        )}
      </PropSec>

      {/* 5 — Background */}
      <BackgroundEditor s={cs} up={up} />
    </>
  );
}
