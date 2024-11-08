import * as GetAll from './GetAll';
import * as Count from './Count';
import * as GetAllConsultores from './GetAllConsultores';
import * as CountAllConsultores from './CountAllConsultores';
import * as GetAllCoordenadores from './GetAllCoordenadores';
import * as CountAllCoordenadores from './CountAllCoordenadores';
import * as GetAllGerentes from './GetAllGerentes';
import * as CountAllGerentes from './CountAllGerentes';

export const PedidosProvider = {
    ...GetAll,
    ...Count,
    ...GetAllConsultores,
    ...CountAllConsultores,
    ...GetAllCoordenadores,
    ...CountAllCoordenadores,
    ...GetAllGerentes,
    ...CountAllGerentes
};