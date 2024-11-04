import { IBodyCreatePermissoes } from '../../shared/interfaces';
import { permissaoRepository, regraRepository } from '../../database/repositories';

export const create = async (permissao: IBodyCreatePermissoes): Promise<number | Error> => {

    try {

        const { nome, regra_id, descricao } = permissao;

        const permissoesCadastradas = await permissaoRepository.findAndCount({
            where: {
                nome
            }
        });

        if (permissoesCadastradas[1] != 0) {
            return new Error('Permissao já cadastrada com este nome');
        }

        const regraCadastrada = await regraRepository.findOne({
            where: {
                id: regra_id
            }
        });

        if (!regraCadastrada) {
            return new Error('Regra não existe');
        }
        
        const newPermissao = permissaoRepository.create({
            nome: nome,
            descricao: descricao,
            regra: regraCadastrada
        });

        const result = await permissaoRepository.save(newPermissao);

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