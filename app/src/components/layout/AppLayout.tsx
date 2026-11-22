import { Link, Outlet, useLocation } from 'react-router-dom'

export function AppLayout() {
  const { pathname } = useLocation()

  const linkClass = (path: string) =>
    `relative flex h-full items-center text-sm font-medium transition-colors ${
      pathname === path
        ? 'text-foreground after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:bg-primary'
        : 'text-muted-foreground hover:text-foreground'
    }`

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <span className="font-display flex h-8 w-8 items-center justify-center rounded-sm border border-primary/40 bg-card text-sm font-bold tracking-tighter text-primary transition-colors group-hover:border-primary">
              GD
            </span>

            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                GameDex
              </span>
              <span className="font-mono-tech hidden text-[11px] tracking-[0.18em] text-muted-foreground uppercase sm:inline">
                Archive
              </span>
            </div>
          </Link>

          <nav
            aria-label="Navegação principal"
            className="flex h-full items-center gap-6 sm:gap-8"
          >
            <Link to="/" className={linkClass('/')}>
              Biblioteca
            </Link>
            <Link to="/sobre" className={linkClass('/sobre')}>
              Sobre
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}