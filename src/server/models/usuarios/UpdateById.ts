import { Foto } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';
import { IBodyUpdateByIdUsuarios } from '../../shared/interfaces';
import { PasswordCrypto } from '../../shared/services';
import { FotosProvider } from '../fotos';

export const updateById = async (id: number, usuario: IBodyUpdateByIdUsuarios, foto?: Omit<Foto, 'id' | 'data_atualizacao' | 'data_criacao' | 'usuario' | 'url'>): Promise<void | Error> => {

    try {

        if (foto) {
            const updateFoto = FotosProvider.updateById(id, 'atualizar', foto);

            if (updateFoto instanceof Error) {
                return new Error(updateFoto.message);
            }
        }

        const usuarioCadastrado = await usuarioRepository.findOne({
            relations: {
                parent: true,
                children: true
            },
            where: {
                id: id
            }
        });

        if (!usuarioCadastrado) {
            return new Error('Funcionario não localizado');
        }
        
        if (usuario?.senha) {
            const senhaHash = await PasswordCrypto.hashPassword(usuario.senha);
            usuarioCadastrado.senha = senhaHash;
        }

        const {
            nome = usuario.nome || usuarioCadastrado.nome,
            sobrenome = usuario.sobrenome || usuarioCadastrado.sobrenome,
            email = usuario.email || usuarioCadastrado.email,
            localidade = usuario.localidade || usuarioCadastrado.localidade,
            codigo_vendedor = usuario.codigo_vendedor || usuarioCadastrado.codigo_vendedor,
            bloqueado = usuario?.bloqueado || usuarioCadastrado.bloqueado,
            tipo_usuario = usuario.tipo_usuario || usuarioCadastrado.tipo_usuario
        } = usuario;

        if (usuarioCadastrado.bloqueado == true && (usuario.bloqueado == false || String(usuario.bloqueado) == 'false')) {

            // Desvincula o parent do funcionário, se existir
            if (usuarioCadastrado.parent) {
                usuarioCadastrado.parent = null;
            }

            // Desvincula os children do funcionário
            if (usuarioCadastrado.children && usuarioCadastrado.children.length > 0) {

                usuarioCadastrado.children = [];
            }
        }

        usuarioCadastrado.nome = nome,
        usuarioCadastrado.sobrenome = sobrenome,
        usuarioCadastrado.bloqueado = String(bloqueado) == 'false' ? false : true,
        usuarioCadastrado.email = email,
        usuarioCadastrado.codigo_vendedor = codigo_vendedor,
        usuarioCadastrado.localidade = localidade,
        usuarioCadastrado.tipo_usuario = tipo_usuario,

        await usuarioRepository.save(usuarioCadastrado);

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};