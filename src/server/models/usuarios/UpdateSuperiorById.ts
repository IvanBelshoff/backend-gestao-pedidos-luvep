import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';
import { IBodySuperior } from '../../shared/interfaces';


const atualizaSuperior = async (id: number, parent: number): Promise<null | Usuario | Error> => {

    if (parent == 0) {
        return null;
    }

    const usuarioSuperior = await usuarioRepository.findOne({
        relations: {
            parent: true,
            children: true
        },
        where: {
            id: parent
        }
    });

    if (!usuarioSuperior) {
        return new Error('parent não localizado');
    }

    const usuario = await usuarioRepository.findOne({
        relations: {
            parent: true,
            children: true
        },
        where: {
            id: id
        }
    });

    if (usuarioSuperior && usuario) {

        if (usuario.id === usuarioSuperior.id) {
            return new Error('Você não pode adicionar você mesmo como superior');
        }

        const superiorSubordinado = usuario.children.filter(func => func.id == parent);

        if (superiorSubordinado.length > 0) {
            return new Error(`Funcionário ${usuarioSuperior.nome} não pode ser adicionado como superior, pois ele é seu subordinado`);
        }

        if (usuarioSuperior.bloqueado == false) {
            return new Error('Você não pode adicionar um funcionário desligado como seu superior');
        }

        return usuarioSuperior;

    } else {
        return null;
    }
};

export const updateSuperiorById = async (id: number, usuario: IBodySuperior): Promise<void | Error> => {

    try {

        const usuarioCadastrado = await usuarioRepository.findOne({
            relations: {
                parent: true,
                children: true
            },
            where: {
                id
            }
        });

        if (!usuarioCadastrado) {
            return new Error('Usuario não localizado');
        }

        const idSuperior = usuarioCadastrado?.parent?.id || 0;

        const { parent = usuario.parent || idSuperior } = usuario;

        const superiorUsuario = await usuarioRepository.findOne({
            relations: {
                parent: true
            },
            where: {
                id: parent
            }
        });

        if (superiorUsuario) {
            usuarioCadastrado.parent = superiorUsuario;
        }

        if (usuario.parent || usuario.parent == 0) {

            const superiorAtualzado = await atualizaSuperior(id, usuario.parent);

            if (superiorAtualzado instanceof Error) {

                return new Error(superiorAtualzado.message);

            }

            usuarioCadastrado.parent = superiorAtualzado;
        }

        await usuarioRepository.save(usuarioCadastrado);

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};