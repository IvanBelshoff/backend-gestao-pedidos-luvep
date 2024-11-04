import * as Create from './Create';
import * as GetAll from './GetAll';
import * as GetById from './GetById';
import * as DeleteById from './DeleteById';
import * as UpdateById from './UpdateById';

export const PermissoesController = {
    ...Create,
    ...GetAll,
    ...GetById,
    ...DeleteById,
    ...UpdateById
};