import { In } from 'typeorm';
import { permissaoRepository, regraRepository, usuarioRepository } from '../../database/repositories';
import { Permissao, Regra } from '../../database/entities';
import { IBodyUpdateRolesAndPermissionsByIdUsuarios } from '../../shared/interfaces';


const validaRegrasEPermissoes = async (id: number, regrasIds: number[], permissoesIds: number[]): Promise<{ regras: Regra[]; permissoes: Permissao[] }> => {

    const regrasCorretas: number[] = [];

    const permissoesCorretas: number[] = [];
    const permissoesInCorretas: number[] = [];

    const regras = await regraRepository.findAndCount({ where: { id: In(regrasIds) } });

    const permissoes = await permissaoRepository.findAndCount({ where: { id: In(permissoesIds) } });

    if (regras && regras[1] >= 1) {

        const countRegras = regras[1] - 1;

        for (let i = 0; i <= countRegras; i++) {

            const RegraBD = await regraRepository.findOne({
                relations: {
                    permissao: true
                },
                where: {
                    id: regrasIds[i]
                }
            });

            if (RegraBD) {

                regrasCorretas.push(RegraBD.id);

                if (RegraBD?.permissao.length > 0 && permissoes.length > 0) {
                    const countPermissoes = permissoesIds.length - 1;

                    for (let e = 0; e <= countPermissoes; e++) {

                        const permissaoBD = await permissaoRepository.findOne({
                            where: {
                                id: permissoesIds[e]
                            }
                        });

                        if (permissaoBD) {

                            if (RegraBD.permissao.some(permissao => permissao.id === permissaoBD.id)) {
                                permissoesCorretas.push(permissaoBD.id);
                            } else {
                                permissoesInCorretas.push(permissoesIds[e]);
                            }

                        } else {
                            console.log(`Permissao id: ${permissoesIds[e]} não foi encontrada`);
                        }
                    }

                } else {
                    console.log(`Regra ${RegraBD.nome} não possui permissoes`);
                }

            } else {
                console.log(`Regra id ${regrasIds[i]} não foi encontrada`);
            }

        }


        const permissoesErradas = await permissaoRepository.findAndCount({ where: { id: In(permissoesInCorretas) } });

        const permissoesRF = await permissaoRepository.findAndCount({ where: { id: In(permissoesCorretas) } });

        const regrasRF = await regraRepository.findAndCount({ where: { id: In(regrasCorretas) } });

        if (regrasRF[0].some(regra => regra.nome === 'REGRA_ADMIN')) {

            const regrasEPermissoes = {
                regras: regrasRF[0].filter(regra => regra.nome === 'REGRA_ADMIN'),
                permissoes: []
            };

            return regrasEPermissoes;

        } else {

            const nomesRegras = regrasRF[0].map((regra) => regra.nome);

            const permissoesAusentes = permissoesErradas[0].filter(permErrada =>
                !permissoesRF[0].find(permRF => permRF.id === permErrada.id)
            );

            if (permissoesAusentes) {
                for (let i = 0; i <= permissoesAusentes.length - 1; i++) {
                    console.log(`Permissao: ${permissoesAusentes[i].nome} não faz parte do grupo de permissoes das regras: ${nomesRegras} `);
                }
            }

            const regrasBD = await regraRepository.find({ relations: { usuario: true }, where: { usuario: { id: id } } });

            const idsRegrasBD = new Set(regrasBD.map(regra => regra.id));

            const idsRegrasRF = new Set(regrasRF[0].map(regra => regra.id));

            const RegrasMantidas = [...idsRegrasBD].filter(id => idsRegrasRF.has(id));

            const RegrasAdicionadas = [...idsRegrasRF].filter(id => !idsRegrasBD.has(id));

            const RegrasRemovidas = [...idsRegrasBD].filter(id => !idsRegrasRF.has(id));

            console.log('Regras Mantidas:', RegrasMantidas.length, '(' + RegrasMantidas.join(',') + ')');
            console.log('Regras Adicionadas:', RegrasAdicionadas.length, '(' + RegrasAdicionadas.join(',') + ')');
            console.log('Regras Removidas:', RegrasRemovidas.length, '(' + RegrasRemovidas.join(',') + ')');

            const idsNovasRegras = [...RegrasMantidas, ...RegrasAdicionadas];


            //Permissoes

            const permissoesBD = await permissaoRepository.find({ relations: { usuario: true }, where: { usuario: { id: id } } });


            const idsPermissoesBD = new Set(permissoesBD.map(permissao => permissao.id));

            const idsPermissoesRF = new Set(permissoesRF[0].map(permissao => permissao.id));

            const PermissoesMantidas = [...idsPermissoesBD].filter(id => idsPermissoesRF.has(id));

            const PermissoesAdicionadas = [...idsPermissoesRF].filter(id => !idsPermissoesBD.has(id));

            const PermissoessRemovidas = [...idsPermissoesBD].filter(id => !idsPermissoesRF.has(id));

            console.log('Permissoes Mantidas:', PermissoesMantidas.length, '(' + PermissoesMantidas.join(',') + ')');
            console.log('Permissoes Adicionadas:', PermissoesAdicionadas.length, '(' + PermissoesAdicionadas.join(',') + ')');
            console.log('Permissoes Removidas:', PermissoessRemovidas.length, '(' + PermissoessRemovidas.join(',') + ')');

            const idsNovasPermissoes = [...PermissoesMantidas, ...PermissoesAdicionadas];


            const novasRegras = await regraRepository.find({ where: { id: In(idsNovasRegras) } });
            const novasPermissoes = await permissaoRepository.find({ where: { id: In(idsNovasPermissoes) } });

            const regrasEPermissoes = {
                regras: novasRegras,
                permissoes: novasPermissoes
            };

            return regrasEPermissoes;
        }


    } else {
        const regrasEPermissoes = {
            regras: [],
            permissoes: []
        };

        return regrasEPermissoes;
    }


};

export const updateRolesAndPermissionsById = async (id: number, regrasEPermissoes: IBodyUpdateRolesAndPermissionsByIdUsuarios): Promise<void | Error> => {

    try {

        const { regras = regrasEPermissoes.regras || [], permissoes = regrasEPermissoes.permissoes || [] } = regrasEPermissoes;

        const usuarioCadastrado = await usuarioRepository.findOne({
            where: {
                id: id
            }
        });

        if (!usuarioCadastrado) {
            return new Error('Usuário não localizado');
        }


        const regrasPermissoes = await validaRegrasEPermissoes(id, regras, permissoes);

        if (regrasPermissoes) {

            usuarioCadastrado.regra = regrasPermissoes.regras;
            usuarioCadastrado.permissao = regrasPermissoes.permissoes;

            await usuarioRepository.save(usuarioCadastrado);

            if (usuarioRepository instanceof Error) {
                return new Error(usuarioRepository.message);
            }

            return;
        }

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao atualizar o registro');
    }
};