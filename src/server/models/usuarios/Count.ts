import { usuarioRepository } from '../../database/repositories';


export const count = async (
    localidade?: string,
    vinculos?: 'superior' | 'subordinados' | 'nenhum',
    filter?: string
): Promise<number | Error> => {
    try {
        const result = usuarioRepository.createQueryBuilder('usuario')
            .leftJoinAndSelect('usuario.parent', 'parent')
            .leftJoinAndSelect('usuario.children', 'children');

        if (filter && typeof filter === 'string') {
            // Verificar se a string contém espaços em branco e removê-los das extremidades
            filter = filter.trim();
        
            // Dividir a string em partes usando espaço como delimitador
            const parts = filter.split(' ');
        
            if (parts.length > 1) {
                // Se contém mais de uma parte, tratar como nome composto
                const conditions = parts.map((part, index) => {
                    return `(LOWER(usuario.nome) LIKE LOWER(:part${index}) OR LOWER(usuario.sobrenome) LIKE LOWER(:part${index}))`;
                }).join(' AND ');
        
                // Criar um objeto para os parâmetros
                const parameters = parts.reduce((acc, part, index) => {
                    acc[`part${index}`] = `%${part}%`;
                    return acc;
                }, {} as { [key: string]: string });
        
                result.andWhere(`(${conditions})`, parameters);
            } else {
                // Se não contém espaços, é apenas uma palavra (pode ser nome ou sobrenome)
                result.andWhere('(LOWER(usuario.nome) LIKE LOWER(:filter) OR LOWER(usuario.sobrenome) LIKE LOWER(:filter))', { filter: `%${filter}%` });
            }
        }

        if (localidade && typeof localidade === 'string') {
            result.andWhere('usuario.localidade = :localidade', { localidade: localidade });
        }

        if (vinculos && typeof vinculos === 'string') {
            switch (vinculos) {
            case 'nenhum':
                result.andWhere('usuario.parentId IS NULL')
                    .andWhere('"children"."id" IS NULL');
                break;
            case 'subordinados':
                result.andWhere('"children"."id" IS NOT NULL');
                break;
            case 'superior':
                result.andWhere('usuario.parentId IS NOT NULL');
                break;
            }
        }

        const count = await result.getCount();

        return count;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar a quantidade total de registros');
    }
};