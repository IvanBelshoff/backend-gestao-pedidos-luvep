import { Permissao } from '../../database/entities';
import { permissaoRepository } from '../../database/repositories';

export const getById = async (id: number): Promise<Permissao | Error> => {
    try {
        const result = await permissaoRepository.findOne({
            relations: {
                regra: true
            },
            where: {
                id: id
            }
        });

        if (!result) {
            return new Error('Permissão não encontrada');
        }

        return result;

    } catch (error) {
        console.log(error);
        return new Error('Registro não encontrado');
    }
};