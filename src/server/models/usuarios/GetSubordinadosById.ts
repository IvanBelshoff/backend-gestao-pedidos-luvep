import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';

interface Ichildren {
    childrenDisponiveis: Omit<Usuario, 'parent' | 'children'>[] | [],
    children: Usuario[] | null
}

const buildTree = (usuarioId: number, allUsuarios: Usuario[]): Usuario | undefined => {

    const originalUsuario = allUsuarios.find(f => f.id === usuarioId);

    if (originalUsuario) {

        if (originalUsuario.children) {
            originalUsuario.children = originalUsuario.children.map(sub => buildTree(sub.id, allUsuarios)).filter(Boolean) as Usuario[];
        }

        return originalUsuario;
    }

    return undefined;
};

const getAllSubordinateIds = (usuario: Usuario): number[] => {
    let ids: number[] = [];
    if (usuario.children) {
        for (const sub of usuario.children) {
            ids.push(sub.id);
            ids = ids.concat(getAllSubordinateIds(sub));
        }
    }
    return ids;
};

const getAllSuperiors = (usuarioId: number, allUsuarios: Usuario[]): number[] => {

    let parent = allUsuarios.find(func => func.id === usuarioId)?.parent;
    const ids: number[] = [];

    while (parent) {
        ids.push(parent.id);
        parent = allUsuarios.find(func => func.id === parent?.id)?.parent;
    }

    return ids;
};

const filterByName = (items: Usuario[], query: string) =>
    items.filter(item =>
        item.nome.toLowerCase().includes(query.toLowerCase())
    );


export const getSubordinadosById = async (id: number, children?: string, childrenDisponiveis?: string): Promise<Ichildren | Error> => {
    try {
        const usuario = await usuarioRepository.findOne({
            relations: {
                parent: true,
                children: true
            },
            where: {
                id: id
            },
            order: {
                children: {
                    nome: 'ASC'
                }
            }
        });

        if (!usuario) {
            return new Error('Registro não encontrado');
        }

        const allUsuarios = await usuarioRepository.find({ relations: ['children', 'parent'], order: { nome: 'ASC' } });

        const tree = buildTree(usuario.id, allUsuarios);

        if (!tree) {
            return new Error('Erro ao construir árvore de children.');
        }

        const allSubordinateIds = getAllSubordinateIds(tree);

        const allparentIds = getAllSuperiors(usuario.id, allUsuarios);

        const usuariosDisponiveis = allUsuarios.filter(
            func => func.id !== id
                && !func.parent
                && !allSubordinateIds.includes(func.id)
                && !allparentIds.includes(func.id)
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let usuariosDisponiveisFiltrados = usuariosDisponiveis.map(({ children, parent, ...rest }) => rest);

        // Se o parâmetro 'children' foi fornecido, filtre os children
        if (children) {
            usuario.children = filterByName(usuario.children, children);
        }

        // Se o parâmetro 'childrenDisponiveis' foi fornecido, filtre os children disponíveis
        if (childrenDisponiveis) {
            usuariosDisponiveisFiltrados = filterByName(usuariosDisponiveisFiltrados as Usuario[], childrenDisponiveis);
        }

        const result: Ichildren = {
            children: usuario.children,
            childrenDisponiveis: usuariosDisponiveisFiltrados.filter((func) => func.bloqueado == true)
        };

        return result;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao buscar os registros');
    }
};
