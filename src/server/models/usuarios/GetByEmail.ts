import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';

export const getByEmail = async (email: string): Promise<Usuario | Error> => {
    try {

        const result = await usuarioRepository.findOne({
            relations: {
                permissao: true,
                regra: true
            },
            where: {
                email: email
            }
        });

        if (!result) {
            return new Error('E-mail não encontrado');
        }

        return result;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar o registro');
    }
};