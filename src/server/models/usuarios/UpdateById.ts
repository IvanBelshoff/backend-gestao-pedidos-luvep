import { usuarioRepository } from '../../database/repositories';

import { FotosProvider } from '../fotos';
import { Foto, Permissao, Regra } from '../../database/entities';
import { PasswordCrypto } from '../../shared/services';
import { IBodyUpdateByIdUsuarios } from '../../shared/interfaces';

const regrasCopiadas = async (id_usuario: number, id?: number): Promise<Error | { regras: Regra[]; permissoes: Permissao[]; }> => {

    if (id) {

        if (id === id_usuario) {
            return new Error('regras e permissoes não podem ser copiadas para o mesmo usuario');
        }

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

export const updateById = async (id: number, usuario: IBodyUpdateByIdUsuarios, foto?: Omit<Foto, 'id' | 'data_atualizacao' | 'data_criacao' | 'colaborador' | 'usuario' | 'url'>): Promise<void | Error> => {

    try {

        if (foto) {
            const updateFoto = FotosProvider.updateById(id, 'atualizar', foto);

            if (updateFoto instanceof Error) {
                return new Error(updateFoto.message);
            }
        }

        const usuarioCadastrado = await usuarioRepository.findOne({
            where: {
                id: id
            }
        });

        if (!usuarioCadastrado) {
            return new Error('Funcionario não localizado');
        }

        if (usuario.senha) {
            const senhaHash = await PasswordCrypto.hashPassword(usuario.senha);
            usuarioCadastrado.senha = senhaHash;
        }

        const {
            bloqueado = usuario.bloqueado || usuarioCadastrado.bloqueado,
            email = usuario.email || usuarioCadastrado.email,
            nome = usuario.nome || usuarioCadastrado.nome,
            sobrenome = usuario.sobrenome || usuarioCadastrado.sobrenome,
            usuario_atualizador = usuario.usuario_atualizador || usuarioCadastrado.usuario_atualizador,
            id_copy_regras
        } = usuario;

        if (id_copy_regras) {

            const regrasEPermissoes = await regrasCopiadas(id, id_copy_regras);

            if (regrasEPermissoes instanceof Error) {

                return new Error(regrasEPermissoes.message);

            }

            usuarioCadastrado.regra = regrasEPermissoes.regras;
            usuarioCadastrado.permissao = regrasEPermissoes.permissoes;

        }

        usuarioCadastrado.nome = nome,
            usuarioCadastrado.sobrenome = sobrenome,
            usuarioCadastrado.email = email,
            usuarioCadastrado.bloqueado = String(bloqueado) == 'false' ? false : true,
            usuarioCadastrado.usuario_atualizador = usuario_atualizador

        const atualizaUsuario = await usuarioRepository.save(usuarioCadastrado);

        if (atualizaUsuario instanceof Error) {
            return new Error(atualizaUsuario.message);
        }

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};