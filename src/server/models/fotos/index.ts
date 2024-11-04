import * as create from './Create';
import * as createnofile from './CreateNoFile';
import * as updatebyid from './UpdateByid';
import * as DeleteById from './DeleteById';

export const FotosProvider = {
    ...create,
    ...createnofile,
    ...updatebyid,
    ...DeleteById
};