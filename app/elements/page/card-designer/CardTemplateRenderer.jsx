'use client';
import { pdElementMap, PdImageElement } from './pdElementMap';

const aFlex = a => a === 'center' ? 'center' : a === 'right' ? 'flex-end' : 'flex-start';

function ElemView({ el, product, dense }) {
  const def = pdElementMap[el.type];
  if (!def) return null;
  const Comp = def.component;
  const p = el.props || {};
  const gap = dense ? 0 : 1;
  return (
    <div style={{
      display: 'flex', justifyContent: aFlex(p._align || 'left'),
      paddingTop:    (p._padTop    ?? 0) + 'px',
      paddingBottom: (p._padBottom ?? 0) + 'px',
      paddingLeft:   (p._padLeft   ?? 0) + 'px',
      paddingRight:  (p._padRight  ?? 0) + 'px',
      boxSizing: 'border-box', width: '100%',
    }}>
      {el.type === 'pd-image'
        ? <PdImageElement product={product} props={p} overlays={[]} />
        : <Comp product={product} props={p} />}
    </div>
  );
}

export default function CardTemplateRenderer({ template, product, dense = false }) {
  if (!template?.rows?.length) return null;
  return (
    <div style={{
      background: template.cardBg || '#ffffff',
      borderRadius: (template.cardRadius ?? 12) + 'px',
      border: `1px solid ${template.cardBorder || '#e2e8f0'}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: 'inherit',
    }}>
      {template.rows.map(row => {
        const rs = row.settings || {};
        const pT = dense ? Math.max(0, (rs.padTop    ?? 0) - 4) : (rs.padTop    ?? 0);
        const pB = dense ? Math.max(0, (rs.padBottom ?? 0) - 4) : (rs.padBottom ?? 0);
        const pL = rs.padLeft ?? rs.padH ?? 0;
        const pR = rs.padRight ?? rs.padH ?? 0;
        const gap = dense ? Math.max(0, (rs.colGap || 0) - 4) : (rs.colGap || 0);
        return (
          <div key={row.id} style={{ display: 'flex', flexDirection: 'row', gap: gap + 'px', background: rs.bg || 'transparent', paddingTop: pT, paddingBottom: pB, paddingLeft: pL, paddingRight: pR }}>
            {row.columns.map((col, ci) => {
              const s = col.settings || {};
              return (
                <div key={col.id} style={{ flex: `0 0 ${row.colWidths?.[ci] ?? 100}%`, maxWidth: `${row.colWidths?.[ci] ?? 100}%`, minWidth: 0, display: 'flex', flexDirection: 'column', gap: (s.gap ?? 0) + 'px', paddingTop: s.padTop ?? 0, paddingBottom: s.padBottom ?? 0, paddingLeft: s.padLeft ?? 0, paddingRight: s.padRight ?? 0, background: s.bg || 'transparent', boxSizing: 'border-box' }}>
                  {(col.elements || []).map(el => {
                    const ovs = el.type === 'pd-image' ? (col.overlays || []) : [];
                    if (el.type === 'pd-image') {
                      const p = el.props || {};
                      return <div key={el.id} style={{ display: 'flex', justifyContent: aFlex(p._align || 'left'), paddingTop: (p._padTop ?? 0) + 'px', paddingBottom: (p._padBottom ?? 0) + 'px', paddingLeft: (p._padLeft ?? 0) + 'px', paddingRight: (p._padRight ?? 0) + 'px', boxSizing: 'border-box', width: '100%' }}>
                        <PdImageElement product={product} props={p} overlays={ovs} />
                      </div>;
                    }
                    return <ElemView key={el.id} el={el} product={product} dense={dense} />;
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
