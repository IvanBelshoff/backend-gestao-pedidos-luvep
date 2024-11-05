import { In } from 'typeorm';
import { Funcionario, Localidade } from '../../database/entities';
import { funcionarioRepository } from '../../database/repositories/funcionarioRepository';
import { IFuncionarioPersonalizado } from '../../shared/interfaces';

/**
 * Construa a árvore de funcionários a partir de um ID de funcionário específico.
 * 
 * @param funcionarioId ID do funcionário.
 * @param allFuncionarios Lista de todos os funcionários.
 * @param shallow Se verdadeiro, não continuará a construir a árvore de children.
 * @returns Árvore de funcionário.
 */
const buildTree = (funcionarioId: number, allFuncionarios: Funcionario[], shallow: boolean = false): Omit<Funcionario, 'parent'> | undefined => {
    const originalFuncionario = allFuncionarios.find(f => f.id === funcionarioId);

    if (originalFuncionario) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { parent, ...funcionario } = originalFuncionario;

        // Se existirem children, construa a árvore deles
        if (originalFuncionario.children && !shallow) {
            funcionario.children = originalFuncionario.children.map(sub => buildTree(sub.id, allFuncionarios, shallow)).filter(Boolean) as Funcionario[];
        } else if (shallow) {
            funcionario.children = originalFuncionario.children;
        }

        return funcionario;
    }
    return undefined;
};

/**
 * Encontre o nível de um determinado funcionário na árvore.
 * 
 * @param tree Árvore de funcionários.
 * @param idToFind ID do funcionário a ser procurado.
 * @param currentNivel Nível atual de profundidade na árvore.
 * @returns Nível do funcionário ou null se não for encontrado.
 */
const findNivel = (tree: Funcionario, idToFind: number, currentNivel: number = 0): number | null => {
    if (tree.id === idToFind) {
        return currentNivel;
    }

    if (tree.children && Array.isArray(tree.children)) {
        for (const sub of tree.children) {
            const nivel = findNivel(sub, idToFind, currentNivel + 1);
            if (nivel !== null) {
                return nivel;
            }
        }
    }

    return null;
};

// Definição de interface para remoção de children com base em um nível
interface INivelchildren {
    nivel: number;
    funcionarioRaiz: Funcionario;
    funcionarioRemove: Funcionario;
}

/**
 * Função recursiva para remover um funcionário da árvore com base em um nível.
 * 
 * @param tree Árvore de funcionários.
 * @param idToRemove ID do funcionário a ser removido.
 * @param level Nível para determinar qual funcionário remover.
 * @returns Verdadeiro se o funcionário foi removido, falso caso contrário.
 */
function removeFuncionarioFromTree(tree: Funcionario, idToRemove: number, level: number): boolean {
    if (level === 1) {
        const indexToRemove = tree.children.findIndex(sub => sub.id === idToRemove);
        if (indexToRemove !== -1) {
            tree.children.splice(indexToRemove, 1);
            return true;
        }
    } else {
        for (const sub of tree.children) {
            if (removeFuncionarioFromTree(sub, idToRemove, level - 1)) return true;
        }
    }
    return false;
}

/**
 * Atualize a árvore de funcionários removendo os funcionários especificados.
 * 
 * @param trees Árvores de funcionários.
 * @param removeFuncionarios Informações sobre os funcionários a serem removidos.
 * @returns Árvores de funcionários atualizadas.
 */
function updateTrees(trees: IFuncionarioPersonalizado[], removeFuncionarios: INivelchildren[]): IFuncionarioPersonalizado[] {
    for (const removalInfo of removeFuncionarios) {
        for (const tree of trees) {
            if (tree.id === removalInfo.funcionarioRaiz.id) {
                removeFuncionarioFromTree(tree, removalInfo.funcionarioRemove.id, removalInfo.nivel);
            }
        }
    }
    return trees;
}

/**
 * Remova children especificados das árvores de funcionários.
 * 
 * @param trees Árvores de funcionários.
 * @param idsToRemove IDs dos children a serem removidos.
 * @returns Árvores de funcionários atualizadas.
 */
const removechildren = async (trees: IFuncionarioPersonalizado[], idsToRemove?: number[]) => {
    const removeFuncionarios: INivelchildren[] = [];

    if (idsToRemove) {
        const listchildren = await funcionarioRepository.find({
            relations: {
                children: true
            },
            where: { id: In(idsToRemove) }
        });

        const childrenRemove: Funcionario[][] = listchildren.map((sub) => sub.children);

        for (const tree of trees) {
            for (let i = 0; i < childrenRemove.length; i++) {
                for (let j = 0; j < childrenRemove[i].length; j++) {
                    const nivel = findNivel(tree, childrenRemove[i][j].id);
                    if (nivel !== null) {
                        removeFuncionarios.push({
                            nivel: nivel,
                            funcionarioRaiz: tree,
                            funcionarioRemove: childrenRemove[i][j]
                        });
                    }
                }
            }
        }

        if (removeFuncionarios.length > 0) {
            return updateTrees(trees, removeFuncionarios);
        }
    }
    return trees;
};

const removerchildren = (funcionario: IFuncionarioPersonalizado): IFuncionarioPersonalizado => {
    return {
        ...funcionario,
        children: [] // Define a propriedade children como um array vazio
    };
};


const personalizaFuncionariosOrganograma = async (organograma: Funcionario[], localidadeFiltrada?: string): Promise<IFuncionarioPersonalizado[]> => {
    // Função recursiva para processar cada funcionário
    const processarFuncionario = async (funcionario: Funcionario, localidadeFiltrada?: string): Promise<IFuncionarioPersonalizado> => {
        const funcData = await funcionarioRepository.find({
            relations: {
                children: true,
                parent: true,
                foto: true,
            },
            where: {
                id: funcionario.id,
            },
        });

        if (!funcData || funcData.length === 0) {
            throw new Error(`Funcionário com ID ${funcionario.id} não encontrado.`);
        }

        const { children, parent, foto } = funcData[0];

        const nomesChildren: string[] = children.map((sub) => `${sub.nome} ${sub.sobrenome}`);
        const nomeParent: string = parent ? `${parent.nome} ${parent.sobrenome}` : '';

        // Processa os children de maneira recursiva
        const childrenFiltrados = localidadeFiltrada
            ? children.filter((s) => s.localidade === localidadeFiltrada)
            : children;

        const childrenOrdenados = childrenFiltrados
            .slice()
            .sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena os children por nome

        const childrenPersonalizados: IFuncionarioPersonalizado[] = [];
        for (const sub of childrenOrdenados) {
            childrenPersonalizados.push(await processarFuncionario(sub, localidadeFiltrada));
        }

        return {
            ...funcionario,
            nomesChildren: nomesChildren,
            nomeParent: nomeParent,
            foto: foto,
            children: childrenPersonalizados, // Atualize os children com a versão personalizada
        };
    };

    // Processa todos os funcionários no organograma
    const result: IFuncionarioPersonalizado[] = [];
    for (const funcionario of organograma) {
        result.push(await processarFuncionario(funcionario, localidadeFiltrada));
    }

    return result;
};

const UserEmpresa = (localidade: string, cleanedTrees: IFuncionarioPersonalizado[], treesNoFilter: IFuncionarioPersonalizado[], funcionarios?: Funcionario[]): IFuncionarioPersonalizado => {

    if (funcionarios) {
        const Via = {
            id: -1,
            nome: 'Luvep',
            sobrenome: 'Volvo',
            email: 'luvep@luvep.com.br',
            matricula: '',
            ativo: true,
            cargo: 'Empresa',
            descricao: undefined,
            telefone: '(27) 2124-1955',
            celular: 'ROD BR 262 - nº4299 - KM 20 CENTRO - VIANA - ES',
            parent: null,
            departamento: 'Luvep Luz Veiculos e Peças - LTDA',
            secao: '27.724.806/0001-89',
            localidade: Localidade.VIA,
            data_criacao: new Date(),
            data_admissao: new Date(1982, 7, 24),
            data_atualizacao: new Date(),
            nomesChildren: [],
            nomeParent: '',
            children: funcionarios,
            foto: {
                id: -1,
                nome: 'luvep.png',
                originalname: 'luvep.png',
                tipo: 'jpg',
                tamanho: 6758,
                local: 'C:\\Users\\ivan.rodrigues\\Desktop\\SOC\\backend\\backend-sistema-de-organograma-corporativo\\src\\server\\shared\\data\\default\\luvep.png',
                url: 'http://10.86.177.12:5018/luvep/luvep.png',
                data_criacao: new Date(),
                data_atualizacao: new Date(),
                usuario: null,
                funcionario: null
            }
        };

        return Via;
    }
    if (localidade == 'lin') {

        const Lin = {
            id: -1,
            nome: 'Luvep',
            sobrenome: 'Volvo',
            email: 'luvep@luvep.com.br',
            matricula: '',
            ativo: true,
            cargo: 'Empresa',
            descricao: undefined,
            telefone: '(27) 2103-7300',
            celular: 'ROD BR -101 NORTE S/N - KM 160 BAIRRO BEBEDOURO - LINHARES',
            parent: null,
            departamento: 'Luvep Luz Veiculos e Peças - LTDA',
            secao: '27.724.806/0004-21',
            localidade: Localidade.LIN,
            data_criacao: new Date(),
            data_admissao: new Date(2011, 11, 6),
            data_atualizacao: new Date(),
            nomesChildren: [],
            nomeParent: '',
            children: cleanedTrees != undefined ? cleanedTrees : treesNoFilter,
            foto: {
                id: -1,
                nome: 'luvep.png',
                originalname: 'luvep.png',
                tipo: 'jpg',
                tamanho: 6758,
                local: 'C:\\Users\\ivan.rodrigues\\Desktop\\SOC\\backend\\backend-sistema-de-organograma-corporativo\\src\\server\\shared\\data\\default\\luvep.png',
                url: 'http://10.86.177.12:5018/luvep/luvep.png',
                data_criacao: new Date(),
                data_atualizacao: new Date(),
                usuario: null,
                funcionario: null
            }
        };

        return Lin;

    } else if (localidade == 'vca') {
        const Vca = {
            id: -1,
            nome: 'Luvep',
            sobrenome: 'Volvo',
            email: 'luvep@luvep.com.br',
            matricula: '',
            ativo: true,
            cargo: 'Empresa',
            descricao: undefined,
            telefone: '(77) 3201-4222',
            celular: 'ROD BR 116  - S/N - KM 1079 DIST. INDL. DOS IMBORES - VITORIA DA CONQUISTA',
            parent: null,
            departamento: 'Luvep Luz Veiculos e Peças - LTDA',
            secao: '27.724.806/0002-60',
            localidade: Localidade.VCA,
            data_criacao: new Date(),
            data_admissao: new Date(1988, 5, 7),
            data_atualizacao: new Date(),
            nomesChildren: [],
            nomeParent: '',
            children: cleanedTrees != undefined ? cleanedTrees : treesNoFilter,
            foto: {
                id: -1,
                nome: 'luvep.png',
                originalname: 'luvep.png',
                tipo: 'jpg',
                tamanho: 6758,
                local: 'C:\\Users\\ivan.rodrigues\\Desktop\\SOC\\backend\\backend-sistema-de-organograma-corporativo\\src\\server\\shared\\data\\default\\luvep.png',
                url: 'http://10.86.177.12:5018/luvep/luvep.png',
                data_criacao: new Date(),
                data_atualizacao: new Date(),
                usuario: null,
                funcionario: null
            }
        };

        return Vca;
    } else if (localidade == 'txf') {
        const Txf = {
            id: -1,
            nome: 'Luvep',
            sobrenome: 'Volvo',
            email: 'luvep@luvep.com.br',
            matricula: '',
            ativo: true,
            cargo: 'Empresa',
            descricao: undefined,
            telefone: '(73) 3311-6688',
            celular: 'ROD BR 101  - S/N - KM 876 BAIRRO CASTELINHO - TEIXEIRAS DE FREITAS',
            parent: null,
            departamento: 'Luvep Luz Veiculos e Peças - LTDA',
            secao: '27.724.806/0003-40',
            localidade: Localidade.TXF,
            data_criacao: new Date(),
            data_admissao: new Date(1990, 11, 20),
            data_atualizacao: new Date(),
            nomesChildren: [],
            nomeParent: '',
            children: cleanedTrees != undefined ? cleanedTrees : treesNoFilter,
            foto: {
                id: -1,
                nome: 'luvep.png',
                originalname: 'luvep.png',
                tipo: 'jpg',
                tamanho: 6758,
                local: 'C:\\Users\\ivan.rodrigues\\Desktop\\SOC\\backend\\backend-sistema-de-organograma-corporativo\\src\\server\\shared\\data\\default\\luvep.png',
                url: 'http://10.86.177.12:5018/luvep/luvep.png',
                data_criacao: new Date(),
                data_atualizacao: new Date(),
                usuario: null,
                funcionario: null
            }
        };

        return Txf;

    } else {
        const Via = {
            id: -1,
            nome: 'Luvep',
            sobrenome: 'Volvo',
            email: 'luvep@luvep.com.br',
            matricula: '',
            ativo: true,
            cargo: 'Empresa',
            descricao: undefined,
            telefone: '(27) 2124-1955',
            celular: 'ROD BR 262 - nº4299 - KM 20 CENTRO - VIANA - ES',
            parent: null,
            departamento: 'Luvep Luz Veiculos e Peças - LTDA',
            secao: '27.724.806/0001-89',
            localidade: Localidade.VIA,
            data_criacao: new Date(),
            data_admissao: new Date(1982, 7, 24),
            data_atualizacao: new Date(),
            nomesChildren: [],
            nomeParent: '',
            children: cleanedTrees != undefined ? cleanedTrees : treesNoFilter,
            foto: {
                id: -1,
                nome: 'luvep.png',
                originalname: 'luvep.png',
                tipo: 'jpg',
                tamanho: 6758,
                local: 'C:\\Users\\ivan.rodrigues\\Desktop\\SOC\\backend\\backend-sistema-de-organograma-corporativo\\src\\server\\shared\\data\\default\\luvep.png',
                url: 'http://10.86.177.12:5018/luvep/luvep.png',
                data_criacao: new Date(),
                data_atualizacao: new Date(),
                usuario: null,
                funcionario: null
            }
        };

        return Via;

    }
};

/**
 * Obtenha a estrutura organizacional dos funcionários com base nos critérios fornecidos.
 * 
 * @param id ID do funcionário.
 * @param nome Nome do funcionário.
 * @param departamento Departamento do funcionário.
 * @param cargo Cargo do funcionário.
 * @param secao Seção do funcionário.
 * @param noExibirIds IDs dos funcionários a não serem exibidos.
 * @returns Estrutura organizacional dos funcionários ou um erro.
 */
export const getAllOrganograma = async (
    id = 0,
    nome: string = '',
    descricao: string = '',
    departamento: string = '',
    cargo: string = '',
    secao: string = '',
    localidade: string = '',
    noExibirIds: number[] = []): Promise<IFuncionarioPersonalizado[] | Error> => {

    try {


        // Inicialize a consulta usando o repositório de funcionários
        const result = funcionarioRepository.createQueryBuilder('funcionario')
            .leftJoinAndSelect('funcionario.parent', 'parent')
            .leftJoinAndSelect('funcionario.children', 'children')
            .leftJoinAndSelect('funcionario.foto', 'foto')
            .orderBy('funcionario.id', 'DESC');

        // Se um ID for fornecido, restrinja a consulta a esse ID
        if (id > 0) {
            result.where('funcionario.id = :id', { id: id });
        }

        if (nome !== '') {
            result.andWhere('LOWER(funcionario.nome) LIKE LOWER(:nome)', { nome: `%${nome}%` });
        }

        if (descricao !== '') {
            result.andWhere('LOWER(funcionario.descricao) LIKE LOWER(:descricao)', { descricao: `%${descricao}%` });
        }

        if (localidade !== '') {
            result.andWhere('funcionario.localidade = :localidade', { localidade: localidade });
        }

        if (departamento !== '') {
            result.andWhere('funcionario.departamento = :departamento', { departamento: departamento });
        }

        if (cargo !== '') {
            result.andWhere('LOWER(funcionario.cargo) LIKE LOWER(:cargo)', { cargo: `%${cargo}%` });
        }

        if (secao !== '') {
            result.andWhere('funcionario.secao = :secao', { secao: secao });
        }

        // Execute a consulta e obtenha todos os funcionários
        const allFuncionarios = await result.getMany();

        const subordinateIds = new Set(allFuncionarios.flatMap(f => f.children?.map(sub => sub.id) || []));

        let raizes = [];

        // Se qualquer um dos filtros for fornecido, ajuste as raízes de acordo
        if (id || nome || departamento || cargo || secao || localidade) {
            raizes = allFuncionarios.filter(funcionario =>
                (nome ? funcionario.nome.toLowerCase().includes(nome.toLowerCase()) : true) &&
                (cargo ? funcionario.cargo.toLowerCase().includes(cargo.toLowerCase()) : true) &&
                (localidade ? funcionario.localidade === localidade : true) &&
                (departamento ? funcionario.departamento === departamento : true) &&
                (!funcionario.parent || !allFuncionarios.some(f => f.id === funcionario.parent?.id && f.departamento === departamento)) &&
                !subordinateIds.has(funcionario.id)
            );

        } else {
            raizes = allFuncionarios.filter(funcionario => !funcionario.parent && !subordinateIds.has(funcionario.id));
        }

        // Determina se a busca será superficial com base em campos específicos
        const shallow = Boolean(nome || cargo);

        // Construa a árvore de funcionários para cada raiz
        const trees = raizes.map(funcionario => buildTree(funcionario.id, allFuncionarios, shallow)).filter(Boolean) as Funcionario[];

        const treesNoFilter = await personalizaFuncionariosOrganograma(trees, localidade);

        const treesPersonalizado = await personalizaFuncionariosOrganograma(trees, localidade);

        const cleanedTrees = await removechildren(treesPersonalizado, noExibirIds);

        const empresa = UserEmpresa(localidade, cleanedTrees, treesNoFilter);

        const funcionariosDescricaoComchildren = await personalizaFuncionariosOrganograma(allFuncionarios);

        const funcionariosSemchildren: IFuncionarioPersonalizado[] = funcionariosDescricaoComchildren.map(removerchildren);

        const empresaDescricao = UserEmpresa(localidade, cleanedTrees, treesNoFilter, funcionariosSemchildren);
        if (descricao != '') {

            return [empresaDescricao];

        } else if (trees.length == 1) {

            console.log(treesNoFilter);
            return cleanedTrees != undefined ? cleanedTrees : treesNoFilter;

        } else {
            // Verifique se noExibirIds contém o ID genérico
            if (noExibirIds.includes(empresa.id)) {
                empresa.children = [];
            }

            return [empresa];
        }

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
