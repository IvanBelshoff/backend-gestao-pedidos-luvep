import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';


export const getAll = async (
    page?: number,
    limit?: number,
    filter?: string): Promise<Omit<Usuario, 'senha' | 'foto'>[] | Error> => {
    try {

        const result = usuarioRepository.createQueryBuilder('usuario')
            .orderBy('usuario.nome', 'DESC');

        if (page && typeof page == 'string' && limit && typeof limit == 'string') {
            result.take(page * limit);
            result.take(limit);
        }

        if (typeof filter === 'string') {
            result.andWhere('LOWER(usuario.nome) LIKE LOWER(:nome)', { nome: `%${filter}%` });
        }

        const usuarios = await result.getMany();


        const newUsers: Omit<Usuario, 'senha' | 'foto'>[] = usuarios.map(user => ({
            id: user.id,
            nome: user.nome,
            bloqueado: user.bloqueado,
            sobrenome: user.sobrenome,
            email: user.email,
            data_criacao: user.data_criacao,
            data_atualizacao: user.data_atualizacao,
            regra: user.regra,
            permissao: user.permissao,
            ultimo_login: user.ultimo_login,
            usuario_atualizador: user.usuario_atualizador,
            usuario_cadastrador: user.usuario_cadastrador
        }));

        return newUsers;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};