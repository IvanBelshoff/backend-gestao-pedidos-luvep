import { Status } from '../../database/entities';
import { pedidoRepository } from '../../database/repositories';

export const countBySellerCode = async (cod_vendedor?: string, filter?: string): Promise<number | Error> => {
    try {

        const result = pedidoRepository.createQueryBuilder('pedido')
            .leftJoinAndSelect('pedido.justificativas', 'justificativa')
            .addOrderBy('justificativa.id', 'ASC')
            .orderBy('pedido.id', 'DESC')
            .where('pedido.vendedor = :vendedor', { vendedor: cod_vendedor })
            .andWhere('pedido.status = :status', { status: Status.ABER });

        if (typeof filter === 'string') {
            result.andWhere('LOWER(pedido.pedido) LIKE LOWER(:pedido)', { pedido: `%${filter}%` });
        }

        const pedidos = await result.getCount();

        return pedidos;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};