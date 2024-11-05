import { In } from 'typeorm';
import { usuarioRepository } from '../../database/repositories';
import { Usuario } from '../../database/entities';
import { IBodychildren } from '../../shared/interfaces';


const atualizachildren = async (id: number, children: number[]): Promise<[] | Usuario[] | Error> => {

    const filtrochildren: number[] = [];

    const usuario = await usuarioRepository.findOne({
        relations: {
            parent: true,
            children: true
        },
        where: {
            id: id
        }
    });

    if (usuario) {

        const quantidadeUsuarioschildrenRF = children.length;

        for (let i = 0; i <= (quantidadeUsuarioschildrenRF - 1); i++) {

            const usuariosFiltrados = await usuarioRepository.findOne({
                relations: {
                    children: true,
                    parent: true
                },
                where: {
                    id: children[i]
                }
            });

            if (usuariosFiltrados) {

                if (usuariosFiltrados.id == usuario.id) {
                    return new Error('Você não pode adicionar você mesmo como subordinado');
                }

                if (usuariosFiltrados.id == usuario.parent?.id) {
                    return new Error(`Usuario ${usuario.nome} não pode ser adicionado como subordinado, pois ele é seu superior`);
                }

                if (usuariosFiltrados.bloqueado == false) {
                    return new Error('Você não pode adicionar um funcionário desligado como seu superior');
                }

                if (usuariosFiltrados.parent) {
                    if (usuariosFiltrados.parent.id == usuario.id) {
                        filtrochildren.push(
                            usuariosFiltrados.id
                        );
                    } else {
                        return new Error(`Usuario ${usuariosFiltrados.nome} já possui um gestor: ${usuariosFiltrados.parent.nome}`);
                    }
                }

                if (!usuariosFiltrados?.parent) {
                    filtrochildren.push(
                        usuariosFiltrados.id
                    );
                }
            }
        }

        const usuariosRF = await usuarioRepository.findAndCount({ where: { id: In(filtrochildren) } });

        const childrenBD = usuario.children;

        const idschildrenBD = new Set(childrenBD.map(f => f.id));

        const idsUsuariosRF = new Set(usuariosRF[0].map(f => f.id));

        const mantidos = [...idschildrenBD].filter(id => idsUsuariosRF.has(id));

        const adicionados = [...idsUsuariosRF].filter(id => !idschildrenBD.has(id));

        const removidos = [...idschildrenBD].filter(id => !idsUsuariosRF.has(id));

        console.log('Mantidos:', mantidos.length, '(' + mantidos.join(',') + ')');
        console.log('Adicionados:', adicionados.length, '(' + adicionados.join(',') + ')');
        console.log('Removidos:', removidos.length, '(' + removidos.join(',') + ')');

        const idsNovoschildren = [...mantidos, ...adicionados];

        const novoschildren = await usuarioRepository.find({ where: { id: In(idsNovoschildren) } });

        return novoschildren;

    } else {
        return [];
    }

};

export const updateSubordinadosById = async (id: number, usuario: IBodychildren): Promise<void | Error> => {

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

        const idschildren = usuarioCadastrado?.children.map(subord => subord.id) || [];

        const { children = usuario.children || idschildren } = usuario;

        const childrenUsuarios = await usuarioRepository.findAndCount({
            relations: {
                children: true
            }, where: {
                id: In(children)
            }
        });

        if (childrenUsuarios[1] > 0) {
            usuarioCadastrado.children = childrenUsuarios[0];
        }

        if (usuario.children) {

            if (childrenUsuarios[1] !== usuario.children?.length) {

                return new Error('Algum subordinado não foi encontrado.');

            }

            const childrenAtualizados = await atualizachildren(id, usuario.children);

            if (childrenAtualizados instanceof Error) {

                return new Error(childrenAtualizados.message);

            }
            if (childrenAtualizados) {

                usuarioCadastrado.children = childrenAtualizados;

            }
        }
        await usuarioRepository.save(usuarioCadastrado);

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};