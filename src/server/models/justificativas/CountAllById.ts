import { justificativaRepository } from '../../database/repositories';

export const countAllById = async (id: number): Promise<number | Error> => {

    try {
        const result = await justificativaRepository.createQueryBuilder('justificativa')
            .orderBy('justificativa.id', 'DESC')
            .leftJoinAndSelect('justificativa.pedido', 'pedido')
            .where('pedido.id = :id', { id: id })
            .getCount();

        return result;

    } catch (error) {
        console.log(error);
        return new Error('Registro não encontrado');
    }
};