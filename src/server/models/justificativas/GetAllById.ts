import { Justificativa } from '../../database/entities';
import { justificativaRepository } from '../../database/repositories';

export const getAllById = async (id: number): Promise<Justificativa[] | Error> => {

    try {
        const result = await justificativaRepository.createQueryBuilder('justificativa')
            .orderBy('justificativa.id', 'DESC')
            .leftJoinAndSelect('justificativa.pedido', 'pedido')
            .where('pedido.id = :id', { id: id })
            .getMany();

        return result;

    } catch (error) {
        console.log(error);
        return new Error('Registro não encontrado');
    }
};