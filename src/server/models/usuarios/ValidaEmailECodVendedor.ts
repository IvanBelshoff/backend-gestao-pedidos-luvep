import { usuarioRepository } from '../../database/repositories';
import { IBody, IResponseErros } from '../../shared/interfaces';

export const validaEmailECodVendedor = async (id?: number, email?: string, codigo_vendedor?: string): Promise<void | Error> => {

    try {

        if (id) {

            const usuariosCadastrados = await usuarioRepository.findAndCount({
                where: [
                    { email: email },
                    { codigo_vendedor: codigo_vendedor }
                ]
            });

            const propriedades: IBody = {};

            const camposDuplicados = usuariosCadastrados[0].filter(usuario => usuario.id !== id);

            if (camposDuplicados.length > 0) {

                if (camposDuplicados.some(usuario => usuario.email === email)) {
                    propriedades.email = 'Já existe usuário com este e-mail.';
                }

                if (camposDuplicados.some(usuario => usuario.codigo_vendedor === codigo_vendedor)) {
                    propriedades.codigo_vendedor = 'Já existe usuário com esta código de vendedor.';
                }
            }

            if (usuariosCadastrados[1] > 0 && usuariosCadastrados[0].filter(usuario => usuario.id !== id).length > 0) {

                const erro: IResponseErros = {
                    status: 400,
                    default: 'Usuário já cadastrado com essas informações.',
                    body: propriedades
                };

                return new Error(JSON.stringify(erro));
            }

            return;

        } else {

            const usuariosCadastrados = email != '' ? await usuarioRepository.findAndCount({
                where: [
                    { email: email },
                    { codigo_vendedor: codigo_vendedor }
                ]
            }) : await usuarioRepository.findAndCount({
                where: [
                    { codigo_vendedor: codigo_vendedor }
                ]
            });

            const propriedades: IBody = {};

            if (usuariosCadastrados[1] > 0) {

                if (usuariosCadastrados[0].some(usuario => usuario.email === email)) {
                    propriedades.email = 'Já existe usuário com este e-mail.';
                }

                if (usuariosCadastrados[0].some(usuario => usuario.codigo_vendedor === codigo_vendedor)) {
                    propriedades.codigo_vendedor = 'Já existe usuário com esta código de vendedor.';
                }
            }

            if (usuariosCadastrados[1] > 0) {

                const erro: IResponseErros = {
                    status: 400,
                    default: 'Usuário já cadastrado com essas informações.',
                    body: propriedades
                };

                return new Error(JSON.stringify(erro));
            }

            return;
        }

    } catch (error) {
        console.log(error);
        return new Error('Erro ao verificar e-mail ou código de vendedor.');
    }
};