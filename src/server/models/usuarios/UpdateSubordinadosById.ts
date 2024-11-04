import { In } from 'typeorm';
import { IBodychildren } from '../../shared/interfaces';
import { funcionarioRepository } from '../../database/repositories/funcionarioRepository';
import { Funcionario } from '../../database/entities';


const atualizachildren = async (id: number, children: number[]): Promise<[] | Funcionario[] | Error> => {

    const filtrochildren: number[] = [];

    const funcionario = await funcionarioRepository.findOne({
        relations: {
            parent: true,
            children: true
        },
        where: {
            id: id
        }
    });

    if (funcionario) {

        const quantidadeFuncionarioschildrenRF = children.length;

        for (let i = 0; i <= (quantidadeFuncionarioschildrenRF - 1); i++) {

            const funcionariosFiltrados = await funcionarioRepository.findOne({
                relations: {
                    children: true,
                    parent: true
                },
                where: {
                    id: children[i]
                }
            });

            if (funcionariosFiltrados) {

                if (funcionariosFiltrados.id == funcionario.id) {
                    return new Error('Você não pode adicionar você mesmo como subordinado');
                }

                if (funcionariosFiltrados.id == funcionario.parent?.id) {
                    return new Error(`Funcionario ${funcionario.nome} não pode ser adicionado como subordinado, pois ele é seu superior`);
                }

                if (funcionariosFiltrados.ativo == false) {
                    return new Error('Você não pode adicionar um funcionário desligado como seu superior');
                }

                if (funcionariosFiltrados.parent) {
                    if (funcionariosFiltrados.parent.id == funcionario.id) {
                        filtrochildren.push(
                            funcionariosFiltrados.id
                        );
                    } else {
                        return new Error(`Funcionario ${funcionariosFiltrados.nome} já possui um gestor: ${funcionariosFiltrados.parent.nome}`);
                    }
                }

                if (!funcionariosFiltrados?.parent) {
                    filtrochildren.push(
                        funcionariosFiltrados.id
                    );
                }
            }
        }

        const funcionariosRF = await funcionarioRepository.findAndCount({ where: { id: In(filtrochildren) } });

        const childrenBD = funcionario.children;

        const idschildrenBD = new Set(childrenBD.map(f => f.id));

        const idsFuncionariosRF = new Set(funcionariosRF[0].map(f => f.id));

        const mantidos = [...idschildrenBD].filter(id => idsFuncionariosRF.has(id));

        const adicionados = [...idsFuncionariosRF].filter(id => !idschildrenBD.has(id));

        const removidos = [...idschildrenBD].filter(id => !idsFuncionariosRF.has(id));

        console.log('Mantidos:', mantidos.length, '(' + mantidos.join(',') + ')');
        console.log('Adicionados:', adicionados.length, '(' + adicionados.join(',') + ')');
        console.log('Removidos:', removidos.length, '(' + removidos.join(',') + ')');

        const idsNovoschildren = [...mantidos, ...adicionados];

        const novoschildren = await funcionarioRepository.find({ where: { id: In(idsNovoschildren) } });

        return novoschildren;

    } else {
        return [];
    }

};

export const updateSubordinadosById = async (id: number, funcionario: IBodychildren): Promise<void | Error> => {

    try {

        const funcionarioCadastrado = await funcionarioRepository.findOne({
            relations: {
                parent: true,
                children: true
            },
            where: {
                id
            }
        });

        if (!funcionarioCadastrado) {
            return new Error('Funcionario não localizado');
        }

        const idschildren = funcionarioCadastrado?.children.map(subord => subord.id) || [];

        const { children = funcionario.children || idschildren } = funcionario;

        const childrenFuncionarios = await funcionarioRepository.findAndCount({
            relations: {
                children: true
            }, where: {
                id: In(children)
            }
        });

        if (childrenFuncionarios[1] > 0) {
            funcionarioCadastrado.children = childrenFuncionarios[0];
        }

        if (funcionario.children) {

            if (childrenFuncionarios[1] !== funcionario.children?.length) {

                return new Error('Algum subordinado não foi encontrado.');

            }

            const childrenAtualizados = await atualizachildren(id, funcionario.children);

            if (childrenAtualizados instanceof Error) {

                return new Error(childrenAtualizados.message);

            }
            if (childrenAtualizados) {

                funcionarioCadastrado.children = childrenAtualizados;

            }
        }
        await funcionarioRepository.save(funcionarioCadastrado);

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};