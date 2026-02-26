export const metadata = {
  title: 'PageBuilder',
  description: 'Visual Page Builder',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
          a { color: inherit; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
