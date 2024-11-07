import mime from 'mime';
import { Foto } from '../../database/entities';
import { fotoRepository } from '../../database/repositories/fotoRepository';
import path from 'path';
import { deleteArquivoLocal } from '../../shared/services';

export const updateById = async (id: number, metodo: 'excluir' | 'atualizar', foto?: Omit<Foto, 'id' | 'data_atualizacao' | 'data_criacao' | 'usuario' | 'url'>): Promise<void | Error> => {

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

            const deleteFotoOriginal = await deleteArquivoLocal(fotoRecuperada.local, fotoRecuperada.nome);

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
                fotoRecuperada.height = height;

                const atualizaFoto = await fotoRepository.save(fotoRecuperada);

                if (atualizaFoto instanceof Error) {
                    return new Error(atualizaFoto.message);
                }

                return;
            }

        } else {

            const url = `http://${process.env.HOST}:${process.env.PORT}/profile/profile.jpg`;

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

            const deleteFotoOriginal = await deleteArquivoLocal(fotoRecuperada.local, fotoRecuperada.nome);

            if (deleteFotoOriginal instanceof Error) {
                return new Error(deleteFotoOriginal.message);
            } else {

                console.log('foto foi devidamente excluida');
                fotoRecuperada.nome = originalnameProfile,
                fotoRecuperada.originalname = originalnameProfile,
                fotoRecuperada.tamanho = 6758,
                fotoRecuperada.local = localFotoProfile,
                fotoRecuperada.tipo = 'jpg',
                fotoRecuperada.url = url,
                fotoRecuperada.width = 462,
                fotoRecuperada.height = 462;

                const atualizaFoto = await fotoRepository.save(fotoRecuperada);

                if (atualizaFoto instanceof Error) {
                    return new Error(atualizaFoto.message);
                }

                return;
            }

        }

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};