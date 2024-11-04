import * as fs from 'fs';
import { fotoRepository } from '../../database/repositories';

export const deleteArquivo = async (local: String, nome: String, excluirNoBanco = true): Promise<void | Error> => {

    try {

        if (excluirNoBanco == true) {

            if (fs.existsSync(String(local)) && nome != 'profile.jpg') {

                fs.unlink(String(local), (erro) => {
                    if (erro) {
                        console.log(erro);
                        return new Error(erro.message);

                    }
                    console.log('\nFoto original foi excluida localmente');
                });
            }

            if (!fs.existsSync(String(local))) {
                console.log('\nFoto original não foi localizada');
            }

            if (nome == 'profile.jpg') {
                console.log('\nFoto padrao não pode ser excluida');
            }

            const foto = await fotoRepository.findOne({
                where: {
                    originalname: String(nome)
                }
            });

            if (foto) {

                const fotoDelete = await fotoRepository.delete({ id: foto.id });

                if (fotoDelete instanceof Error) {
                    console.log('Erro ao excluir foto do banco:' + fotoDelete.message);
                    return new Error(fotoDelete.message);
                }

                console.log('\nFoto original foi excluida no banco de dados\n');

                return;
            }

        } else {

            if (fs.existsSync(String(local)) && nome != 'profile.jpg') {

                fs.unlink(String(local), (erro) => {
                    if (erro) {
                        console.log(erro);
                        return new Error(erro.message);

                    }
                    console.log('\nFoto original foi excluida localmente');
                });
            }

            if (!fs.existsSync(String(local))) {
                console.log('\nFoto original não foi localizada');
            }

            if (nome == 'profile.jpg') {
                console.log('\nFoto padrao não pode ser excluida');
            }

            return;
        }


    } catch (error) {
        console.log(error);
        return new Error(error as string);
    }

};