

import { fotoRepository, usuarioRepository } from '../../database/repositories';
import { IBodyCreateUsuarios } from '../../shared/interfaces';
import { PasswordCrypto } from '../../shared/services';

interface IFoto extends IBodyCreateUsuarios {
    id_foto: number
}

export const create = async (usuario: IFoto): Promise<number | Error> => {

    try {

        const { id_foto } = usuario;

        const hashedPassword = await PasswordCrypto.hashPassword(String(usuario.senha));
        
        const fotoCadastrada = await fotoRepository.findOne({
            where: {
                id: id_foto
            }
        });

        if (!fotoCadastrada) {
            const erro = {
                default: 'Nenhuma foto cadastrada com este ID',
            };

            return new Error(JSON.stringify(erro));
        }

        const newFuncionario = usuarioRepository.create({
            ...usuario,
            senha: hashedPassword,
            foto: fotoCadastrada
        });

        const result = await usuarioRepository.save(newFuncionario);

        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }

        return new Error('Erro ao cadastrar o registro');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao cadastrar o registro');
    }
};