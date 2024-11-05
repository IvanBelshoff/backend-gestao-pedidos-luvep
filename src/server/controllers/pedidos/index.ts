import * as GetAll from './GetAll';
import * as GetAllBySellerCode from './GetAllBySellerCode';

export const PedidosController = {
    ...GetAll,
    ...GetAllBySellerCode
};