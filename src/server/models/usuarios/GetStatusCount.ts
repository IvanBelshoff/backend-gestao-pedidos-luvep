import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';

export const getStatusCount = async (email: string): Promise<Usuario | Error> => {

    try {

        const result = await usuarioRepository.findOne({
            where: {
                email: email
            }
        });

        if (result) {

            if (result.bloqueado == true) {

                return new Error('Usuário Bloqueado');
            }

            return result;

        }

        return new Error('Registro não encontrado');
    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar o registro');
    }
};