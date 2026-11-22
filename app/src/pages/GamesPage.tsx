import {
  Check,
  Circle,
  Gamepad2,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
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

function getGameMonogram(titulo: string): string {
  const palavras = titulo
    .trim()
    .split(/\s+/)
    .filter((parte) => /[a-zA-Z0-9À-ÿ]/.test(parte))

  if (palavras.length === 0) return 'GD'
  if (palavras.length === 1) return palavras[0].slice(0, 2).toUpperCase()
  return `${palavras[0][0]}${palavras[1][0]}`.toUpperCase()
}

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
    <div className="space-y-8">
      {/* Cabeçalho editorial + resumo integrado da coleção */}
      <section className="space-y-6 border-b border-border/80 pb-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="font-mono-tech text-xs font-medium tracking-[0.2em] text-primary uppercase">
              Acervo Pessoal
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Minha Biblioteca
            </h1>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-6">
            {/* Métricas integradas */}
            <div className="space-y-2">
              <div className="font-mono-tech flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="text-foreground">
                  <strong className="font-semibold tabular-nums">
                    {String(totalJogos).padStart(2, '0')}
                  </strong>{' '}
                  <span className="text-muted-foreground">jogos</span>
                </span>
                <span className="text-border">/</span>
                <span className="text-primary">
                  <strong className="font-semibold tabular-nums">
                    {String(jogosZerados).padStart(2, '0')}
                  </strong>{' '}
                  <span className="text-muted-foreground">zerados</span>
                </span>
                <span className="text-border">/</span>
                <span className="text-foreground">
                  <strong className="font-semibold tabular-nums">
                    {String(jogosPendentes).padStart(2, '0')}
                  </strong>{' '}
                  <span className="text-muted-foreground">na fila</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="h-1 flex-1 overflow-hidden bg-secondary sm:w-44"
                  role="progressbar"
                  aria-valuenow={percentualZerado}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progresso de jogos zerados"
                >
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${percentualZerado}%` }}
                  />
                </div>
                <span className="font-mono-tech text-xs text-muted-foreground tabular-nums">
                  {percentualZerado}%
                </span>
              </div>
            </div>

            <Button
              onClick={handleOpenCreate}
              className="h-10 px-4 font-semibold tracking-tight"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Adicionar jogo
            </Button>
          </div>
        </div>

        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={handleSearchChange}
              placeholder="Filtrar por título, estúdio, plataforma ou gênero..."
              aria-label="Pesquisar jogos na biblioteca"
              className="h-9 border-border/80 bg-card/70 pr-8 pl-9 text-sm placeholder:text-muted-foreground/75"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                aria-label="Limpar busca"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className="flex flex-wrap items-center gap-1"
            role="group"
            aria-label="Filtrar jogos por status"
          >
            <Button
              type="button"
              size="sm"
              variant={filtro === 'todos' ? 'secondary' : 'ghost'}
              onClick={() => setFiltro('todos')}
              className={`font-mono-tech h-8 px-3 text-xs ${
                filtro === 'todos'
                  ? 'border border-border text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Todos · {totalJogos}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filtro === 'fila' ? 'secondary' : 'ghost'}
              onClick={() => setFiltro('fila')}
              className={`font-mono-tech h-8 px-3 text-xs ${
                filtro === 'fila'
                  ? 'border border-border text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Na fila · {jogosPendentes}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filtro === 'zerados' ? 'secondary' : 'ghost'}
              onClick={() => setFiltro('zerados')}
              className={`font-mono-tech h-8 px-3 text-xs ${
                filtro === 'zerados'
                  ? 'border border-primary/40 text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Zerados · {jogosZerados}
            </Button>
          </div>
        </div>
      </section>

      {/* Estados visuais: Loading, Empty State, Sem resultados ou Coleção */}
      {loading ? (
        <Card className="border-border/70 bg-card/60">
          <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mb-3 h-7 w-7 animate-spin text-primary" />
            <p className="font-mono-tech text-xs tracking-wider uppercase">
              Carregando catálogo...
            </p>
          </CardContent>
        </Card>
      ) : games.length === 0 ? (
        <Card className="border-dashed border-border bg-card/40">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Gamepad2 className="mb-4 h-9 w-9 text-primary/70" />
            <h2 className="font-display text-xl font-semibold">
              Sua estante ainda está vazia
            </h2>
            <p className="mt-1.5 mb-6 max-w-sm text-sm text-muted-foreground">
              Adicione o primeiro título para montar seu acervo pessoal e
              acompanhar o progresso da sua coleção.
            </p>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Cadastrar primeiro jogo
            </Button>
          </CardContent>
        </Card>
      ) : jogosFiltrados.length === 0 ? (
        <Card className="border-border/70 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <p className="font-display text-lg font-medium">
              Nenhum título encontrado
            </p>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              Ajuste o termo pesquisado ou troque o filtro de status.
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {jogosFiltrados.map((game, index) => {
            const catalogIndex = String(index + 1).padStart(2, '0')
            const monogram = getGameMonogram(game.titulo)

            return (
              <Card
                key={game.id}
                className={`group relative flex flex-col justify-between overflow-hidden border-border/80 bg-card transition-all duration-200 hover:bg-accent/55 ${
                  game.zerado
                    ? 'border-l-2 border-l-primary hover:border-primary/40 hover:border-l-primary'
                    : 'border-l-2 border-l-border hover:border-foreground/25 hover:border-l-foreground/40'
                }`}
              >
                {/* Monograma tipográfico bem sutil no fundo */}
                <span
                  aria-hidden="true"
                  className={`font-display pointer-events-none absolute right-5 bottom-14 select-none text-7xl leading-none font-bold tracking-tighter transition-opacity duration-200 ${
                    game.zerado
                      ? 'text-primary/[0.03]'
                      : 'text-foreground/[0.02]'
                  }`}
                >
                  {monogram}
                </span>

                <CardHeader className="relative z-10 space-y-4 pb-4">
                  {/* Linha superior de catalogação */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-mono-tech flex items-center gap-2 text-xs tracking-wider text-muted-foreground uppercase">
                      <span className="text-foreground/75">#{catalogIndex}</span>
                      <span className="text-border">·</span>
                      <span className="text-foreground/85">
                        {game.anoLancamento}
                      </span>
                    </div>

                    <Badge
                      variant={game.zerado ? 'default' : 'outline'}
                      className={`font-mono-tech rounded-xs px-2.5 py-0.5 text-[11px] font-medium tracking-[0.12em] uppercase ${
                        game.zerado
                          ? 'border border-primary/35 bg-primary/15 text-primary hover:bg-primary/20'
                          : 'border-border/70 bg-secondary/45 text-muted-foreground'
                      }`}
                    >
                      {game.zerado ? 'Zerado' : 'Na fila'}
                    </Badge>
                  </div>

                  {/* Título expressivo + desenvolvedora */}
                  <div className="space-y-1.5">
                    <CardTitle className="font-display text-2xl leading-[1.15] font-bold tracking-tight text-foreground">
                      {game.titulo}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {game.desenvolvedora}
                    </CardDescription>
                  </div>
                </CardHeader>

                {/* Metadados de ficha técnica */}
                <CardContent className="relative z-10 pt-0 pb-5">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/50 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech text-xs tracking-wider text-muted-foreground uppercase">
                        Plataforma
                      </span>
                      <Badge
                        variant="secondary"
                        className="font-mono-tech rounded-xs bg-secondary/85 px-2 py-0.5 text-xs font-normal text-secondary-foreground"
                      >
                        {game.plataforma}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech text-xs tracking-wider text-muted-foreground uppercase">
                        Gênero
                      </span>
                      <span className="text-sm font-medium text-foreground/90">
                        {game.genero}
                      </span>
                    </div>
                  </div>
                </CardContent>

                {/* Ações no rodapé com destaque no hover */}
                <CardFooter className="relative z-10 flex items-center justify-between gap-2 border-t border-border/60 bg-background/35 px-5 py-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={togglingId === game.id}
                    onClick={() => void handleToggleZerado(game)}
                    className={`h-8 px-2.5 text-xs font-medium ${
                      game.zerado
                        ? 'text-primary hover:bg-primary/15 hover:text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {game.zerado ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5" />
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
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 border border-transparent p-0 text-muted-foreground transition-colors group-hover:text-foreground/75 hover:border-border hover:bg-secondary hover:text-foreground"
                      title="Editar jogo"
                      aria-label={`Editar ${game.titulo}`}
                      onClick={() => handleOpenEdit(game)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 border border-transparent p-0 text-muted-foreground transition-colors group-hover:text-foreground/75 hover:border-destructive/40 hover:bg-destructive/20 hover:text-destructive"
                      title="Excluir jogo"
                      aria-label={`Excluir ${game.titulo}`}
                      onClick={() => setDeletingGame(game)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
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