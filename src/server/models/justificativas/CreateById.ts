import { Usuario } from '../../database/entities';
import { justificativaRepository, pedidoRepository } from '../../database/repositories';

export const createById = async (id: number, conteudo: string, usuario: Usuario): Promise<number | Error> => {

    try {

        const pedido = await pedidoRepository.findOne({ where: { id: id } });

        if (!pedido) {
            return new Error('Pedido não encontrado');
        }

        if (pedido.vendedor != usuario.codigo_vendedor) {
            return new Error('Usuário não autorizado a cadastrar esta justificativa');
        }

        const newJustificativa = justificativaRepository.create({
            conteudo: conteudo,
            pedido: pedido
        });

        const result = await justificativaRepository.save(newJustificativa);

        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }

        return new Error('Erro ao salvar justificativa');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao salvar justificativa');
    }

};