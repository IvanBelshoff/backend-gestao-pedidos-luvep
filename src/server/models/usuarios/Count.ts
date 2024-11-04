import { usuarioRepository } from '../../database/repositories';

export const count = async (filter?: string): Promise<number | Error> => {
    try {

        const result = usuarioRepository.createQueryBuilder('usuario')
            .select('usuario');

        if (typeof filter === 'string') {
            result.andWhere('LOWER(usuario.nome) LIKE LOWER(:nome)', { nome: `%${filter}%` });
        }

        const count = await result.getCount();

        return count;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar a quantidade total de registros');
    }
};