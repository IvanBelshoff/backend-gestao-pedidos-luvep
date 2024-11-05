
import { fotoRepository } from '../../database/repositories/fotoRepository';
import path from 'path';
import { deleteArquivoLocal } from '../../shared/services';


export const createNoFile = async (): Promise<number | Error> => {

    const local = path.resolve(__dirname, '..', '..', '..', 'shared', 'data', 'default\\profile.jpg');
    const originalname = 'profile.jpg';

    try {

        const newFoto = fotoRepository.create({
            local: local,
            nome: 'profile.jpg',
            originalname: 'profile.jpg',
            tamanho: 6758,
            width: 462,
            height: 462,
            url: `http://${process.env.HOST}:${process.env.PORT}/profile/profile.jpg`,
            tipo: 'jpg'
        });

        const result = await fotoRepository.save(newFoto);

        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }

        return new Error('Erro ao cadastrar ao salvar foto');

    } catch (error) {
        console.log(error);
        deleteArquivoLocal(local, originalname);
        return new Error('Erro ao cadastrar ao salvar foto');
    }

};