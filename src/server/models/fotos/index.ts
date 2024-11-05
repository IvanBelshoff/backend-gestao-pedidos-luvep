import * as create from './Create';
import * as createnofile from './CreateNoFile';
import * as updatebyid from './UpdateByid';
import * as DeleteById from './DeleteById';
import * as DeleteByFilename from './DeleteByFilename';

export const FotosProvider = {
    ...create,
    ...createnofile,
    ...updatebyid,
    ...DeleteById,
    ...DeleteByFilename
};