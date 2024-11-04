import * as GetByEmail from './GetByEmail';
import * as Create from './Create';
import * as GetAll from './GetAll';
import * as GetById from './GetById';
import * as Count from './Count';
import * as UpdateById from './UpdateById';
import * as DeleteById from './DeleteById';
import * as ValidaEmailUsuario from './ValidaEmailUsuario';
import * as GetStatusCount from './GetStatusCount';
import * as UpdateRolesAndPermissionsById from './UpdateRolesAndPermissionsById';
import * as UpdateUsuarioAtualizador from './UpdateUsuarioAtualizador';
import * as UpdateDateLogin from './UpdateDateLogin';
import * as CopyRolesAndPermissionsById from './CopyRolesAndPermissionsById';

export const UsuariosProvider = {
    ...GetByEmail,
    ...Create,
    ...GetAll,
    ...Count,
    ...UpdateById,
    ...DeleteById,
    ...ValidaEmailUsuario,
    ...GetById,
    ...GetStatusCount,
    ...UpdateRolesAndPermissionsById,
    ...UpdateUsuarioAtualizador,
    ...UpdateDateLogin,
    ...CopyRolesAndPermissionsById
};