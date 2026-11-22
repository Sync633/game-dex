import type { ApiError, CreateGameInput, Game, UpdateGameInput } from '@/types/game'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const GAMES_ENDPOINT = `${API_URL}/games`

async function extrairMensagemErro(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as Partial<ApiError>
    if (data.mensagem) {
      return data.mensagem
    }
  } catch {
    // Caso a resposta não venha em JSON
  }
  return `Erro na requisição (status ${response.status}).`
}

async function tratarResposta<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await extrairMensagemErro(response))
  }
  return (await response.json()) as T
}

export async function listarJogos(): Promise<Game[]> {
  const response = await fetch(GAMES_ENDPOINT)
  return tratarResposta<Game[]>(response)
}

export async function criarJogo(dados: CreateGameInput): Promise<Game> {
  const response = await fetch(GAMES_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  return tratarResposta<Game>(response)
}

export async function atualizarJogo(id: number, dados: UpdateGameInput): Promise<Game> {
  const response = await fetch(`${GAMES_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  return tratarResposta<Game>(response)
}

export async function deletarJogo(id: number): Promise<void> {
  const response = await fetch(`${GAMES_ENDPOINT}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(await extrairMensagemErro(response))
  }
}