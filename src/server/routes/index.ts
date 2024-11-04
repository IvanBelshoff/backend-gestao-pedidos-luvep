import { Router} from 'express';
import { StatusCodes } from 'http-status-codes';
import { EnsureAuthenticated, Regras } from '../shared/middlewares';
import { PermissoesController } from '../controllers/permissoes';
import { RegrasController } from '../controllers/regras';
import { JustificativasController } from '../controllers/justificativas';
import { PedidosController } from '../controllers/pedidos';

const router = Router();

router.get('/', (_, res) => {
    return res.status(StatusCodes.OK).send('Tudo certo');
});

//Permissoes
router.post('/permissoes', EnsureAuthenticated, Regras(['REGRA_ADMIN']), PermissoesController.createValidation, PermissoesController.create);
router.get('/permissoes', EnsureAuthenticated, Regras(['REGRA_ADMIN']), PermissoesController.getAllValidation, PermissoesController.getAll);
router.get('/permissoes/:id', EnsureAuthenticated, Regras(['REGRA_ADMIN']), PermissoesController.getAllValidation, PermissoesController.getById);
router.put('/permissoes/:id', EnsureAuthenticated, Regras(['REGRA_ADMIN']), PermissoesController.updataByIdValidation, PermissoesController.updateById);
router.delete('/permissoes/:id', EnsureAuthenticated, Regras(['REGRA_ADMIN']), PermissoesController.deleteByIdValidation, PermissoesController.deleteById);

//Regras
router.post('/regras', EnsureAuthenticated, Regras(['REGRA_ADMIN']), RegrasController.createValidation, RegrasController.create);
router.get('/regras', EnsureAuthenticated, Regras(['REGRA_ADMIN']), RegrasController.getAllValidation, RegrasController.getAll);
router.get('/regras/:id', EnsureAuthenticated, Regras(['REGRA_ADMIN']), RegrasController.getByIdValidation, RegrasController.getById);
router.get('/regras/usuario/:id', EnsureAuthenticated, Regras(['REGRA_ADMIN']), RegrasController.getRegrasByIdUserValidation, RegrasController.getRegrasByIdUser);
router.put('/regras/:id', EnsureAuthenticated, Regras(['REGRA_ADMIN']), RegrasController.updataByIdValidation, RegrasController.updateById);
router.delete('/regras/:id', EnsureAuthenticated, Regras(['REGRA_ADMIN']), RegrasController.deleteByIdValidation, RegrasController.deleteById);

//Pedidos
router.get('/pedidos', PedidosController.getAllValidation, PedidosController.getAll);

//Justificativas
router.post('/justificativa/pedido/:id', JustificativasController.createByIdValidation, JustificativasController.createById);
router.get('/justificativa/pedido/:id', JustificativasController.getAllByIdValidation, JustificativasController.getAllById);

export { router };