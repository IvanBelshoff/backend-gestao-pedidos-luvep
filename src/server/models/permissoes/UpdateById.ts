
import { IBodyUpdatePermissoes } from '../../shared/interfaces';
import { permissaoRepository, regraRepository } from '../../database/repositories';

export const updateById = async (id: number, permissao: IBodyUpdatePermissoes): Promise<void | Error> => {

    try {

        const permissoesCadastradas = await permissaoRepository.findOne({
            relations: {
                regra: true
            },
            where: {
                id: id
            }
        });

        if (!permissoesCadastradas) {
            return new Error('Permissao não existe');
        }

        //Verifica se já existe uma regra com o nome fornecido.
        const permissoesNomes = await permissaoRepository.findOneBy({ nome: permissao.nome });

        let PermissoesNomesIguais = true;

        if (permissoesCadastradas.nome === permissao.nome && permissoesNomes) {
            PermissoesNomesIguais = false;
        }

        if (permissoesNomes && PermissoesNomesIguais === true) {
            return new Error('Já existe Permissao com este nome');
        }

        const { nome = permissao.nome || permissoesCadastradas.nome, descricao = permissao.descricao || permissoesCadastradas.descricao, regra_id = permissao.regra_id || permissoesCadastradas.regra.id } = permissao;
    
        if (permissao.regra_id) {

            const regrasCadastradas = await regraRepository.findAndCount({
                where: {
                    id: regra_id
                }
            });

            if (regrasCadastradas[1] == 0) {
                return new Error('Regra não existe');
            }

        }

        await permissaoRepository.update({ id: id }, {
            nome: nome,
            descricao: descricao,
            regra: {
                id: regra_id
            }
        });

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};