import * as Create from './Create';
import * as DeleteById from './DeleteById';
import * as DeleteFotoById from './DeleteFotoById';
import * as GetAll from './GetAll';
import * as GetById from './GetById';
import * as GetSubordinadosById from './GetSubordinadosById';
import * as GetSuperioresById from './GetSuperioresById';
import * as Login from './Login';
import * as RecoverPassword from './RecoverPassword';
import * as UpdateById from './UpdateById';
import * as UpdateSubordinadosById from './UpdateSubordinadosById';
import * as UpdateSuperiorById from './UpdateSuperiorById';

export const UsuariosController = {
    ...Create,
    ...DeleteById,
    ...DeleteFotoById,
    ...GetAll,
    ...GetById,
    ...GetSubordinadosById,
    ...GetSuperioresById,
    ...Login,
    ...RecoverPassword,
    ...UpdateById,
    ...UpdateSubordinadosById,
    ...UpdateSuperiorById
};