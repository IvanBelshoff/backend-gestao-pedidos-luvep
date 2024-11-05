import * as GetAll from './GetAll';
import * as Count from './Count';
import * as GetAllBySellerCode from './GetAllBySellerCode';

export const PedidosProvider = {
    ...GetAll,
    ...Count,
    ...GetAllBySellerCode
};