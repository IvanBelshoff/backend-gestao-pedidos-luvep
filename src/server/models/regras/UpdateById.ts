import { IBodyUpdateRegras } from '../../shared/interfaces';
import { regraRepository } from '../../database/repositories';

export const updateById = async (id: number, regra: IBodyUpdateRegras): Promise<void | Error> => {

    try {

        const regrasCadastradas = await regraRepository.findOne({
            where: {
                id: id
            }
        });

        if (!regrasCadastradas) {
            return new Error('Regra não existe');
        }

        //Verifica se já existe uma regra com o nome fornecido.
        const regrasNomes = await regraRepository.findOneBy({ nome: regra.nome });

        let RegrasNomesIguais = true;

        if (regrasCadastradas.nome === regra.nome && regrasCadastradas) {
            RegrasNomesIguais = false;
        }

        if (regrasNomes && RegrasNomesIguais === true) {
            return new Error('Já existe Permissao com este nome');
        }

        const { nome = regra.nome || regrasCadastradas.nome, descricao = regra.descricao || regrasCadastradas.descricao } = regra;

        await regraRepository.update({ id: id }, {
            nome: nome,
            descricao: descricao,
        });

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};