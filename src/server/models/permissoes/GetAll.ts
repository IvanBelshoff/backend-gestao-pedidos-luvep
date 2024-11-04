import { Permissao } from '../../database/entities';
import { permissaoRepository } from '../../database/repositories';

export const getAll = async (
    page?: number,
    limit?: number,
    filter?: string): Promise<Permissao[] | Error> => {
    try {


        const result = permissaoRepository.createQueryBuilder('permissao')
            .leftJoinAndSelect('permissao.regra', 'regra')
            .addOrderBy('regra.id', 'ASC')
            .orderBy('permissao.id', 'DESC');

        if (page && typeof page == 'string' && limit && typeof limit == 'string') {
            result.take(page * limit);
            result.take(limit);
        }

        if (typeof filter === 'string') {
            result.andWhere('LOWER(permissao.nome) LIKE LOWER(:nome)', { nome: `%${filter}%` });
        }

        const permissoes = await result.getMany();

        return permissoes;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};