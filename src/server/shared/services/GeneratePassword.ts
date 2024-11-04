import { caracteresEspeciais, nomesCidades, nomesPaises, palavrasAleatorias, tecnologiasConhecidas } from '../../database/repositories';
import { IQueryRecoverPasswordUsuarios } from '../interfaces';

export const generatePassword = async (parametros: IQueryRecoverPasswordUsuarios): Promise<string | Error> => {

    try {
        const {
            caracteres = parametros.caracteres || 1,
            cumprimento = parametros.cumprimento || 10,
            numeros = parametros.numeros || 2,
            tipo = parametros.tipo || 'capitalizado',
            tema } = parametros;

        const randomIndex = (array: any[]) => Math.floor(Math.random() * array.length);
        const getRandomChar = () => caracteresEspeciais[randomIndex(caracteresEspeciais)];

        let numerosAleatorios = '';

        for (let i = 0; i < numeros; i++) {
            numerosAleatorios += randomIndex([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }

        let senha = '';

        for (let i = 0; i < caracteres; i++) {
            senha += getRandomChar();
        }

        const caracteresRandomicos = senha.slice(0, cumprimento);

        let palavras = [];

        const tamanhoMin = cumprimento - caracteres - numeros

        switch (tema) {
            case 'aleatorios':
                palavras = palavrasAleatorias.filter((palavra) => palavra.length == tamanhoMin);
                break;
            case 'cidades':
                palavras = nomesCidades.filter((palavra) => palavra.length == tamanhoMin);
                break;
            case 'paises':
                palavras = nomesPaises.filter((palavra) => palavra.length == tamanhoMin);
                break;
            case 'tecnologias':
                palavras = tecnologiasConhecidas.filter((palavra) => palavra.length == tamanhoMin);
                break;
            default:
                const superArray: any[] = []
                palavras = superArray.concat(
                    palavrasAleatorias,
                    nomesCidades,
                    nomesPaises,
                    tecnologiasConhecidas,
                ).filter((palavra) => palavra.length == tamanhoMin);

                break;
        }

        const palavraFiltrada = palavras[randomIndex(palavras)];

        //Método que capetaliza o nome do Kaizen
        const capitalizaSenha = (senha: String) => {
            const palavras = senha.toLowerCase().split(' ');

            for (let i = 0; i < palavras.length; i++) {
                palavras[i] = palavras[i][0].toUpperCase() + palavras[i].substr(1);
            }
            return palavras.join(' ');
        };

        if (numeros == 0) {
            const senha = `${palavraFiltrada == undefined ? '' : palavraFiltrada}${caracteresRandomicos}`;

            if (tipo == 'capitalizado') {
                return capitalizaSenha(senha);
            } else if (tipo == 'maiusculo') {
                return senha.toUpperCase();
            }

            return senha;

        } else {
            const senha = `${palavraFiltrada == undefined ? '' : palavraFiltrada}${numerosAleatorios}${caracteresRandomicos}`;
            if (tipo == 'capitalizado') {
                return capitalizaSenha(senha);
            } else if (tipo == 'maiusculo') {
                return senha.toUpperCase();
            }

            return senha;
        }

    } catch (error) {
        console.log(error);
        return new Error('Erro ao gerar senha');
    }

};