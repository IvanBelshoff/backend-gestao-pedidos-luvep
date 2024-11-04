import { Regra } from '../../database/entities';
import { permissaoRepository, regraRepository } from '../../database/repositories';

export const getRegrasByIdUser = async (id: number): Promise<Regra[] | [] | Error> => {
    try {
        const permissoesFiltradas = await permissaoRepository.find({
            relations: {
                regra: true,
            },
            where: {
                usuario: {
                    id: id
                }
            }
        });

        const regrasFiltradas = await regraRepository.find({
            relations: {
                permissao: true,
            },
            where: {
                usuario: {
                    id: id
                }
            }
        });

        if (regrasFiltradas instanceof Error) {
            return new Error('Registro não encontrado');
        }

        // Filtrar as permissões de cada regra
        const regrasFiltradasComPermissoes = regrasFiltradas.map((regra) => {
            const permissoesDaRegra = regra.permissao.filter((permissaoDaRegra) =>
                permissoesFiltradas.some((permissaoFiltrada) =>
                    permissaoFiltrada.id === permissaoDaRegra.id
                )
            );

            return {
                ...regra,
                permissao: permissoesDaRegra,
            };
        });

        return regrasFiltradasComPermissoes || [];
        
    } catch (error) {
        console.log(error);
        return new Error('Registro não encontrado');
    }
};
