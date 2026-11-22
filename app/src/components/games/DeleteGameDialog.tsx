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
import type { Game } from '@/types/game'

interface DeleteGameDialogProps {
  game: Game | null
  onOpenChange: (open: boolean) => void
  onConfirm: (id: number) => Promise<void>
}

export function DeleteGameDialog({
  game,
  onOpenChange,
  onConfirm,
}: DeleteGameDialogProps) {
  const [deleting, setDeleting] = useState(false)

  async function handleConfirm() {
    if (!game) return
    setDeleting(true)

    try {
      await onConfirm(game.id)
      onOpenChange(false)
    } catch {
      // Erro já exibido via toast na GamesPage; mantém o modal aberto
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={game !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir jogo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover <strong>{game?.titulo}</strong> da sua biblioteca?
            Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}