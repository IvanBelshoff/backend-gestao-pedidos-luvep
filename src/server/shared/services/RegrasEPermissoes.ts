import { permissaoRepository, regraRepository } from '../../database/repositories';
import { create as CreateRegra } from '../../models/regras/Create';
import { create as CreatePermissao } from '../../models/permissoes/Create';
import { deleteById as DeleteRegra } from '../../models/regras/DeleteById';
import { Permissao, Regra } from '../../database/entities';
import { updateById as UpdateRegra } from '../../models/regras/UpdateById';
import { updateById as UpdatePermissao } from '../../models/permissoes/UpdateById';
import { deleteById as DeletePermissao } from '../../models/permissoes/DeleteById';
import { IPermissao, IRegra } from '../interfaces';

const extrairNomeEmMinusculo = (texto: string): string => {
    const partes = texto.split('_');
    if (partes.length > 1) {
        const nomeMinusculo = partes[1].toLowerCase();
        return nomeMinusculo;
    } else {
        return texto.toLowerCase();
    }
};

const convertRegras = async (regrasBD: Promise<Regra[]>): Promise<{ [key: string]: string[] }> => {

    const regrasDoBanco = await regrasBD;
    const formattedResult: { [key: string]: string[] } = {};

    regrasDoBanco.forEach((regraBD) => {
        formattedResult[regraBD.nome] = regraBD.permissao.map((permissao: Permissao) => permissao.nome);
    });

    return formattedResult;
};


export async function RegrasEPermissoes() {

    const REGRAS_PERMISSOES = await JSON.parse(process.env.REGRAS_PERMISSOES || '{}');

    const permissoesEnv: IPermissao[] = Object.keys(REGRAS_PERMISSOES).flatMap((regra: string) => REGRAS_PERMISSOES[regra].map((permissao: string) => ({ nome: permissao, nome_regra: regra })));

    const regrasEnv = Object.keys(REGRAS_PERMISSOES);

    const regrasEPermissoesEnv: IRegra[] = Object.keys(REGRAS_PERMISSOES).map((regra: string) => {
        return {
            nome: regra,
            permissoes: REGRAS_PERMISSOES[regra].map((permissao: string) => ({ nome: permissao })),
        };
    });

    const regrasBD = await regraRepository.find({ relations: { permissao: true } });

    const permissoesBD = await permissaoRepository.find({ relations: { regra: true } });

    const regras_mantidas = regrasBD.filter((regra) => {
        return regrasEPermissoesEnv.some((regraEnv) => regraEnv.nome === regra.nome);
    });

    const regras_adicionadas: IRegra[] = regrasEPermissoesEnv.filter((regraEnv) => {
        return !regrasBD.some((regraBD) => regraBD.nome === regraEnv.nome);
    });

    const regras_removidas = regrasBD.filter((regraBD) => {
        return !regrasEPermissoesEnv.some((regraEnv) => regraEnv.nome === regraBD.nome);
    });

    const permissoesBDFiltradas = regrasEPermissoesEnv.map((regraEnv) => regras_mantidas.filter((regraMantida) => regraMantida.nome === regraEnv.nome).flatMap((permissao) => permissao.permissao)).flat();

    const permissoes_mantidas = permissoesBDFiltradas.filter((permissaoBD) => {
        return permissoesEnv.some((permissaoEnv) => permissaoEnv.nome === permissaoBD.nome);
    });

    const permissoes_adicionadas: IPermissao[] = permissoesEnv.filter((permissaoEnv) => {
        return !permissoesBDFiltradas.some((permissaoBD) => permissaoBD.nome === permissaoEnv.nome);
    });

    const permissoes_removidas = permissoesBDFiltradas.filter((permissaoBD) => {
        return !permissoesEnv.some((permissaoEnv) => permissaoEnv.nome === permissaoBD.nome);
    });

    //Atualiza a regra
    if (regras_adicionadas.length == 1 && regras_removidas.length == 1) {

        const regra_atualizada = regrasBD.find(regra => regra.nome === regras_removidas[0].nome);

        if (regra_atualizada) {

            const atualizaRegra = await UpdateRegra(regra_atualizada.id, { nome: regras_adicionadas[0].nome, descricao: `Gerenciamento de ${extrairNomeEmMinusculo(regras_adicionadas[0].nome)}` });

            if (atualizaRegra instanceof Error) {

                return console.log(atualizaRegra.message);

            } else {

                return console.log(`\nA regra ${regras_removidas[0].nome} foi renomeada para ${regras_adicionadas[0].nome}\n`);
            }
        }

    }

    //Atualiza a permissao
    if (permissoes_adicionadas.length == 1 && permissoes_removidas.length == 1) {

        const permissao_atualizada = permissoesBD.find(permissao => permissao.nome === permissoes_removidas[0].nome);

        if (permissao_atualizada) {

            const atualizaPermissao = await UpdatePermissao(permissao_atualizada.id, { nome: permissoes_adicionadas[0].nome, descricao: `Gerenciamento do método: ${extrairNomeEmMinusculo(permissao_atualizada.regra.nome)} ${extrairNomeEmMinusculo(permissoes_adicionadas[0].nome)}` });

            if (atualizaPermissao instanceof Error) {
                return console.log(atualizaPermissao.message);
            } else {
                return console.log(`\nA permissao ${permissoes_removidas[0].nome} foi renomeada para ${permissoes_adicionadas[0].nome}\n`);
            }
        }
    }

    if (regrasEnv.length == 0) {
        const regrasConvertidas = await convertRegras(regraRepository.find({ relations: { permissao: true } }));
        return console.log(`Não é permitido excluir todas as regras, dentro do .env restaure o REGRAS_PERMISSOES para ${JSON.stringify(regrasConvertidas)}\n`);

    }

    //Criar regras e permissoes
    if (regras_adicionadas && regras_adicionadas.length > 0) {

        const quantidadeNovasRegras = Number(regras_adicionadas.length - 1);

        for (let i = 0; i <= quantidadeNovasRegras; i++) {

            const regra = await CreateRegra({ nome: regras_adicionadas[i].nome, descricao: `Gerenciamento de ${extrairNomeEmMinusculo(regras_adicionadas[i].nome)}` });

            if (regra instanceof Error) {

                return console.log(regra.message);

            } else if (regras_adicionadas[i].nome === 'REGRA_ADMIN') {

                console.log(`Regra: ${regras_adicionadas[i].nome} foi criada`);

            } else {

                console.log(`Regra: ${regras_adicionadas[i].nome} foi criada`);

                const quantidadeNovasPermissoes = Number(regras_adicionadas[i].permissoes.length - 1);

                for (let e = 0; e <= quantidadeNovasPermissoes; e++) {

                    const permissoes = await CreatePermissao({ regra_id: regra, nome: regras_adicionadas[i].permissoes[e].nome, descricao: `Gerenciamento do método: ${extrairNomeEmMinusculo(regras_adicionadas[i].permissoes[e].nome)} ${extrairNomeEmMinusculo(regras_adicionadas[i].nome)}` });

                    if (permissoes instanceof Error) {

                        return console.log(permissoes.message);

                    } else {

                        console.log(`Permissao: ${regras_adicionadas[i].permissoes[e].nome} foi criada\n`);

                    }
                }
            }

        }
    }

    //Criar permissoes
    if (permissoes_adicionadas && permissoes_adicionadas.length > 0) {

        const quantidadeNovasPermissoes = Number(permissoes_adicionadas.length - 1);

        for (let i = 0; i <= quantidadeNovasPermissoes; i++) {

            const regra = await regraRepository.findOne({ where: { nome: permissoes_adicionadas[i]?.nome_regra } });

            if (regra) {
                const permissao = await CreatePermissao({ regra_id: regra.id, nome: permissoes_adicionadas[i].nome, descricao: `Gerenciamento do método: ${extrairNomeEmMinusculo(regra.nome)} ${extrairNomeEmMinusculo(permissoes_adicionadas[i].nome)}` });

                if (permissao instanceof Error) {

                    return console.log(permissao.message);

                } else {

                    console.log(`Permissao: ${permissoes_adicionadas[i].nome} foi criada`);

                }
            } else {
                console.log(`Permissão ${permissoes_adicionadas[i].nome} não possui regra\n`);
            }

        }

    }

    //Excluir Regras e permissoes
    if (regras_removidas && regras_removidas.length > 0) {

        const quantidadeRegrasExclusao = Number(regras_removidas.length - 1);

        for (let i = 0; i <= quantidadeRegrasExclusao; i++) {

            if (regras_removidas[i].nome === 'REGRA_ADMIN') {
                const regrasConvertidas = await convertRegras(regraRepository.find({ relations: { permissao: true } }));
                console.log(`REGRA_ADMIN não pode ser excluida, dentro do .env restaure o REGRAS_PERMISSOES para ${JSON.stringify(regrasConvertidas)}\n`);

            } else {

                const regra = await DeleteRegra(regras_removidas[i].id);

                if (regra instanceof Error) {

                    return console.log(regra.message);

                } else {
                    console.log(`Regra: ${regras_removidas[i].nome} foi excluida`);
                }
            }

        }
    }

    //Excluir Permissoes
    if (permissoes_removidas && permissoes_removidas.length > 0) {

        const quantidadePermissoesExclusao = Number(permissoes_removidas.length - 1);

        for (let i = 0; i <= quantidadePermissoesExclusao; i++) {

            const permissao = await DeletePermissao(permissoes_removidas[i].id);

            if (permissao instanceof Error) {

                return console.log(permissao.message);

            } else {
                console.log(`Permissao: ${permissoes_removidas[i].nome} foi excluida\n`);
            }
        }
    }

    if (regras_mantidas && (regras_adicionadas.length == 0 || !regras_adicionadas) && (regras_removidas.length == 0 || !regras_removidas) && permissoes_mantidas && (permissoes_adicionadas.length == 0 || !permissoes_adicionadas) && (permissoes_removidas.length == 0 || !permissoes_removidas)) {

        return console.log('Regras e Permissões estão sincronizadas com banco de dados\n');

    } else if (regras_mantidas && (regras_adicionadas.length == 0 || !regras_adicionadas) && (regras_removidas.length == 0 || !regras_removidas)) {

        return console.log('Regras estão sincronizadas com banco de dados\n');

    } else if (permissoes_mantidas && (permissoes_adicionadas.length == 0 || !permissoes_adicionadas) && (permissoes_removidas.length == 0 || !permissoes_removidas)) {

        return console.log('Permissoes estão sincronizadas com banco de dados\n');

    } else {

        const regrasConvertidas = await convertRegras(regraRepository.find({ relations: { permissao: true } }));
        console.log(`Muitas operações foram realizadas, dentro do .env restaure o REGRAS_PERMISSOES para ${JSON.stringify(regrasConvertidas)}\n`);

    }

    return;

}
