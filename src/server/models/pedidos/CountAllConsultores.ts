import { Status, Usuario } from '../../database/entities';
import { pedidoRepository } from '../../database/repositories';

export const countAllConsultores = async (id: number, filter?: string): Promise<number | Error> => {
    try {

        const result = pedidoRepository.createQueryBuilder('pedido')
            .leftJoinAndSelect(Usuario, 'usuario', 'pedido.vendedor = usuario.codigo_vendedor')
            .where('usuario.id = :id', { id })
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