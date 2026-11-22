import {
  CheckCircle2,
  Circle,
  Gamepad2,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Trophy,
} from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { DeleteGameDialog } from '@/components/games/DeleteGameDialog'
import { GameFormDialog } from '@/components/games/GameFormDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  atualizarJogo,
  criarJogo,
  deletarJogo,
  listarJogos,
} from '@/services/gameService'
import type { CreateGameInput, Game } from '@/types/game'

type FilterStatus = 'todos' | 'fila' | 'zerados'

export function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [deletingGame, setDeletingGame] = useState<Game | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<FilterStatus>('todos')

  useEffect(() => {
    let cancelado = false

    async function buscarJogos() {
      try {
        const dados = await listarJogos()
        if (!cancelado) {
          setGames(dados)
        }
      } catch (erro) {
        if (!cancelado) {
          const mensagem =
            erro instanceof Error
              ? erro.message
              : 'Não foi possível carregar os jogos.'
          toast.error(mensagem)
        }
      } finally {
        if (!cancelado) {
          setLoading(false)
        }
      }
    }

    void buscarJogos()

    return () => {
      cancelado = true
    }
  }, [])

  function handleOpenCreate() {
    setEditingGame(null)
    setFormOpen(true)
  }

  function handleOpenEdit(game: Game) {
    setEditingGame(game)
    setFormOpen(true)
  }

  async function handleSaveGame(dados: CreateGameInput) {
    try {
      if (editingGame) {
        const atualizado = await atualizarJogo(editingGame.id, dados)
        setGames((prev) =>
          prev.map((item) => (item.id === atualizado.id ? atualizado : item)),
        )
        toast.success(`"${atualizado.titulo}" atualizado com sucesso!`)
      } else {
        const criado = await criarJogo(dados)
        setGames((prev) => [...prev, criado])
        toast.success(`"${criado.titulo}" cadastrado com sucesso!`)
      }
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : 'Erro ao salvar o jogo.'
      toast.error(mensagem)
      throw erro
    }
  }

  async function handleToggleZerado(game: Game) {
    setTogglingId(game.id)
    try {
      const atualizado = await atualizarJogo(game.id, { zerado: !game.zerado })
      setGames((prev) =>
        prev.map((item) => (item.id === atualizado.id ? atualizado : item)),
      )
      toast.success(
        atualizado.zerado
          ? `"${atualizado.titulo}" marcado como zerado!`
          : `"${atualizado.titulo}" movido para a fila.`,
      )
    } catch (erro) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : 'Erro ao atualizar status do jogo.'
      toast.error(mensagem)
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDeleteGame(id: number) {
    try {
      const alvo = games.find((item) => item.id === id)
      await deletarJogo(id)
      setGames((prev) => prev.filter((item) => item.id !== id))
      toast.success(
        alvo
          ? `"${alvo.titulo}" removido da biblioteca.`
          : 'Jogo removido com sucesso.',
      )
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : 'Erro ao excluir o jogo.'
      toast.error(mensagem)
      throw erro
    }
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBusca(event.target.value)
  }

  const totalJogos = games.length
  const jogosZerados = games.filter((game) => game.zerado).length
  const jogosPendentes = totalJogos - jogosZerados
  const percentualZerado =
    totalJogos > 0 ? Math.round((jogosZerados / totalJogos) * 100) : 0

  const termoNormalizado = busca.trim().toLowerCase()
  const jogosFiltrados = games.filter((game) => {
    const passaStatus =
      filtro === 'todos' ||
      (filtro === 'zerados' && game.zerado) ||
      (filtro === 'fila' && !game.zerado)

    if (!passaStatus) return false
    if (!termoNormalizado) return true

    return (
      game.titulo.toLowerCase().includes(termoNormalizado) ||
      game.desenvolvedora.toLowerCase().includes(termoNormalizado) ||
      game.plataforma.toLowerCase().includes(termoNormalizado) ||
      game.genero.toLowerCase().includes(termoNormalizado)
    )
  })

  return (
    <div className="space-y-6">
      {/* Cabeçalho da biblioteca */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Catálogo Pessoal
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Minha Biblioteca
          </h1>
        </div>

        <Button onClick={handleOpenCreate} className="font-semibold">
          <Plus className="mr-1.5 h-4 w-4" />
          Adicionar jogo
        </Button>
      </div>

      {/* Painel compacto de progresso + busca e filtros */}
      <Card className="border-border/80 bg-card/85">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums">
                  {totalJogos}
                </span>
                <span className="text-muted-foreground">na biblioteca</span>
              </div>

              <span className="hidden h-4 w-px bg-border sm:inline-block" />

              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="font-semibold tabular-nums">
                  {jogosZerados}
                </span>
                <span className="text-muted-foreground">zerados</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold tabular-nums">
                  {jogosPendentes}
                </span>
                <span className="text-muted-foreground">na fila</span>
              </div>
            </div>

            <div className="flex items-center gap-3 md:w-56">
              <div className="h-2 flex-1 overflow-hidden rounded-sm bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${percentualZerado}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs font-semibold text-muted-foreground tabular-nums">
                {percentualZerado}%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busca}
                onChange={handleSearchChange}
                placeholder="Buscar por título, estúdio, plataforma ou gênero..."
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={filtro === 'todos' ? 'default' : 'outline'}
                onClick={() => setFiltro('todos')}
              >
                Todos ({totalJogos})
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filtro === 'fila' ? 'default' : 'outline'}
                onClick={() => setFiltro('fila')}
              >
                Na fila ({jogosPendentes})
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filtro === 'zerados' ? 'default' : 'outline'}
                onClick={() => setFiltro('zerados')}
              >
                Zerados ({jogosZerados})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estados visuais: Loading, Empty State, Sem resultados ou Grid */}
      {loading ? (
        <Card className="border-border/80">
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
            <p>Carregando biblioteca de jogos...</p>
          </CardContent>
        </Card>
      ) : games.length === 0 ? (
        <Card className="border-dashed border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Gamepad2 className="mb-3 h-10 w-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Nenhum jogo cadastrado</h2>
            <p className="mb-5 max-w-sm text-sm text-muted-foreground">
              Sua biblioteca está vazia. Cadastre seu primeiro jogo para começar
              a organizar o que já zerou.
            </p>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Cadastrar primeiro jogo
            </Button>
          </CardContent>
        </Card>
      ) : jogosFiltrados.length === 0 ? (
        <Card className="border-border/80">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-base font-medium">
              Nenhum jogo encontrado para esse filtro
            </p>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">
              Tente limpar a busca ou trocar a aba selecionada.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setBusca('')
                setFiltro('todos')
              }}
            >
              Limpar filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jogosFiltrados.map((game) => (
            <Card
              key={game.id}
              className="group relative flex flex-col justify-between overflow-hidden border-border/80 bg-card/90 transition-all hover:border-primary/50 hover:bg-card"
            >
              {/* Faixa de status no topo do card */}
              <div
                className={`h-1 w-full ${
                  game.zerado ? 'bg-primary' : 'bg-border'
                }`}
              />

              <CardHeader className="pb-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    {game.plataforma} · {game.anoLancamento}
                  </span>
                  <Badge
                    variant={game.zerado ? 'default' : 'secondary'}
                    className="rounded-sm px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase"
                  >
                    {game.zerado ? 'Zerado' : 'Na fila'}
                  </Badge>
                </div>

                <CardTitle className="text-xl leading-snug font-bold tracking-tight">
                  {game.titulo}
                </CardTitle>
                <CardDescription className="text-sm">
                  {game.desenvolvedora}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 pb-4">
                <Badge
                  variant="outline"
                  className="rounded-sm border-border/80 bg-secondary/40 text-xs font-normal text-muted-foreground"
                >
                  {game.genero}
                </Badge>
              </CardContent>

              <CardFooter className="flex items-center justify-between gap-2 border-t border-border/70 bg-background/30 px-5 py-3">
                <Button
                  type="button"
                  variant={game.zerado ? 'secondary' : 'outline'}
                  size="sm"
                  disabled={togglingId === game.id}
                  onClick={() => void handleToggleZerado(game)}
                >
                  {game.zerado ? (
                    <>
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      Zerado
                    </>
                  ) : (
                    <>
                      <Circle className="mr-1.5 h-3.5 w-3.5" />
                      Marcar zerado
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Editar jogo"
                    aria-label={`Editar ${game.titulo}`}
                    onClick={() => handleOpenEdit(game)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Excluir jogo"
                    aria-label={`Excluir ${game.titulo}`}
                    onClick={() => setDeletingGame(game)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <GameFormDialog
        key={`${formOpen}-${editingGame?.id ?? 'new'}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        game={editingGame}
        onSubmit={handleSaveGame}
      />

      <DeleteGameDialog
        game={deletingGame}
        onOpenChange={(open) => {
          if (!open) setDeletingGame(null)
        }}
        onConfirm={handleDeleteGame}
      />
    </div>
  )
}