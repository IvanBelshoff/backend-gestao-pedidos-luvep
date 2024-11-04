import * as create from './Create';
import * as GetAll from './GetAll';
import * as Count from './Count';
import * as GetById from './GetById';
import * as DeleteById from './DeleteById';
import * as UpdateById from './UpdateById';

export const PermissoesProvider = {
    ...create,
    ...GetAll,
    ...Count,
    ...GetById,
    ...DeleteById,
    ...UpdateById
};