import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';

export const getByEmail = async (email: string): Promise<Usuario | Error> => {
    try {

        const result = usuarioRepository.createQueryBuilder('usuario');
        result.leftJoinAndSelect('usuario.regra', 'regra');
        result.leftJoinAndSelect('usuario.permissao', 'permissao');

        result.where('(LOWER(usuario.email) LIKE LOWER(:email))', { email: `%${email}%` });

        const usuario = await result.getOne();

        if (usuario) {
            return usuario;
        }

        return new Error('Registro não encontrado');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar o registro');
    }
};