import { IBodySuperior } from '../../shared/interfaces';
import { Funcionario } from '../../database/entities';
import { funcionarioRepository } from '../../database/repositories/funcionarioRepository';

const atualizaSuperior = async (id: number, parent: number): Promise<null | Funcionario | Error> => {

    if (parent == 0) {
        return null;
    }

    const funcionarioSuperior = await funcionarioRepository.findOne({
        relations: {
            parent: true,
            children: true
        },
        where: {
            id: parent
        }
    });

    if (!funcionarioSuperior) {
        return new Error('parent não localizado');
    }

    const funcionario = await funcionarioRepository.findOne({
        relations: {
            parent: true,
            children: true
        },
        where: {
            id: id
        }
    });

    if (funcionarioSuperior && funcionario) {

        if (funcionario.id === funcionarioSuperior.id) {
            return new Error('Você não pode adicionar você mesmo como superior');
        }

        const superiorSubordinado = funcionario.children.filter(func => func.id == parent);

        if (superiorSubordinado.length > 0) {
            return new Error(`Funcionário ${funcionarioSuperior.nome} não pode ser adicionado como superior, pois ele é seu subordinado`);
        }

        if (funcionarioSuperior.ativo == false) {
            return new Error('Você não pode adicionar um funcionário desligado como seu superior');
        }

        return funcionarioSuperior;

    } else {
        return null;
    }
};

export const updateSuperiorById = async (id: number, funcionario: IBodySuperior): Promise<void | Error> => {

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

        const idSuperior = funcionarioCadastrado?.parent?.id || 0;

        const { parent = funcionario.parent || idSuperior } = funcionario;

        const superiorFuncionario = await funcionarioRepository.findOne({
            relations: {
                parent: true
            },
            where: {
                id: parent
            }
        });

        if (superiorFuncionario) {
            funcionarioCadastrado.parent = superiorFuncionario;
        }

        if (funcionario.parent || funcionario.parent == 0) {

            const superiorAtualzado = await atualizaSuperior(id, funcionario.parent);

            if (superiorAtualzado instanceof Error) {

                return new Error(superiorAtualzado.message);

            }

            funcionarioCadastrado.parent = superiorAtualzado;
        }

        await funcionarioRepository.save(funcionarioCadastrado);

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};