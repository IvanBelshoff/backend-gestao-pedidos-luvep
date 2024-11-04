import { IBodyUpdateById } from '../../shared/interfaces';
import { justificativaRepository } from '../../database/repositories';

export const updateById = async (id: number, justificativa: IBodyUpdateById): Promise<void | Error> => {

    try {

        const justificativaCadastrada = await justificativaRepository.findOne({
            where: {
                id: id
            }
        });

        if (!justificativaCadastrada) {
            return new Error('Justificativa não existe');
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