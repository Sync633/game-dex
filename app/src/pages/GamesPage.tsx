import {
  CheckCircle2,
  Circle,
  Gamepad2,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
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
import {
  atualizarJogo,
  criarJogo,
  deletarJogo,
  listarJogos,
} from '@/services/gameService'
import type { CreateGameInput, Game } from '@/types/game'

export function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [deletingGame, setDeletingGame] = useState<Game | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)

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
            erro instanceof Error ? erro.message : 'Não foi possível carregar os jogos.'
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
        erro instanceof Error ? erro.message : 'Erro ao atualizar status do jogo.'
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
        alvo ? `"${alvo.titulo}" removido da biblioteca.` : 'Jogo removido com sucesso.',
      )
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : 'Erro ao excluir o jogo.'
      toast.error(mensagem)
      throw erro
    }
  }

  const totalJogos = games.length
  const jogosZerados = games.filter((game) => game.zerado).length
  const jogosPendentes = totalJogos - jogosZerados

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minha Biblioteca</h1>
          <p className="text-muted-foreground">
            Gerencie seus jogos e acompanhe quais já foram zerados.
          </p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo jogo
        </Button>
      </div>

      {/* Cards de métricas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de jogos</CardDescription>
            <CardTitle className="text-3xl">{totalJogos}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Zerados</CardDescription>
            <CardTitle className="text-3xl">{jogosZerados}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Na fila</CardDescription>
            <CardTitle className="text-3xl">{jogosPendentes}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Estados visuais: Loading, Empty State ou Lista */}
      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mb-3 h-8 w-8 animate-spin" />
            <p>Carregando biblioteca de jogos...</p>
          </CardContent>
        </Card>
      ) : games.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Gamepad2 className="mb-3 h-10 w-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Nenhum jogo cadastrado</h2>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Sua biblioteca está vazia. Cadastre seu primeiro jogo para começar a
              organizar o que já zerou.
            </p>
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar primeiro jogo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Card key={game.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">
                    {game.titulo}
                  </CardTitle>
                  <Badge variant={game.zerado ? 'default' : 'secondary'}>
                    {game.zerado ? 'Zerado' : 'Na fila'}
                  </Badge>
                </div>
                <CardDescription>
                  {game.desenvolvedora} · {game.anoLancamento}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="outline">{game.plataforma}</Badge>
                <Badge variant="outline">{game.genero}</Badge>
              </CardContent>

              <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={togglingId === game.id}
                  onClick={() => void handleToggleZerado(game)}
                >
                  {game.zerado ? (
                    <>
                      <Circle className="mr-1.5 h-3.5 w-3.5" />
                      Desmarcar
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      Marcar zerado
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(game)}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeletingGame(game)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Excluir
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