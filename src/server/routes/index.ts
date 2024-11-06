import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EnsureAuthenticated, Permissoes, Regras, SalvarFoto } from '../shared/middlewares';
import { PermissoesController } from '../controllers/permissoes';
import { RegrasController } from '../controllers/regras';
import { JustificativasController } from '../controllers/justificativas';
import { PedidosController } from '../controllers/pedidos';
import { UsuariosController } from '../controllers/usuarios';

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

//Usuarios
router.post('/entrar', UsuariosController.loginValidation, UsuariosController.login);
router.post('/usuarios', EnsureAuthenticated, Regras(['REGRA_USUARIO']), Permissoes(['PERMISSAO_CRIAR_USUARIO']), SalvarFoto(), UsuariosController.createValidation, UsuariosController.create);
router.delete('/usuarios/:id', EnsureAuthenticated, Regras(['REGRA_USUARIO']), Permissoes(['PERMISSAO_DELETAR_USUARIO']), UsuariosController.deleteByIdValidation, UsuariosController.deleteById);

//Pedidos
router.get('/pedidos', EnsureAuthenticated, PedidosController.getAllValidation, PedidosController.getAll);
router.get('/pedidos/vendedor', EnsureAuthenticated, PedidosController.getAllBySellerCodeValidation, PedidosController.getAllBySellerCode);

//Justificativas
router.post('/justificativa/pedido/:id', EnsureAuthenticated, JustificativasController.createByIdValidation, JustificativasController.createById);
router.get('/justificativa/pedido/:id', EnsureAuthenticated, JustificativasController.getAllByIdValidation, JustificativasController.getAllById);
router.put('/justificativa/:id', EnsureAuthenticated, JustificativasController.updataByIdValidation, JustificativasController.updateById);
export { router };