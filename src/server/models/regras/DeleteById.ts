import { regraRepository } from '../../database/repositories';

export const deleteById = async (id: number): Promise<void | Error> => {

    try {
        const result = await regraRepository.findOne({
            where: {
                id: id
            }
        });

        if (!result) {
            return new Error('Regra não encontrada');
        }

        await regraRepository.delete({ id: id });

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao apagar o registro');
    }

};