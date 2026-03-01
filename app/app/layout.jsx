export const metadata = {
  title: 'PageBuilder',
  description: 'Visual Page Builder',
}

const RESPONSIVE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
  a { color: inherit; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

  /* ── Overflow guards ── */
  .hb-section, .hb-row-wrap, .hb-row-inner,
  .hb-cols-wrap, .hb-col-item, .hb-col-inner, .hb-el-wrap {
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
  }

  /* ── Column row: side-by-side by default ── */
  .hb-cols-wrap {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap;
    width: 100%;
    align-items: stretch;
  }

  .hb-col-item {
    min-width: 0;
    overflow: hidden;
  }

  .hb-col-inner {
    width: 100%;
    word-break: break-word;
    overflow-wrap: break-word;
    overflow: hidden;
  }

  .hb-el-wrap {
    max-width: 100%;
    overflow: hidden;
    word-break: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;
  }

  .hb-el-wrap img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* ── Tablet (≤ 1024px) ── */
  @media (max-width: 1024px) {
    .hb-row-inner {
      padding-left: 24px !important;
      padding-right: 24px !important;
    }
  }

  /* ── Mobile (≤ 768px): stack columns ── */
  @media (max-width: 768px) {
    .hb-cols-wrap {
      flex-direction: column !important;
      flex-wrap: wrap !important;
      gap: 16px !important;
    }
    .hb-col-item {
      flex: none !important;
      width: 100% !important;
      min-width: 100% !important;
    }
    .hb-row-inner {
      padding-left: 16px !important;
      padding-right: 16px !important;
      min-height: unset !important;
    }
    .hb-nav {
      flex-wrap: wrap !important;
      gap: 12px !important;
    }
    .hb-btn {
      padding-left: 16px !important;
      padding-right: 16px !important;
      font-size: 13px !important;
    }
    .hb-el-wrap h1 { font-size: clamp(22px, 7vw, 48px) !important; }
    .hb-el-wrap h2 { font-size: clamp(18px, 6vw, 36px) !important; }
    .hb-el-wrap h3 { font-size: clamp(16px, 5vw, 28px) !important; }
  }

  /* ── Very small mobile (≤ 480px) ── */
  @media (max-width: 480px) {
    .hb-row-inner {
      padding-left: 12px !important;
      padding-right: 12px !important;
    }
  }

  /* ── Force-columns: keep desktop layout on mobile when user opted in ── */
  /* Uses higher-specificity selectors to override the mobile !important rules above */
  @media (max-width: 768px) {
    .hb-row-wrap.hb-force-cols-row > .hb-row-inner,
    .hb-force-cols-row > .hb-row-inner {
      flex-direction: row !important;
      align-items: stretch !important;
      flex-wrap: nowrap !important;
    }
    .hb-row-wrap.hb-force-cols-row .hb-cols-wrap,
    .hb-cols-wrap.hb-force-cols {
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      gap: inherit !important;
    }
    .hb-row-wrap.hb-force-cols-row .hb-cols-wrap .hb-col-item,
    .hb-force-cols > .hb-col-item {
      flex: 1 1 0 !important;
      width: auto !important;
      min-width: 0 !important;
      max-width: 100% !important;
      overflow: hidden !important;
    }
  }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: RESPONSIVE_CSS }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
