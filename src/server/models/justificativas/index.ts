import * as CreateById from './CreateById';
import * as GetAllById from './GetAllById';
import * as CountAllById from './CountAllById';
import * as UpdateById from './UpdateById';

export const JustificativasProvider = {
    ...CreateById,
    ...GetAllById,
    ...CountAllById,
    ...UpdateById
};