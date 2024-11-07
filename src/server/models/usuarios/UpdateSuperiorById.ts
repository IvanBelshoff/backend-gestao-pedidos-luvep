import { TipoUsuario, Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';
import { IBodySuperior } from '../../shared/interfaces';


const atualizaSuperior = async (id: number, parent: number): Promise<null | Usuario | Error> => {

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
        return new Error('Superior não localizado');
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

        if ((usuarioSuperior.tipo_usuario == TipoUsuario.CON || usuarioSuperior.tipo_usuario == TipoUsuario.COOR || usuarioSuperior.tipo_usuario == TipoUsuario.GER) && usuario.tipo_usuario === TipoUsuario.ADM) {
            return new Error('Administradores não podem ter superiores');
        }

        if (usuarioSuperior.tipo_usuario == TipoUsuario.ADM && (usuario.tipo_usuario == TipoUsuario.GER || usuario.tipo_usuario == TipoUsuario.COOR || usuario.tipo_usuario == TipoUsuario.ADM || usuario.tipo_usuario == TipoUsuario.CON)) {
            return new Error('Você não pode adicionar um administrador como seu superior');
        }

        if (usuarioSuperior.tipo_usuario == TipoUsuario.COOR && usuario.tipo_usuario == TipoUsuario.COOR) {
            return new Error('Você não pode adicionar um coordenador como seu superior');
        }

        if (usuarioSuperior.tipo_usuario == TipoUsuario.CON && usuario.tipo_usuario == TipoUsuario.COOR) {
            return new Error('Você não pode adicionar um consultor como seu superior');
        }

        if (usuarioSuperior.tipo_usuario == TipoUsuario.CON && usuario.tipo_usuario == TipoUsuario.CON) {
            return new Error('Você não pode adicionar um consultor como seu superior');
        }

        if ((usuarioSuperior.tipo_usuario == TipoUsuario.CON || usuarioSuperior.tipo_usuario == TipoUsuario.COOR) && usuario.tipo_usuario == TipoUsuario.GER) {
            return new Error('Você não pode adicionar um gerente como seu superior');
        }

        const superiorSubordinado = usuario.children.filter(usuario => usuario.id == parent);

        if (superiorSubordinado.length > 0) {
            return new Error(`Usuário ${usuarioSuperior.nome} não pode ser adicionado como superior, pois ele é seu subordinado`);
        }

        if (usuarioSuperior.bloqueado == true) {
            return new Error('Você não pode adicionar um usuário desligado como seu superior');
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

        const idSuperior = usuarioCadastrado?.parent?.id;

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