import { IEmailValidaEmailUsuario } from '../../shared/interfaces';
import { usuarioRepository } from '../../database/repositories';

export const validaEmailUsuario = async (email: string, id?: number): Promise<void | Error> => {

    try {

        if (id) {

            const usuarioUpdate = await usuarioRepository.findOne({
                where: {
                    id: id
                }
            });

            const usuarioCasdastrado = await usuarioRepository.findAndCount({
                where: [
                    { email: email }
                ]
            });

            const propriedades: IEmailValidaEmailUsuario = {};

            const camposDuplicados = usuarioCasdastrado[0].filter(usuario => usuario.email == email && usuario.email != usuarioUpdate?.email);

            if (camposDuplicados.length > 0) {
                if (camposDuplicados.some(usuario => usuario.email === email)) {
                    propriedades.email = 'Já existe usuário com este E-mail.';
                }
            }

            if (usuarioCasdastrado[1] > 0 && usuarioCasdastrado[0].filter(usuario => usuario.email == email && usuario.email != usuarioUpdate?.email).length > 0) {

                const erro = {
                    default: 'Usuário já cadastrado com essas informações.',
                    body: propriedades
                };

                return new Error(JSON.stringify(erro));
            }
        } else {
            const usuarioCasdastrado = await usuarioRepository.findAndCount({
                where: [
                    { email: email }
                ]
            });

            const propriedades: IEmailValidaEmailUsuario = {};

            const camposDuplicados = usuarioCasdastrado[0].filter(usuario => usuario.email == email);

            if (camposDuplicados.length > 0) {
                if (camposDuplicados.some(usuario => usuario.email === email)) {
                    propriedades.email = 'Já existe usuário com este E-mail.';
                }
            }

            if (usuarioCasdastrado[1] > 0 && usuarioCasdastrado[0].filter(usuario => usuario.email == email).length > 0) {

                const erro = {
                    default: 'Usuário já cadastrado com essas informações.',
                    body: propriedades
                };

                return new Error(JSON.stringify(erro));
            }
        }


    } catch (error) {
        console.log(error);
        return new Error('Erro ao verificar o e-mail');
    }
};