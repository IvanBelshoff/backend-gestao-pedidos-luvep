import { fotoRepository } from '../../database/repositories';

export const deleteById = async (id: number): Promise<void | Error> => {

    try {
        const foto = await fotoRepository.findOne({
            where: {
                id: id
            }
        });

        if (!foto) {
            return new Error('Usuario não localizado');
        }

        await fotoRepository.delete({ id: id });

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao apagar o registro');
    }
};