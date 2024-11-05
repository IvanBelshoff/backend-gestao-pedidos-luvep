import * as create from './Create';
import * as GetAll from './GetAll';
import * as UpdateById from './UpdateById';
import * as GetAllOrganograma from './GetAllOrganograma';
import * as DeleteById from './DeleteById';
import * as GetSuperioresById from './GetSuperioresById';
import * as GetSubordinadosById from './GetSubordinadosById';
import * as DeleteFotoById from './DeleteFotoById';
import * as GetById from './GetById';
import * as GetFiltrosOrganograma from './GetFiltrosOrganograma';
import * as GetFiltrosAll from './GetFiltrosAll';
import * as getAtribuicoes from './GetAtribuicoes';
import * as UpdateSuperiorById from './UpdateSuperiorById';
import * as UpdateSubordinadosById from './UpdateSubordinadosById';
import * as GetChart from './GetChart';

export const FuncionariosController = {
    ...create,
    ...UpdateById,
    ...GetAllOrganograma,
    ...DeleteById,
    ...GetSuperioresById,
    ...GetSubordinadosById,
    ...DeleteFotoById,
    ...GetAll,
    ...GetById,
    ...GetFiltrosOrganograma,
    ...GetFiltrosAll,
    ...getAtribuicoes,
    ...UpdateSuperiorById,
    ...UpdateSubordinadosById,
    ...GetChart
};