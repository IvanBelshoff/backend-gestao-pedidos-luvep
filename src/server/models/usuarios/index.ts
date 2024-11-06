import * as create from './Create';
import * as ValidaEmailFuncionario from './validaEmailFuncionario';
import * as UpdateById from './UpdateById';
import * as DeleteById from './DeleteById';
import * as GetSuperioresById from './GetSuperioresById';
import * as GetSubordinadosById from './GetSubordinadosById';
import * as GetAll from './GetAll';
import * as Count from './Count';
import * as GetById from './GetById';
import * as UpdateSuperiorById from './UpdateSuperiorById';
import * as UpdateSubordinadosById from './UpdateSubordinadosById';
import * as GetByEmail from './GetByEmail';
import * as UpdateDateLogin from './UpdateDateLogin';
import * as GetStatusCount from './GetStatusCount';

export const UsuariosProvider = {
    ...create,
    ...ValidaEmailFuncionario,
    ...UpdateById,
    ...DeleteById,
    ...GetSuperioresById,
    ...GetSubordinadosById,
    ...GetAll,
    ...Count,
    ...GetById,
    ...UpdateSuperiorById,
    ...UpdateSubordinadosById,
    ...GetByEmail,
    ...UpdateDateLogin,
    ...GetStatusCount
};