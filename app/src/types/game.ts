export interface Game {
  id: number
  titulo: string
  desenvolvedora: string
  plataforma: string
  genero: string
  anoLancamento: number
  zerado: boolean
  createdAt: string
  updatedAt: string
}

export type CreateGameInput = Omit<Game, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateGameInput = Partial<CreateGameInput>

export interface ApiError {
  mensagem: string
}