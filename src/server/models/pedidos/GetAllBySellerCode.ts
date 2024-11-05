import { Pedido } from '../../database/entities';
import { pedidoRepository } from '../../database/repositories';

export const getAllBySellerCode = async (cod_vendedor: string, page?: number, limit?: number, filter?: string): Promise<Pedido[] | Error> => {
    try {

        const result = pedidoRepository.createQueryBuilder('pedido')
            .leftJoinAndSelect('pedido.justificativas', 'justificativa')
            .addOrderBy('justificativa.id', 'ASC')
            .orderBy('pedido.id', 'DESC')
            .where('pedido.vendedor = :vendedor', { vendedor: cod_vendedor });

        if (page && typeof page == 'string' && limit && typeof limit == 'string') {
            result.take(page * limit);
            result.take(limit);
        }

        if (typeof filter === 'string') {
            result.andWhere('LOWER(pedido.pedido) LIKE LOWER(:pedido)', { pedido: `%${filter}%` });
        }

        const pedidos = await result.getMany();

        return pedidos;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};