import { AppDataSource1 } from '../data-sources/data-source-luvep';
import { Pedido } from '../entities';

export const pedidoRepository = AppDataSource1.getRepository(Pedido);