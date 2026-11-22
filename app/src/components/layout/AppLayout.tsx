import { Gamepad2 } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function AppLayout() {
  const { pathname } = useLocation()

  const linkClass = (path: string) =>
    `relative flex h-full items-center px-1 text-base font-medium transition-colors ${
      pathname === path
        ? 'text-foreground after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-primary'
        : 'text-muted-foreground hover:text-foreground'
    }`

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-10 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <span>GameDex</span>
          </Link>

          <nav className="flex h-full items-center gap-7">
            <Link to="/" className={linkClass('/')}>
              Biblioteca
            </Link>
            <Link to="/sobre" className={linkClass('/sobre')}>
              Sobre
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}