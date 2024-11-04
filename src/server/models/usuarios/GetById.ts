import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';

export const getById = async (id: number): Promise<Usuario | Error> => {

    try {
        const result = await usuarioRepository.findOne({
            relations: {
                regra: true,
                permissao: true,
                foto: true
            },
            where: {
                id: id
            }
        });

        if (!result) {
            return new Error('Usuario não encontrado');
        }

        return result;

    } catch (error) {
        console.log(error);
        return new Error('Registro não encontrado');
    }
};