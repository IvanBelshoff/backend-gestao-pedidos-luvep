import mime from 'mime';

import { Foto } from '../../database/entities';
import { fotoRepository } from '../../database/repositories/fotoRepository';
import path from 'path';
import { deleteArquivo } from '../../shared/services';

export const updateById = async (id: number, metodo: 'excluir' | 'atualizar', foto?: Omit<Foto, 'id' | 'data_atualizacao' | 'data_criacao' | 'colaborador' | 'usuario' | 'url'>): Promise<void | Error> => {

    try {

        const localFotoProfile = path.resolve(__dirname, '..', '..', '..', 'shared', 'data', 'default\\profile.jpg');

        const originalnameProfile = 'profile.jpg';

        if (metodo == 'atualizar' && foto) {

            const { local, nome, originalname, tamanho, tipo, width, height } = foto;

            const fotoRecuperada = await fotoRepository.findOne({
                where: {
                    usuario: {
                        id: id
                    }
                }
            });

            if (!fotoRecuperada) {
                return new Error('Foto não localizada');
            }

            const deleteFotoOriginal = await deleteArquivo(fotoRecuperada.local, fotoRecuperada.originalname, false);

            if (deleteFotoOriginal instanceof Error) {
                return new Error(deleteFotoOriginal.message);
            } else {

                console.log('foto foi devidamente excluida');
                fotoRecuperada.nome = nome,
                    fotoRecuperada.originalname = originalname,
                    fotoRecuperada.tamanho = tamanho,
                    fotoRecuperada.local = local,
                    fotoRecuperada.tipo = mime.extension(tipo) as string,
                    fotoRecuperada.url = `http://${process.env.HOST}:${process.env.PORT}/uploads/fotos/usuarios/${nome}`,
                    fotoRecuperada.width = width,
                    fotoRecuperada.height = height

                await fotoRepository.save(fotoRecuperada);
            }

        } else {

            const fotoRecuperada = await fotoRepository.findOne({
                where: {
                    usuario: {
                        id: id
                    }
                }
            });

            if (!fotoRecuperada) {
                return new Error('Foto não localizada');
            }

            const deleteFotoOriginal = await deleteArquivo(fotoRecuperada.local, fotoRecuperada.originalname, false);

            if (deleteFotoOriginal instanceof Error) {
                return new Error(deleteFotoOriginal.message);
            } else {

                console.log('foto foi devidamente excluida');
                fotoRecuperada.nome = 'profile.jpg',
                    fotoRecuperada.originalname = originalnameProfile,
                    fotoRecuperada.tamanho = 6758,
                    fotoRecuperada.local = localFotoProfile,
                    fotoRecuperada.tipo = 'jpg',
                    fotoRecuperada.url = `http://${process.env.HOST}:${process.env.PORT}/profile/profile.jpg`,
                    fotoRecuperada.width = 462,
                    fotoRecuperada.height = 462

                    await fotoRepository.save(fotoRecuperada);
            }

        }

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};