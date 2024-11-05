import { funcionarioRepository } from '../../database/repositories/funcionarioRepository';

interface IFiltros {
    status: string[];
    statusCount: number;
    nomes: string[];
    nomesCount: number;
    vinculos: string[];
    vinculosCount: number;
    departamentos: string[];
    departamentosCount: number;
    secoes: string[]
    secaosCount: number;
    localidades: string[];
    localidadesCount: number
}

export const getFiltrosAll = async (
    status: 'ativos' | 'desligados' | 'ambos',
    filtros: string,
    nome?: string,
    localidade?: string,
    departamento?: string,
    vinculos?: 'superior' | 'subordinados' | 'nenhum',
    secao?: string
): Promise<IFiltros | Error | void> => {

    try {

        if (filtros == 'false' || !filtros) {
            return;
        } else if (filtros && filtros == 'true') {

            const result = funcionarioRepository.createQueryBuilder('funcionario')
                .leftJoinAndSelect('funcionario.parent', 'parent')
                .leftJoinAndSelect('funcionario.children', 'children')
                .orderBy('funcionario.nome', 'ASC');

            if (status && status != 'ambos') {
                if (status == 'ativos') {
                    result.where('funcionario.ativo = :ativo', { ativo: true });
                } else if (status == 'desligados') {
                    result.where('funcionario.ativo = :ativo', { ativo: false });
                }
            }

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
            
            if (typeof secao === 'string') {
                result.andWhere('funcionario.secao = :secao', { secao: secao });
            }

            if (typeof localidade === 'string') {
                result.andWhere('funcionario.localidade = :localidade', { localidade: localidade });
            }

            // Restrinja a consulta ao departamento fornecido, se fornecido
            if (typeof departamento === 'string') {
                result.andWhere('funcionario.departamento = :departamento', { departamento: departamento });
            }

            if (typeof vinculos === 'string') {
                switch (vinculos) {
                case 'nenhum':
                    result.andWhere('funcionario.parentId IS NULL')
                        .andWhere('"children"."id" IS NULL');
                    break;
                case 'subordinados':
                    result.andWhere('"children"."id" IS NOT NULL');
                    break;
                case 'superior':
                    result.andWhere('funcionario.parentId IS NOT NULL');
                    break;
                }
            }

            const funcionarios = await result.getMany();

            const statusSet = new Set<string>();
            const nomeSet = new Set<string>();
            const departamentoSet = new Set<string>();
            const vinculoSet = new Set<string>();
            const secaoSet = new Set<string>();
            const localidadeSet = new Set<string>();

            funcionarios.forEach(func => {

        
                if (func.ativo == true) { statusSet.add('ativos'); }

                if (func.ativo == false) { statusSet.add('desligados'); }

                if (func.nome && func.sobrenome) nomeSet.add(`${func.nome} ${func.sobrenome}`);

                if (func.departamento) departamentoSet.add(func.departamento);

                if (func.parent) {

                    vinculoSet.add('superior');
                }

                if (func.children && func.children.length > 0) {
                    vinculoSet.add('subordinados');
                }

                if (!func.parent && func.children && func.children.length <= 0) {
                    vinculoSet.add('nenhum');
                }

                if (func.secao) secaoSet.add(func.secao);

                if (func.localidade) localidadeSet.add(func.localidade);
            });

            const statusArray = [...statusSet];
            const nomesArray = [...nomeSet];
            const vinculosArray = [...vinculoSet].sort();
            const departamentosArray = [...departamentoSet].sort();
            const secoesArray = [...secaoSet].sort();
            const localidadesArray = [...localidadeSet].sort();

            return {
                status: statusArray,
                statusCount: statusArray.length,
                nomesCount: nomesArray.length,
                vinculosCount: vinculosArray.length,
                departamentosCount: departamentosArray.length,
                secaosCount: secoesArray.length,
                localidadesCount: localidadesArray.length,
                nomes: nomesArray,
                vinculos: vinculosArray,
                departamentos: departamentosArray,
                secoes: secoesArray,
                localidades: localidadesArray,
            };

        }

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
