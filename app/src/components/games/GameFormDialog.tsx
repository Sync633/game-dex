import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CreateGameInput, Game } from '@/types/game'

interface GameFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  game: Game | null
  onSubmit: (dados: CreateGameInput) => Promise<void>
}

interface FormState {
  titulo: string
  desenvolvedora: string
  plataforma: string
  genero: string
  anoLancamento: string
  zerado: boolean
}

const INITIAL_STATE: FormState = {
  titulo: '',
  desenvolvedora: '',
  plataforma: '',
  genero: '',
  anoLancamento: '',
  zerado: false,
}

function getInitialState(game: Game | null): FormState {
  if (!game) {
    return INITIAL_STATE
  }

  return {
    titulo: game.titulo,
    desenvolvedora: game.desenvolvedora,
    plataforma: game.plataforma,
    genero: game.genero,
    anoLancamento: String(game.anoLancamento),
    zerado: game.zerado,
  }
}

export function GameFormDialog({
  open,
  onOpenChange,
  game,
  onSubmit,
}: GameFormDialogProps) {
  const [form, setForm] = useState<FormState>(() => getInitialState(game))
  const [submitting, setSubmitting] = useState(false)

  const isEditing = game !== null

  function handleTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, zerado: event.target.checked }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)

    try {
      await onSubmit({
        titulo: form.titulo.trim(),
        desenvolvedora: form.desenvolvedora.trim(),
        plataforma: form.plataforma.trim(),
        genero: form.genero.trim(),
        anoLancamento: Number(form.anoLancamento),
        zerado: form.zerado,
      })
      onOpenChange(false)
    } catch {
      // Erro já exibido via toast na GamesPage; mantém o modal aberto
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar jogo' : 'Novo jogo'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do jogo na sua biblioteca.'
              : 'Preencha os dados para cadastrar um novo jogo no GameDex.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              name="titulo"
              value={form.titulo}
              onChange={handleTextChange}
              placeholder="Ex: Hollow Knight"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desenvolvedora">Desenvolvedora</Label>
            <Input
              id="desenvolvedora"
              name="desenvolvedora"
              value={form.desenvolvedora}
              onChange={handleTextChange}
              placeholder="Ex: Team Cherry"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plataforma">Plataforma</Label>
              <Input
                id="plataforma"
                name="plataforma"
                value={form.plataforma}
                onChange={handleTextChange}
                placeholder="Ex: PC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genero">Gênero</Label>
              <Input
                id="genero"
                name="genero"
                value={form.genero}
                onChange={handleTextChange}
                placeholder="Ex: Metroidvania"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="anoLancamento">Ano de lançamento</Label>
            <Input
              id="anoLancamento"
              name="anoLancamento"
              type="number"
              min={1}
              max={9999}
              value={form.anoLancamento}
              onChange={handleTextChange}
              placeholder="Ex: 2017"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="zerado"
              name="zerado"
              type="checkbox"
              checked={form.zerado}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <Label htmlFor="zerado" className="cursor-pointer">
              Já zerei este jogo
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}