import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';


interface ISuperiores {
    parentDisponiveis: Omit<Usuario, 'parent' | 'children'>[] | [],
    parent: Usuario | null
}

const buildTree = (funcionarioId: number, allFuncionarios: Usuario[]): Usuario | undefined => {
    const originalFuncionario = allFuncionarios.find(f => f.id === funcionarioId);

    if (originalFuncionario) {

        if (originalFuncionario.children) {
            originalFuncionario.children = originalFuncionario.children.map(sub => buildTree(sub.id, allFuncionarios)).filter(Boolean) as Usuario[];
        }

        return originalFuncionario;
    }

    return undefined;
};

const getAllSubordinateIds = (funcionario: Usuario): number[] => {
    let ids: number[] = [];
    if (funcionario.children) {
        for (const sub of funcionario.children) {
            ids.push(sub.id);
            ids = ids.concat(getAllSubordinateIds(sub));
        }
    }
    return ids;
};

export const getSuperioresById = async (id: number): Promise<ISuperiores | Error> => {
    try {
        const funcionario = await usuarioRepository.findOne({
            relations: {
                parent: true,
                children: true
            },
            where: {
                id: id
            },
            order: {
                parent: {
                    nome: 'ASC'
                }
            }
        });

        if (!funcionario) {
            return new Error('Registro não encontrado');
        }

        const allfuncionarios = await usuarioRepository.find({ relations: ['children', 'parent'] });

        // Aqui você construirá a árvore completa de children.
        const tree = buildTree(funcionario.id, allfuncionarios);

        if (!tree) {
            return new Error('Erro ao construir árvore de children.');
        }

        // Obtenha todos os IDs de children de todos os níveis
        const allSubordinateIds = getAllSubordinateIds(tree);

        const funcionariosDisponiveis = allfuncionarios.filter(
            func => func.id !== id && func.id !== funcionario.parent?.id && !allSubordinateIds.includes(func.id)
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const funcionariosDisponiveisFiltrados = funcionariosDisponiveis.map(({ children, parent, ...rest }) => rest);

        const superiores: ISuperiores = {
            parent: funcionario.parent,
            parentDisponiveis: funcionariosDisponiveisFiltrados.filter((func) => func.bloqueado == true)
        };

        return superiores;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao buscar os registros');
    }
};
