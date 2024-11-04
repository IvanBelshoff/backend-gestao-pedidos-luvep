import { Regra } from '../../database/entities';
import { regraRepository } from '../../database/repositories';

export const getAll = async (
    page?: number,
    limit?: number,
    filter?: string
): Promise<Regra[] | Error> => {

    try {
        const result = regraRepository.createQueryBuilder('regra')
            .orderBy('regra.id', 'DESC')
            .leftJoinAndSelect('regra.permissao', 'permissao')
            .addOrderBy('permissao.nome', 'ASC');

        if (page && typeof page == 'string' && limit && typeof limit == 'string') {
            result.take(page * limit);
            result.take(limit);
        }

        if (typeof filter === 'string') {
            result.andWhere('LOWER(regra.nome) LIKE LOWER(:nome)', { nome: `%${filter}%` });
        }

        const regras = await result.getMany();

        return regras;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};