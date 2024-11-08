import { Pedido, Status, Usuario } from '../../database/entities';
import { pedidoRepository } from '../../database/repositories';

export const getAllConsultores = async (id: number, page?: number, limit?: number, filter?: string): Promise<Pedido[] | Error> => {
    try {

        const result = pedidoRepository.createQueryBuilder('pedido')
            .leftJoinAndSelect('pedido.justificativas', 'justificativa')
            .addOrderBy('justificativa.id', 'ASC')
            .orderBy('pedido.id', 'DESC')
            .leftJoinAndSelect(Usuario, 'usuario', 'pedido.vendedor = usuario.codigo_vendedor')
            .where('usuario.id = :id', { id })
            .andWhere('pedido.status = :status', { status: Status.ABER });

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