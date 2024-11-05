import { fotoRepository } from '../../database/repositories';

export const deleteByFilename = async (filename: string): Promise<void | Error> => {

    try {
        const foto = await fotoRepository.findOne({
            where: {
                nome: filename
            }
        });

        if (!foto) {
            return new Error('foto não localizada');
        }

        await fotoRepository.delete({ nome: filename });

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao apagar o registro');
    }
};