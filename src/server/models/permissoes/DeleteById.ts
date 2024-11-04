import { permissaoRepository } from '../../database/repositories';

export const deleteById = async (id: number): Promise<void | Error> => {

    try {

        const result = await permissaoRepository.findOne({
            where: {
                id: id
            }
        });

        if (!result) {
            return new Error('Permissão não encontrada');

        }

        await permissaoRepository.delete({ id: id });

        return;
        
    } catch (error) {
        console.log(error);
        return new Error('Erro ao apagar o registro');
    }

};