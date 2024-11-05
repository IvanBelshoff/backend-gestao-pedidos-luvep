import * as CreateById from './CreateById';
import * as GetAllById from './GetAllById';
import * as UpdateById from './UpdateById';

export const JustificativasController = {
    ...CreateById,
    ...GetAllById,
    ...UpdateById
};