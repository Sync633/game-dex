import { Router } from 'express';
import { GameController } from '../controllers/GameController';

const router = Router();

router.get('/', GameController.listar);
router.get('/:id', GameController.buscarPorId);
router.post('/', GameController.criar);
router.put('/:id', GameController.atualizar);
router.delete('/:id', GameController.deletar);

export default router;
