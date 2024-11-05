import { deleteArquivoLocal } from '../../shared/services';
import { Foto, Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';
import { FotosProvider } from '../fotos';


export const deleteById = async (id: number): Promise<void | Error> => {

    try {
        const usuario = await usuarioRepository.findOne({
            relations: {
                parent: true,
                children: true,
                foto: true
            },
            where: {
                id: id
            }
        });

        if (!usuario) {
            return new Error('Usuario não localizado');
        }

        // Desvincula o parent do funcionário, se existir
        if (usuario.parent) {

            // Verifica se children não é undefined antes de aplicar o filter
            if (usuario.parent.children !== undefined) {
                usuario.parent.children = usuario.parent.children.filter(subordinado => subordinado.id !== id);
            }

            await usuarioRepository.update(usuario.parent.id, usuario.parent).then(() => console.log('parent foi limpo')).catch((error) => console.log(error));
        }

        // Desvincula os children do funcionário
        if (usuario.children && usuario.children.length > 0) {

            await Promise.all(usuario.children.map(subordinado => {
                subordinado.parent = null;
                return usuarioRepository.update(subordinado.id, subordinado);
            })).then(() => console.log('children foram limpos')).catch((error) => console.log(error));
        }

        // Deleta a foto, se existir
        if (usuario.foto) {

            const resultDeleteFoto = await deleteArquivoLocal(usuario.foto.local, usuario.foto.nome);

            if (resultDeleteFoto instanceof Error) {
                return new Error(resultDeleteFoto.message);
            }

            const foto = await FotosProvider.deleteById(usuario.foto.id);

            if (foto instanceof Error) {
                return new Error(foto.message);
            }

            console.log('foto excluida com sucesso');
        }

        // Agora, delete o funcionário
        const deleteFuncionario = await usuarioRepository.createQueryBuilder()
            .relation(Foto, 'foto')
            .delete()
            .from(Usuario)
            .where('id = :id', { id: id })
            .execute();


        if (deleteFuncionario instanceof Error) {
            return new Error(deleteFuncionario.message);
        }

        return;

    } catch (error) {
        console.log(error);
        return new Error('Erro ao apagar o registro');
    }
};
