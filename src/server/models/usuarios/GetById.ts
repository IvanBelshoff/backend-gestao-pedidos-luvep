import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';


export const getById = async (id: number): Promise<Usuario | Error> => {

    try {
        const result = await usuarioRepository.findOne({
            relations: {
                foto: true,
                parent: true,
                children: true
            },
            where: {
                id: id
            }
        });

        if (result) {
            return result;
        }

        return new Error('Registro não encontrado');

    } catch (error) {
        console.log(error);
        return new Error('Registro não encontrado');
    }
};