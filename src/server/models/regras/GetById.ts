import { Regra } from '../../database/entities';
import { regraRepository } from '../../database/repositories';

export const getById = async (id: number): Promise<Regra | Error> => {

    try {
        const result = await regraRepository.findOne({
            relations: {
                permissao: true
            },
            where: {
                id: id
            }
        });

        if (!result) {
            return new Error('Regra não encontrado');
        }

        return result;

    } catch (error) {
        console.log(error);
        return new Error('Registro não encontrado');
    }
};