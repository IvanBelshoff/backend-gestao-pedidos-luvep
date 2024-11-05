import { In } from 'typeorm';
import { funcionarioRepository } from '../../database/repositories/funcionarioRepository';
import { Funcionario } from '../../database/entities';

interface IFiltros {
    ids: number[];
    idsCount: number;
    nomes: string[];
    nomesCount: number;
    departamentos: string[];
    departamentosCount: number;
    cargos: string[];
    cargosCount: number;
    secoes: string[]
    secaosCount: number;
    localidades: string[];
    localidadesCount: number
}
const buscachildren = (funcionario: Funcionario, allFuncionarios: Funcionario[]): Funcionario[] => {
    const subords: Funcionario[] = [];

    // Busque os children diretos do funcionário atual.
    const subordchildren = allFuncionarios.filter(func => func.parent?.id === funcionario.id);

    // Adicione esses children ao array.
    subords.push(...subordchildren);

    // Para cada subordinado, busque seus children e adicione ao array.
    subordchildren.forEach(subord => {
        subords.push(...buscachildren(subord, allFuncionarios));
    });

    return subords;
};

export const getFiltrosOrganograma = async (
    filtros: string,
    id = 0,
    nome: string,
    departamento: string,
    cargo: string,
    secao: string,
    localidade: string,
    noExibirIds: number[] = []
): Promise<IFiltros | Error | void> => {

    try {

        if (filtros == 'false' || !filtros) {
            return;
        } else if (filtros && filtros == 'true') {

            const filtrochildren = await funcionarioRepository.find({ relations: { parent: true, children: true }, where: { id: In(noExibirIds), ativo: true } });

            const allFuncionarios = await funcionarioRepository.find({ relations: { parent: true, children: true }, where: { ativo: true } });

            const allchildren: Funcionario[] = [];

            filtrochildren.forEach(subord => {
                allchildren.push(...buscachildren(subord, allFuncionarios));
            });

            const allchildrenIds = allchildren.map(subord => subord.id);

            const result = funcionarioRepository.createQueryBuilder('funcionario')
                .orderBy('funcionario.nome', 'ASC')
                .where('funcionario.ativo = :ativo', { ativo: true });

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

            if (id !== 0) {
                result.andWhere('funcionario.id = :id', { id: id });
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

            if (localidade !== '') {
                result.andWhere('funcionario.localidade = :localidade', { localidade: localidade });
            }

            const funcionarioesRaw = await result.getMany();

            const funcionarioes = funcionarioesRaw.filter(func => !allchildrenIds.includes(func.id));

            const nomeSet = new Set<string>();
            const idSet = new Set<number>();
            const departamentoSet = new Set<string>();
            const cargoSet = new Set<string>();
            const secaoSet = new Set<string>();
            const localidadeSet = new Set<string>();

            funcionarioes.forEach(func => {
                if (func.nome && func.sobrenome) nomeSet.add(`${func.nome} ${func.sobrenome}`);
                if (func.id) idSet.add(func.id);
                if (func.departamento) departamentoSet.add(func.departamento);
                if (func.cargo) cargoSet.add(func.cargo);
                if (func.secao) secaoSet.add(func.secao);
                if (func.localidade) localidadeSet.add(func.localidade);
            });

            const nomesArray = [...nomeSet];
            const idsArray = [...idSet];
            const departamentosArray = [...departamentoSet].sort();
            const cargosArray = [...cargoSet].sort();
            const secoesArray = [...secaoSet].sort();
            const localidadesArray = [...localidadeSet].sort();

            return {
                idsCount: idsArray.length,
                nomesCount: nomesArray.length,
                departamentosCount: departamentosArray.length,
                secaosCount: secoesArray.length,
                cargosCount: cargosArray.length,
                localidadesCount: localidadesArray.length,
                ids: idsArray,
                nomes: nomesArray,
                departamentos: departamentosArray,
                secoes: secoesArray,
                cargos: cargosArray,
                localidades: localidadesArray,
            };

        }

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
