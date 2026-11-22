import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SobrePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sobre o GameDex</h1>
        <p className="text-muted-foreground">
          Catálogo pessoal para organizar seus jogos e acompanhar quais já foram zerados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stack da Aplicação</CardTitle>
          <CardDescription>
            Frontend SPA desenvolvido para a AT2 de Laboratório de Desenvolvimento Web.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="secondary">React 19</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Tailwind CSS</Badge>
          <Badge variant="secondary">shadcn/ui</Badge>
          <Badge variant="secondary">React Router DOM</Badge>
          <Badge variant="secondary">API REST + PostgreSQL</Badge>
        </CardContent>
      </Card>
    </div>
  )
}