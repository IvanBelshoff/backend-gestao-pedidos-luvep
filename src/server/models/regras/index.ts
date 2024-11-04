import * as Create from './Create';
import * as GetAll from './GetAll';
import * as GetById from './GetById';
import * as DeleteById from './DeleteById';
import * as UpdateById from './UpdateById';
import * as GetRegrasByIdUser from './GetRegrasByIdUser';
import * as Count from './Count';

export const RegrasProvider = {
    ...Create,
    ...GetAll,
    ...GetById,
    ...UpdateById,
    ...DeleteById,
    ...GetRegrasByIdUser,
    ...Count
};