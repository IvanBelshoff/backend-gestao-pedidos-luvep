import path from 'path';

import { fotoRepository } from '../../database/repositories/fotoRepository';
import { usuarioRepository } from '../../database/repositories';
import { IBodyCreateUsuarios } from '../../shared/interfaces';
import { PasswordCrypto, deleteArquivo } from '../../shared/services';
import { Permissao, Regra } from '../../database/entities';

interface IFoto extends IBodyCreateUsuarios {
    id_foto: number
    file: boolean
}

const regrasCopiadas = async (id?: number): Promise<Error | { regras: Regra[]; permissoes: Permissao[]; }> => {

    if (id) {

        const usuarioCopiado = await usuarioRepository.findOne({
            relations: {
                regra: true,
                permissao: true
            },
            where: {
                id: id
            }
        });

        if (!usuarioCopiado) {
            return new Error('Usuário copiado não localizado');
        }

        return {
            regras: usuarioCopiado.regra || [],
            permissoes: usuarioCopiado.permissao || []
        };
    }

    return {
        regras: [],
        permissoes: []
    };
};

export const create = async (usuario: IFoto): Promise<number | Error> => {

    const local = path.resolve(__dirname, '..', '..', '..', 'shared', 'img', 'default\\profile.jpg');
    const originalname = 'profile.jpg';

    try {

        const { id_foto, id_copy_regras } = usuario;

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

        const regrasEPermissoes = await regrasCopiadas(id_copy_regras);

        if (regrasEPermissoes instanceof Error) {

            return new Error(regrasEPermissoes.message);
        }

        const newUsuario = usuarioRepository.create({
            ...usuario,
            senha: hashedPassword,
            regra: regrasEPermissoes.regras,
            permissao: regrasEPermissoes.permissoes,
            usuario_atualizador: usuario.usuario_atualizador,
            usuario_cadastrador: usuario.usuario_cadastrador,
            foto: fotoCadastrada
        });

        const result = await usuarioRepository.save(newUsuario);

        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }

        return new Error('Erro ao cadastrar o registro');

    } catch (error) {

        console.log(error);

        if (usuario.file == false) {
            deleteArquivo(local, originalname, true);
            return new Error('Erro ao cadastrar o registro');
        }

        return new Error('Erro ao cadastrar o registro');
    }
};