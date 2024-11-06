import * as GetAll from './GetAll';
import * as Count from './Count';
import * as GetAllBySellerCode from './GetAllBySellerCode';
import * as CountBySellerCode from './CountBySellerCode';

export const PedidosProvider = {
    ...GetAll,
    ...Count,
    ...GetAllBySellerCode,
    ...CountBySellerCode
};