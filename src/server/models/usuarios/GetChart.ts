import { funcionarioRepository } from '../../database/repositories/funcionarioRepository';

interface IChartDepartamento {
    id: number | string,
    quantidadeFuncionarios: number
    departamento: string
    rgb: string
}

interface IChartLocalidade {
    id: number | string,
    quantidadeFuncionarios: number
    localidade: string
    rgb: string
}

interface IChart {
    chartDepartamento: IChartDepartamento[]
    chartLocalidade: IChartLocalidade[]
}

export const getChart = async (
    status: 'ativos' | 'desligados' | 'ambos',
    filter?: string,
    descricao?: string,
    localidade?: string,
    departamento?: string,
    vinculos?: 'superior' | 'subordinados' | 'nenhum',
    secao?: string
): Promise<IChart | Error> => {
    try {
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

        if (typeof filter === 'string') {
            // Verificar se a string contém espaços em branco e removê-los das extremidades
            filter = filter.trim();
        
            // Dividir a string em partes usando espaço como delimitador
            const parts = filter.split(' ');
        
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
                result.andWhere('(LOWER(funcionario.nome) LIKE LOWER(:filter) OR LOWER(funcionario.sobrenome) LIKE LOWER(:filter))', { filter: `%${filter}%` });
            }
        }

        if ( typeof descricao === 'string') {
            result.andWhere('(LOWER(funcionario.descricao) LIKE LOWER(:descricao))', { descricao: `%${descricao}%` });
        }

        if (typeof secao === 'string') {
            result.andWhere('funcionario.secao = :secao', { secao: secao });
        }

        if (typeof localidade === 'string') {
            result.andWhere('funcionario.localidade = :localidade', { localidade: localidade });
        }

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

        const departamentoMap = new Map<string, number>();
        const localidadeMap = new Map<string, number>();

        // Preencher os mapas com a contagem de funcionários em cada departamento e localidade
        funcionarios.forEach(funcionario => {
            const depto = funcionario.departamento;
            departamentoMap.set(depto, (departamentoMap.get(depto) || 0) + 1);

            const loc = funcionario.localidade;
            localidadeMap.set(loc, (localidadeMap.get(loc) || 0) + 1);
        });

        // Função para gerar uma cor RGB aleatória
        const getRGBColor = (tipo: 'localide' | 'departamento', localidade?: string, departamento?: string): string => {
            const colorVia = '#0057e7';
            const colorTxf = '#ffa700';
            const colorLin = '#d62d20';
            const colorVca = '#008744';
            
            const colorAdm = '#e76f51';
            const colorPv = '#50A294';
            const colorCm = '#3992e6';
            const colorPre = '#97F1F9';

            if (tipo == 'localide' && localidade) {
                if (localidade == 'via') {
                    return colorVia;
                }
                if (localidade == 'txf') {
                    return colorTxf;
                }
                if (localidade == 'vca') {
                    return colorVca;
                }
                if (localidade == 'lin') {
                    return colorLin;
                }
            }
            if (tipo == 'departamento' && departamento) {
                if (departamento == 'ADMINISTRATIVO') {
                    return colorAdm;
                }
                if (departamento == 'POSVENDAS') {
                    return colorPv;
                }
                if (departamento == 'COMERCIAL') {
                    return colorCm;
                }
                if (departamento == 'PRESIDENCIA') {
                    return colorPre;
                }
            }

            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);

            return `rgb(${r},${g},${b})`;
        };

        // Criar um array de objetos para o gráfico com os dados necessários
        const chartDepartamento: IChartDepartamento[] = Array.from(departamentoMap.keys()).map(depto => ({
            id: Math.random().toString(36).substring(7), // Gere um ID aleatório
            quantidadeFuncionarios: departamentoMap.get(depto) || 0,
            departamento: depto,
            rgb: getRGBColor('departamento', undefined, depto),
        }));

        const chartLocalidade: IChartLocalidade[] = Array.from(localidadeMap.keys()).map(local => ({
            id: Math.random().toString(36).substring(7),
            quantidadeFuncionarios: localidadeMap.get(local) || 0,
            localidade: local,
            rgb: getRGBColor('localide', local, undefined),
        }));

        const chart: IChart = {
            chartDepartamento: chartDepartamento,
            chartLocalidade: chartLocalidade
        };

        return chart;
        
    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};


