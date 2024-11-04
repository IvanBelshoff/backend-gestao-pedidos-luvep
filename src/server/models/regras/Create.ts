
import { IBodyCreateRegras } from '../../shared/interfaces';
import { regraRepository } from '../../database/repositories';

export const create = async (regra: IBodyCreateRegras): Promise<number | Error> => {

    try {

        const { nome } = regra;

        const permissoesCadastradas = await regraRepository.findAndCount({
            where: {
                nome: nome
            }
        });

        if (permissoesCadastradas[1] != 0) {
            return new Error('Regra já cadastrada');
        }

        const newRegra = regraRepository.create(regra);

        const result = await regraRepository.save(newRegra);

        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }

        return new Error('Erro ao cadastrar o registro');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao cadastrar o registro');
    }

};