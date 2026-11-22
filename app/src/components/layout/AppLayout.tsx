import { Gamepad2 } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function AppLayout() {
  const { pathname } = useLocation()

  const linkClass = (path: string) =>
    `text-base font-medium transition-colors ${
      pathname === path
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground'
    }`

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-2xl tracking-tight">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span>GameDex</span>
          </Link>

          <nav className="flex items-center gap-8">
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