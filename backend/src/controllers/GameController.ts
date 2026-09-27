import { Request, Response } from 'express';
import { Game } from '../models/Game';

export class GameController {
  // GET /games - Lista todos os jogos
  public static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const jogos = await Game.findAll();

      return res.status(200).json(jogos);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        mensagem: 'Erro ao listar jogos.',
      });
    }
  }

  // GET /games/:id - Busca um jogo por ID
  public static async buscarPorId(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const parametroId = req.params.id as string;
      const id = parseInt(parametroId, 10);

      if (
        !/^\d+$/.test(parametroId) ||
        isNaN(id) ||
        id <= 0 ||
        id > 2147483647
      ) {
        return res.status(400).json({
          mensagem: 'O ID informado deve ser um inteiro positivo válido.',
        });
      }

      const jogo = await Game.findByPk(id);

      if (!jogo) {
        return res.status(404).json({
          mensagem: 'Jogo não encontrado.',
        });
      }

      return res.status(200).json(jogo);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        mensagem: 'Erro ao buscar jogo.',
      });
    }
  }

  // POST /games - Cadastra um novo jogo
  public static async criar(req: Request, res: Response): Promise<Response> {
    try {
      if (
        !req.body ||
        typeof req.body !== 'object' ||
        Array.isArray(req.body)
      ) {
        return res.status(400).json({
          mensagem: 'Envie um objeto JSON com os dados do jogo.',
        });
      }

      const {
        titulo,
        desenvolvedora,
        plataforma,
        genero,
        anoLancamento,
        zerado,
      } = req.body;

      if (
        typeof titulo !== 'string' ||
        titulo.trim() === '' ||
        titulo.trim().length > 255
      ) {
        return res.status(400).json({
          mensagem: 'O título deve conter entre 1 e 255 caracteres.',
        });
      }

      if (
        typeof desenvolvedora !== 'string' ||
        desenvolvedora.trim() === '' ||
        desenvolvedora.trim().length > 255
      ) {
        return res.status(400).json({
          mensagem: 'A desenvolvedora deve conter entre 1 e 255 caracteres.',
        });
      }

      if (
        typeof plataforma !== 'string' ||
        plataforma.trim() === '' ||
        plataforma.trim().length > 255
      ) {
        return res.status(400).json({
          mensagem: 'A plataforma deve conter entre 1 e 255 caracteres.',
        });
      }

      if (
        typeof genero !== 'string' ||
        genero.trim() === '' ||
        genero.trim().length > 255
      ) {
        return res.status(400).json({
          mensagem: 'O gênero deve conter entre 1 e 255 caracteres.',
        });
      }

      if (
        typeof anoLancamento !== 'number' ||
        !Number.isInteger(anoLancamento) ||
        anoLancamento < 1 ||
        anoLancamento > 9999
      ) {
        return res.status(400).json({
          mensagem: 'O ano de lançamento deve ser um inteiro entre 1 e 9999.',
        });
      }

      if (typeof zerado !== 'boolean') {
        return res.status(400).json({
          mensagem: 'O campo zerado deve ser true ou false.',
        });
      }

      const jogoExistente = await Game.findOne({
        where: { titulo: titulo.trim() },
      });

      if (jogoExistente) {
        return res.status(400).json({
          mensagem: 'Já existe um jogo cadastrado com esse título.',
        });
      }

      const novoJogo = await Game.create({
        titulo: titulo.trim(),
        desenvolvedora: desenvolvedora.trim(),
        plataforma: plataforma.trim(),
        genero: genero.trim(),
        anoLancamento,
        zerado,
      });

      return res.status(201).json(novoJogo);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        mensagem: 'Erro ao cadastrar jogo.',
      });
    }
  }

  // PUT /games/:id - Atualiza os campos enviados de um jogo
  public static async atualizar(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const parametroId = req.params.id as string;
      const id = parseInt(parametroId, 10);

      if (
        !/^\d+$/.test(parametroId) ||
        isNaN(id) ||
        id <= 0 ||
        id > 2147483647
      ) {
        return res.status(400).json({
          mensagem: 'O ID informado deve ser um inteiro positivo válido.',
        });
      }

      if (
        !req.body ||
        typeof req.body !== 'object' ||
        Array.isArray(req.body)
      ) {
        return res.status(400).json({
          mensagem: 'Envie um objeto JSON com os dados do jogo.',
        });
      }

      const {
        titulo,
        desenvolvedora,
        plataforma,
        genero,
        anoLancamento,
        zerado,
      } = req.body;

      const jogo = await Game.findByPk(id);

      if (!jogo) {
        return res.status(404).json({
          mensagem: 'Jogo não encontrado.',
        });
      }

      if (titulo !== undefined) {
        if (
          typeof titulo !== 'string' ||
          titulo.trim() === '' ||
          titulo.trim().length > 255
        ) {
          return res.status(400).json({
            mensagem: 'O título deve conter entre 1 e 255 caracteres.',
          });
        }

        const jogoExistente = await Game.findOne({
          where: { titulo: titulo.trim() },
        });

        if (jogoExistente && jogoExistente.id !== id) {
          return res.status(400).json({
            mensagem: 'Já existe um jogo cadastrado com esse título.',
          });
        }

        jogo.titulo = titulo.trim();
      }

      if (desenvolvedora !== undefined) {
        if (
          typeof desenvolvedora !== 'string' ||
          desenvolvedora.trim() === '' ||
          desenvolvedora.trim().length > 255
        ) {
          return res.status(400).json({
            mensagem: 'A desenvolvedora deve conter entre 1 e 255 caracteres.',
          });
        }

        jogo.desenvolvedora = desenvolvedora.trim();
      }

      if (plataforma !== undefined) {
        if (
          typeof plataforma !== 'string' ||
          plataforma.trim() === '' ||
          plataforma.trim().length > 255
        ) {
          return res.status(400).json({
            mensagem: 'A plataforma deve conter entre 1 e 255 caracteres.',
          });
        }

        jogo.plataforma = plataforma.trim();
      }

      if (genero !== undefined) {
        if (
          typeof genero !== 'string' ||
          genero.trim() === '' ||
          genero.trim().length > 255
        ) {
          return res.status(400).json({
            mensagem: 'O gênero deve conter entre 1 e 255 caracteres.',
          });
        }

        jogo.genero = genero.trim();
      }

      if (anoLancamento !== undefined) {
        if (
          typeof anoLancamento !== 'number' ||
          !Number.isInteger(anoLancamento) ||
          anoLancamento < 1 ||
          anoLancamento > 9999
        ) {
          return res.status(400).json({
            mensagem: 'O ano de lançamento deve ser um inteiro entre 1 e 9999.',
          });
        }

        jogo.anoLancamento = anoLancamento;
      }

      if (zerado !== undefined) {
        if (typeof zerado !== 'boolean') {
          return res.status(400).json({
            mensagem: 'O campo zerado deve ser true ou false.',
          });
        }

        jogo.zerado = zerado;
      }

      await jogo.save();

      return res.status(200).json(jogo);
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        mensagem: 'Erro ao atualizar jogo.',
      });
    }
  }

  // DELETE /games/:id - Remove um jogo
  public static async deletar(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const parametroId = req.params.id as string;
      const id = parseInt(parametroId, 10);

      if (
        !/^\d+$/.test(parametroId) ||
        isNaN(id) ||
        id <= 0 ||
        id > 2147483647
      ) {
        return res.status(400).json({
          mensagem: 'O ID informado deve ser um inteiro positivo válido.',
        });
      }

      const jogo = await Game.findByPk(id);

      if (!jogo) {
        return res.status(404).json({
          mensagem: 'Jogo não encontrado.',
        });
      }

      await jogo.destroy();

      return res.status(204).send();
    } catch (erro) {
      console.error(erro);

      return res.status(500).json({
        mensagem: 'Erro ao excluir jogo.',
      });
    }
  }
}