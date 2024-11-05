import { IBodyUpdateById } from '../../shared/interfaces';
import { justificativaRepository } from '../../database/repositories';
import { Usuario } from '../../database/entities';

export const updateById = async (id: number, justificativa: IBodyUpdateById, usuario: Usuario): Promise<void | Error> => {

    try {

        const justificativaCadastrada = await justificativaRepository.findOne({
            relations: {
                pedido: true
            },
            where: {
                id: id
            }
        });

        if (!justificativaCadastrada) {
            return new Error('Justificativa não existe');
        }

        if (justificativaCadastrada.pedido.vendedor != usuario.codigo_vendedor) {
            return new Error('Usuário não autorizado a atualizar esta justificativa');
        }

        const { conteudo = justificativa.conteudo || justificativaCadastrada.conteudo } = justificativa;

        const result = await justificativaRepository.update({ id: id }, {
            conteudo: conteudo,
        });

        if (result.affected === 0 || result instanceof Error) {
            return new Error('Erro ao atualizar o registro');
        }

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};