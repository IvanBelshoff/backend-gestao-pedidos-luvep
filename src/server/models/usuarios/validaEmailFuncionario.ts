import { usuarioRepository } from '../../database/repositories';
import { IBody, IResponseErros } from '../../shared/interfaces';

export const validaEmailEMatriculaFuncionario = async (id?: number, email?: string): Promise<void | Error> => {

    try {

        if (id) {

            const usuariosCadastrados = await usuarioRepository.findAndCount({
                where: [
                    { email: email }
                ]
            });

            const propriedades: IBody = {};

            const camposDuplicados = usuariosCadastrados[0].filter(func => func.id !== id);

            if (camposDuplicados.length > 0) {

                if (camposDuplicados.some(func => func.email === email)) {
                    propriedades.email = 'Já existe funcionário com este e-mail.';
                }
            }

            if (usuariosCadastrados[1] > 0 && usuariosCadastrados[0].filter(func => func.id !== id).length > 0) {

                const erro: IResponseErros = {
                    status: 400,
                    default: 'Funcionário já cadastrado com essas informações.',
                    body: propriedades
                };

                return new Error(JSON.stringify(erro));
            }

            return;

        } else {

            const funcionariosCadastrados = await usuarioRepository.findAndCount({
                where: [
                    { email: email },
                ]
            });

            const propriedades: IBody = {};

            if (funcionariosCadastrados[1] > 0) {

                if (funcionariosCadastrados[0].some(func => func.email === email)) {
                    propriedades.email = 'Já existe funcionário com este e-mail.';
                }

            }

            if (funcionariosCadastrados[1] > 0) {

                const erro: IResponseErros = {
                    status: 400,
                    default: 'Funcionario já cadastrado com essas informações.',
                    body: propriedades
                };

                return new Error(JSON.stringify(erro));
            }

            return;
        }

    } catch (error) {
        console.log(error);
        return new Error('Erro ao verificar o e-mail');
    }
};