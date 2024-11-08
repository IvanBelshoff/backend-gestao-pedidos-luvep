import { Status, Usuario } from '../../database/entities';
import { pedidoRepository, usuarioRepository } from '../../database/repositories';

// Função para buscar os IDs dos coordenadores sob o gerente
const getCoordenadorIdsByGerenteId = async (gerenteId: number): Promise<number[]> => {
    const coordenadores = await usuarioRepository.createQueryBuilder('usuario')
        .select('usuario.id')
        .where('usuario.parent.id = :gerenteId', { gerenteId })
        .getMany();

    return coordenadores.map(coordenador => coordenador.id);
};

export const countAllGerentes = async (id: number, filter?: string): Promise<number | Error> => {
    try {

        const coordenadorIds = await getCoordenadorIdsByGerenteId(id);

        const result = pedidoRepository.createQueryBuilder('pedido')
            .leftJoinAndMapOne('pedido.usuario', Usuario, 'usuario', 'pedido.vendedor = usuario.codigo_vendedor')
            .where('usuario.parent.id IN (:...coordenadorIds)', { coordenadorIds })
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