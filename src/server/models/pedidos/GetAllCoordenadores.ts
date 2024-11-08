import { Pedido, Status, Usuario } from '../../database/entities';
import { pedidoRepository } from '../../database/repositories';

interface IPedidoUsuario extends Pedido {
    usuario: Usuario;
}
export const getAllCoordenadores = async (id: number, page?: number, limit?: number, filter?: string): Promise<Pedido[] | Error> => {
    try {

        const result = pedidoRepository.createQueryBuilder('pedido')
            .leftJoinAndSelect('pedido.justificativas', 'justificativa')
            .leftJoinAndMapOne('pedido.usuario', Usuario, 'usuario', 'pedido.vendedor = usuario.codigo_vendedor')
            .addOrderBy('justificativa.id', 'ASC')
            .orderBy('pedido.id', 'DESC')
            .where('usuario.parent.id = :id', { id: id })
            .andWhere('pedido.status = :status', { status: Status.ABER });

        if (page && typeof page == 'string' && limit && typeof limit == 'string') {
            result.take(page * limit);
            result.take(limit);
        }

        if (typeof filter === 'string') {
            result.andWhere('LOWER(pedido.pedido) LIKE LOWER(:pedido)', { pedido: `%${filter}%` });
        }

        const pedidos = await result.getMany();


        return pedidos as IPedidoUsuario[];

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};