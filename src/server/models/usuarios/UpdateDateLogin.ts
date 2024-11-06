import { usuarioRepository } from '../../database/repositories';

export const updateDateLogin = async (id: number): Promise<void | Error> => {

    try {
        const usuario = usuarioRepository.findOne({ where: { id } });

        if (!usuario) {
            return new Error('Usuario não encontrado');
        }

        const data = new Date().getTime();

        await usuarioRepository.update({ id: id }, { ultimo_login: new Date(data) });

        return;

    } catch (error) {
        console.log(error);
        return new Error(JSON.stringify({ default: 'Erro ao atualizar o usuario' }));
    }
};
