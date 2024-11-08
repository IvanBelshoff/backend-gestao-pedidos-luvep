import { Pedido, Status, Usuario } from '../../database/entities';
import { pedidoRepository, usuarioRepository } from '../../database/repositories';

interface IPedidoUsuario extends Pedido {
    usuario: Usuario;
}

// Função para buscar os IDs dos coordenadores sob o gerente
const getCoordenadorIdsByGerenteId = async (gerenteId: number): Promise<number[]> => {
    const coordenadores = await usuarioRepository.createQueryBuilder('usuario')
        .select('usuario.id')
        .where('usuario.parent.id = :gerenteId', { gerenteId })
        .getMany();

    return coordenadores.map(coordenador => coordenador.id);
};

export const getAllGerentes = async (id: number, page?: number, limit?: number, filter?: string): Promise<Pedido[] | Error> => {
    try {
        
        const coordenadorIds = await getCoordenadorIdsByGerenteId(id);

        const result = pedidoRepository.createQueryBuilder('pedido')
            .leftJoinAndSelect('pedido.justificativas', 'justificativa')
            .leftJoinAndMapOne('pedido.usuario', Usuario, 'usuario', 'pedido.vendedor = usuario.codigo_vendedor')
            .addOrderBy('justificativa.id', 'ASC')
            .orderBy('pedido.id', 'DESC')
            .where('usuario.parent.id IN (:...coordenadorIds)', { coordenadorIds })
            .andWhere('pedido.status = :status', { status: Status.ABER });

        if (page && typeof page === 'string' && limit && typeof limit === 'string') {
            result.take(page * parseInt(limit, 10)).skip((parseInt(page, 10) - 1) * parseInt(limit, 10));
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
