import { usuarioRepository } from '../../database/repositories';

export const updateUsuarioAtualizador = async (id: number, nome: string): Promise<void | Error> => {

    try {
        const usuario = usuarioRepository.findOne({ where: { id } });

        if (!usuario) {
            return new Error('Colaborador não encontrado');
        }

        await usuarioRepository.update({ id: id }, { usuario_atualizador: nome });

        return;

    } catch (error) {
        console.log(error);
        return new Error(JSON.stringify({ default: 'Erro ao atualizar o computador' }));
    }
};
