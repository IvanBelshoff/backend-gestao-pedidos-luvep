import { pedidoRepository } from '../../database/repositories';

export const count = async (filter?: string): Promise<number | Error> => {

    try {
        const result = pedidoRepository.createQueryBuilder('pedido')
            .select('pedido');

        if (typeof filter === 'string') {
            result.andWhere('LOWER(pedido.pedido) LIKE LOWER(:pedido)', { pedido: `%${filter}%` });
        }

        const count = await result.getCount();

        return count;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar a quantidade total de registros');
    }

};