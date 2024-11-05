import path from 'path';

import { IFuncionarioPersonalizado } from '../../shared/interfaces';
import { Funcionario, Localidade } from '../../database/entities';
import { funcionarioRepository, funcionarioTreeRepository } from '../../database/repositories';

//Carrega todos os usuários no topo da arvore
//const rootCategories = await funcionarioTreeRepository.findRoots();

//Obtém todos os filhos (descendentes) de determinada entidade. Retorna todos eles em uma matriz plana.
//const children = await funcionarioTreeRepository.findDescendants(new Funcionario, { relations: ['parent', 'children'] });

//Obtém todos os filhos (descendentes) de determinada entidade. Retorna-os em uma árvore - aninhados uns nos outros.
//const childrenTree = await funcionarioTreeRepository.findDescendantsTree(funcionarioParent);

//Cria um construtor de consultas usado para obter descendentes das entidades em uma árvore.
//const children = await funcionarioTreeRepository.createDescendantsQueryBuilder('funcionario', 'funcionarioClosure', funcionarioParent).getMany();

//Obtém o número de descendentes da entidade.
//const childrenCount = await funcionarioTreeRepository.countDescendants(funcionarioParent);

//Obtém todos os pais (ancestrais) de determinada entidade. Retorna todos eles em uma matriz plana.
//const parents = await funcionarioTreeRepository.findAncestors(funcionarioParent, { relations: ['parent', 'children'] });

//Obtém todos os pais (ancestrais) de determinada entidade. Retorna-os em uma árvore - aninhados uns nos outros.
//const parentsTree = await funcionarioTreeRepository.findAncestorsTree(funcionarioParent);

//Cria um construtor de consultas usado para obter os ancestrais das entidades em uma árvore.
//const parents = await funcionarioTreeRepository.createAncestorsQueryBuilder('funcionario', 'funcionario_closure', funcionarioParent).getMany();

//Obtém o número de ancestrais da entidade.
//const parentsCount = await funcionarioTreeRepository.countAncestors(funcionarioParent);


/*
Essa função funciona corretamente, porém quando pesquisarem por cargo ou descrição, ela montará a arvore com funcionarios não hierarquicamente.

const factoryTree1 = async (funcionarios: Funcionario[]): Promise<Funcionario[]> => {

    const quantidadeDeFuncionarios = (funcionarios.length) - 1;

    const arvoreDeFuncionarios: Funcionario[] = [];

    const arvoreDeFuncionariosSemIndesejados: Funcionario[] = [];

    for (let i = 0; i <= quantidadeDeFuncionarios; i++) {

        const tree = await buildTree(funcionarios[i], funcionarios);

        if (verificarExistenciaFuncionario(arvoreDeFuncionarios, tree) == false) {
            arvoreDeFuncionarios.push(tree);
        }

        const funcionariosNaoPresentesNaArvore = funcionariosNaoPresentes(arvoreDeFuncionarios, funcionarios);

        if (!funcionariosNaoPresentesNaArvore.length) {
            break; // Encerra o loop
        }

    }

    const arvoreSemIndesejados = removerFuncionariosIndesejados(arvoreDeFuncionarios, funcionarios);

    const funcionariosNaoPresentesNaArvore = funcionariosNaoPresentes(arvoreSemIndesejados, funcionarios);

    if (funcionariosNaoPresentesNaArvore.length) {

        const quantidadeDeFuncionariosNaoPresentes = (funcionariosNaoPresentesNaArvore.length) - 1;

        for (let e = 0; e <= quantidadeDeFuncionariosNaoPresentes; e++) {

            arvoreDeFuncionariosSemIndesejados.push({ ...funcionariosNaoPresentesNaArvore[e], children: [] });

        }

    }

    const superArvore = [...arvoreSemIndesejados, arvoreDeFuncionariosSemIndesejados].flat();

    const arvorePurificada = removerFuncionariosDesligados(superArvore);

    return arvorePurificada;
};
*/

const verificarExistenciaFuncionario = (arvore: Funcionario[], funcionario: Funcionario): boolean => {

    for (const pessoa of arvore) {
        if (pessoa.id === funcionario.id) {
            return true;
        }
        if (pessoa.children && pessoa.children.length > 0) {
            const encontrado = verificarExistenciaFuncionario(pessoa.children, funcionario);
            if (encontrado) {
                return true;
            }
        }
    }

    return false;

};



const empresaRaiz = (localidade: string, childrens: IFuncionarioPersonalizado[]): IFuncionarioPersonalizado => {

    const local = path.resolve(__dirname, '..', '..', 'shared', 'data', 'default', 'luvep.png');
    const url = `http://${process.env.HOST}:${process.env.PORT}/profile/luvep.png`;

    if (localidade == 'lin') {

        const Lin: IFuncionarioPersonalizado = {
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
            nomeParent: '',
            nomesChildren: [],
            children: childrens,
            foto: {
                id: -1,
                nome: 'luvep.png',
                originalname: 'luvep.png',
                tipo: 'jpg',
                tamanho: 6758,
                local: local,
                url: url,
                data_criacao: new Date(),
                data_atualizacao: new Date(),
                usuario: null,
                funcionario: null
            }
        };

        return Lin;

    } else if (localidade == 'vca') {
        const Vca: IFuncionarioPersonalizado = {
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
            nomeParent: '',
            nomesChildren: [],
            children: childrens,
            foto: {
                id: -1,
                nome: 'luvep.png',
                originalname: 'luvep.png',
                tipo: 'jpg',
                tamanho: 6758,
                local: local,
                url: url,
                data_criacao: new Date(),
                data_atualizacao: new Date(),
                usuario: null,
                funcionario: null
            }
        };

        return Vca;
    } else if (localidade == 'txf') {
        const Txf: IFuncionarioPersonalizado = {
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
            nomeParent: '',
            nomesChildren: [],
            children: childrens,
            foto: {
                id: -1,
                nome: 'luvep.png',
                originalname: 'luvep.png',
                tipo: 'jpg',
                tamanho: 6758,
                local: local,
                url: url,
                data_criacao: new Date(),
                data_atualizacao: new Date(),
                usuario: null,
                funcionario: null
            }
        };

        return Txf;

    } else {
        const Via: IFuncionarioPersonalizado = {
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
            nomeParent: '',
            nomesChildren: [],
            children: childrens,
            foto: {
                id: -1,
                nome: 'luvep.png',
                originalname: 'luvep.png',
                tipo: 'jpg',
                tamanho: 6758,
                local: local,
                url: url,
                data_criacao: new Date(),
                data_atualizacao: new Date(),
                usuario: null,
                funcionario: null
            }
        };

        return Via;

    }
};

const funcionariosNaoPresentes = (arvores: Funcionario[], funcionariosNecessarios: Funcionario[]): Funcionario[] => {
    const funcionariosPresentes: Funcionario[] = [];

    // Função recursiva para percorrer uma árvore de funcionários
    function percorrerArvore(arvore: Funcionario) {
        // Verifica se o funcionário está na lista de funcionários necessários
        const funcionarioNecessario = funcionariosNecessarios.find(fn => fn.id === arvore.id);
        if (funcionarioNecessario) {
            // Adiciona o funcionário encontrado na lista de funcionários presentes
            funcionariosPresentes.push(funcionarioNecessario);
        }

        // Se o funcionário tiver filhos, chama recursivamente a função para percorrer os filhos
        if (arvore.children.length > 0) {
            for (const filho of arvore.children) {
                percorrerArvore(filho);
            }
        }
    }

    // Itera sobre cada árvore de funcionários
    for (const arvore of arvores) {
        // Inicia a função recursiva passando a raiz da árvore de funcionários
        percorrerArvore(arvore);
    }

    // Retorna a diferença entre os funcionários necessários e os funcionários presentes
    return funcionariosNecessarios.filter(fn => !funcionariosPresentes.some(fp => fp.id === fn.id));
};

const obterFuncionarioPorNivel = (funcionario: Funcionario, nivel: number): Funcionario => {
    if (nivel === 1) {
        return funcionario;
    } else if (nivel > 1 && funcionario.parent) {
        return obterFuncionarioPorNivel(funcionario.parent, nivel - 1);
    } else {
        return funcionario;
    }
};

const funcionarioEstaNoArray = (funcionario: Funcionario, funcionarios: Funcionario[]): boolean => {
    return funcionarios.some(func => func.id === funcionario.id);
};

const encontrarFuncionarioPorNivel = (funcionario: Funcionario, nivel: number, funcionariosDisponiveis: Funcionario[]): Funcionario => {

    let funcionarioRaiz: Funcionario | undefined = undefined; // Inicialize com undefined

    for (let i = 0; i <= nivel; i++) {

        const findUser = obterFuncionarioPorNivel(funcionario, (nivel - i));

        if (findUser && funcionarioEstaNoArray(findUser, funcionariosDisponiveis)) {
            funcionarioRaiz = findUser;
            break; // Encerra o loop
        }
    }

    return funcionarioRaiz || funcionario;
};

const buildTree = async (funcionario: Funcionario, funcionariosDisponiveis: Funcionario[]) => {

    const parentsCount = await funcionarioTreeRepository.countAncestors(funcionario);

    const parentsTree = await funcionarioTreeRepository.findAncestorsTree(funcionario, { relations: ['children', 'parent', 'foto'] });

    const funcionarioRaiz = encontrarFuncionarioPorNivel(parentsTree, parentsCount, funcionariosDisponiveis);

    const childrenTree = await funcionarioTreeRepository.findDescendantsTree(funcionarioRaiz, { relations: ['children', 'parent', 'foto'] });

    return childrenTree;

};

const removerFuncionariosIndesejados = (arvores: Funcionario[], funcionariosNecessarios: Funcionario[]): Funcionario[] => {
    // Função para percorrer a árvore e remover funcionários indesejados
    function percorrerArvore(funcionario: Funcionario): Funcionario | null {
        // Verifica se o funcionário está na lista de funcionários necessários
        const funcionarioNecessario = funcionariosNecessarios.find(fn => fn.id === funcionario.id);
        if (!funcionarioNecessario) {
            // Retorna null para indicar que o funcionário não deve ser incluído
            return null;
        }

        // Remove os funcionários indesejados dos filhos recursivamente
        const filhosAtualizados: Funcionario[] = [];
        for (const filho of funcionario.children) {
            const filhoAtualizado = percorrerArvore(filho);
            if (filhoAtualizado) {
                filhosAtualizados.push(filhoAtualizado);
            }
        }

        // Atualiza os filhos do funcionário com os filhos atualizados
        funcionario.children = filhosAtualizados;

        // Retorna o próprio funcionário, pois ele está na lista de funcionários necessários
        return funcionario;
    }

    // Remove os funcionários indesejados de cada árvore
    const arvoresAtualizadas: Funcionario[] = [];
    for (const arvore of arvores) {
        const arvoreAtualizada = percorrerArvore(arvore);
        if (arvoreAtualizada) {
            arvoresAtualizadas.push(arvoreAtualizada);
        }
    }

    // Retorna as árvores atualizadas
    return arvoresAtualizadas;
};

const removerFuncionariosDesligados = (arvore: Funcionario[]): Funcionario[] => {
    return arvore.filter(funcionario => {
        if (funcionario.ativo === false) {
            return false; // Não incluir funcionários inativos
        }
        if (Array.isArray(funcionario.children)) {
            funcionario.children = removerFuncionariosDesligados(funcionario.children);
        }
        return true; // Incluir funcionários ativos
    });
};


const personalizaFuncionariosOrganograma = async (funcionarios: Funcionario[]): Promise<IFuncionarioPersonalizado[]> => {
    const eFuncionarioPersonalizado = funcionarios as IFuncionarioPersonalizado[];

    const promessas = eFuncionarioPersonalizado.map(async funcionario => {
        const funcionarioRecuperado = await funcionarioRepository.findOne({ where: { id: funcionario.id }, relations: { parent: true, children: true, foto: true }, order: { children: { nome: 'ASC' } } });

        funcionario.nomeParent = funcionarioRecuperado?.parent ? `${funcionarioRecuperado.parent?.nome} ${funcionarioRecuperado.parent?.sobrenome}` : '';

        // Verifica se 'children' é definido e não é null
        if (funcionarioRecuperado?.children && funcionarioRecuperado.children.length > 0) {
            funcionario.nomesChildren = funcionarioRecuperado.children.map(funcionario => `${funcionario.nome} ${funcionario.sobrenome}`);
            funcionario.children = await personalizaFuncionariosOrganograma(funcionario.children) as IFuncionarioPersonalizado[]; // Chamar recursivamente para os filhos
        } else {
            funcionario.nomesChildren = [];
            funcionario.children = [];
        }

        return funcionario;
    });

    return Promise.all(promessas);
};

//Essa função monsta a arvore hierarquicamente, ainda está sendo testada
const factoryTree = async (funcionarios: Funcionario[]): Promise<Funcionario[]> => {

    const quantidadeDeFuncionarios = (funcionarios.length) - 1;

    const arvoreDeFuncionarios: Funcionario[] = [];

    for (let i = 0; i <= quantidadeDeFuncionarios; i++) {

        const tree = await buildTree(funcionarios[i], funcionarios);

        if (verificarExistenciaFuncionario(arvoreDeFuncionarios, tree) == false) {
            arvoreDeFuncionarios.push(tree);
        }

        const funcionariosNaoPresentesNaArvore = funcionariosNaoPresentes(arvoreDeFuncionarios, funcionarios);

        if (!funcionariosNaoPresentesNaArvore.length) {
            break; // Encerra o loop
        }

    }

    const arvoreSemIndesejados = removerFuncionariosIndesejados(arvoreDeFuncionarios, funcionarios);

    const funcionariosNaoPresentesNaArvore = funcionariosNaoPresentes(arvoreSemIndesejados, funcionarios);

    if (funcionariosNaoPresentesNaArvore.length) {

        const arvoreDeFuncionariosSemIndesejados = await factoryTree(funcionariosNaoPresentesNaArvore);

        const superArvore = [...arvoreSemIndesejados, arvoreDeFuncionariosSemIndesejados].flat();

        const arvorePurificada = removerFuncionariosDesligados(superArvore);

        return arvorePurificada;
    }

    const arvorePurificada = removerFuncionariosDesligados(arvoreSemIndesejados);

    return arvorePurificada;
};

export const getAllOrganograma2 = async (
    nome?: string,
    descricao?: string,
    departamento?: string,
    cargo?: string,
    secao?: string,
    localidade?: string
): Promise<Funcionario[] | Error> => {

    try {
        // Inicialize a consulta usando o repositório de funcionários
        const result = funcionarioRepository.createQueryBuilder('funcionario')
            .leftJoinAndSelect('funcionario.foto', 'foto')
            .leftJoinAndSelect('funcionario.parent', 'parent')
            .leftJoinAndSelect('funcionario.children', 'children')
            .where('funcionario.ativo = :ativo', { ativo: true })
            .cache(6000)
            .orderBy('funcionario.nome', 'ASC');

        if (nome && typeof nome === 'string') {
            // Verificar se a string contém espaços em branco e removê-los das extremidades
            nome = nome.trim();

            // Dividir a string em partes usando espaço como delimitador
            const parts = nome.split(' ');

            if (parts.length > 1) {
                // Se contém mais de uma parte, tratar como nome composto
                const conditions = parts.map((part, index) => {
                    return `(LOWER(funcionario.nome) LIKE LOWER(:part${index}) OR LOWER(funcionario.sobrenome) LIKE LOWER(:part${index}))`;
                }).join(' AND ');

                // Criar um objeto para os parâmetros
                const parameters = parts.reduce((acc, part, index) => {
                    acc[`part${index}`] = `%${part}%`;
                    return acc;
                }, {} as { [key: string]: string });

                result.andWhere(`(${conditions})`, parameters);
            } else {
                // Se não contém espaços, é apenas uma palavra (pode ser nome ou sobrenome)
                result.andWhere('(LOWER(funcionario.nome) LIKE LOWER(:filter) OR LOWER(funcionario.sobrenome) LIKE LOWER(:filter))', { filter: `%${nome}%` });
            }
        }

        if (descricao && typeof descricao === 'string') {
            result.andWhere('LOWER(funcionario.descricao) LIKE LOWER(:descricao)', { descricao: `%${descricao}%` });
        }

        if (localidade && typeof localidade === 'string') {
            result.andWhere('funcionario.localidade = :localidade', { localidade: localidade });
        }

        if (departamento && typeof departamento === 'string') {
            result.andWhere('funcionario.departamento = :departamento', { departamento: departamento });
        }

        if (cargo && typeof cargo === 'string') {
            result.andWhere('LOWER(funcionario.cargo) LIKE LOWER(:cargo)', { cargo: `%${cargo}%` });
        }

        if (secao && typeof secao === 'string') {
            result.andWhere('funcionario.secao = :secao', { secao: secao });
        }

        // Execute a consulta e obtenha todos os funcionários
        const funcionarios = await result.getMany();

        //Carrega todas as arvores do Organograma
        const treeNoFilters = await funcionarioTreeRepository.findTrees({ relations: ['children', 'parent', 'foto'] });

        if (!nome && !descricao && !departamento && !cargo && !secao && !localidade) {

            const arvorePurificada = removerFuncionariosDesligados(treeNoFilters);

            const arvorePurificadaPersonalizada = await personalizaFuncionariosOrganograma(arvorePurificada);

            if (arvorePurificada.length > 1) {

                return [empresaRaiz('via', arvorePurificadaPersonalizada)];

            } else if (arvorePurificada.length == 0) {

                return [empresaRaiz('via', [])];

            }

            return arvorePurificadaPersonalizada;

        }

        const tree = await factoryTree(funcionarios);

        const treePersonalizado = await personalizaFuncionariosOrganograma(tree);

        if (tree.length > 1) {

            return [empresaRaiz(localidade || 'via', treePersonalizado)];

        } else if (tree.length == 0) {

            return [empresaRaiz(localidade || 'via', [])];

        }

        return treePersonalizado;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
