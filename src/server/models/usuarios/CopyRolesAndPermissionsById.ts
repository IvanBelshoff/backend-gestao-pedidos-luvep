import { usuarioRepository } from '../../database/repositories';

export const copyRolesAndPermissionsById = async (id_usuario: number, id_copiado: number): Promise<void | Error> => {

    try {

        if (id_copiado === id_usuario) {
            return new Error('regras e permissoes não podem ser copiadas para o mesmo usuario');
        }

        const usuarioCadastrado = await usuarioRepository.findOne({
            where: {
                id: id_usuario
            }
        });

        if (!usuarioCadastrado) {
            return new Error('Usuário não localizado');
        }


        const usuarioCopiado = await usuarioRepository.findOne({
            relations: {
                regra: true,
                permissao: true
            },
            where: {
                id: id_copiado
            }
        });

        if (!usuarioCopiado) {
            return new Error('Usuário copiado não localizado');
        }

        usuarioCadastrado.regra = usuarioCopiado.regra || [];
        usuarioCadastrado.permissao = usuarioCopiado.permissao || [];

        await usuarioRepository.save(usuarioCadastrado);

        if (usuarioRepository instanceof Error) {
            return new Error(usuarioRepository.message);
        }

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};