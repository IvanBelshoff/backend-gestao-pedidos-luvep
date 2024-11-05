import * as fs from 'fs/promises';

export const deleteArquivoLocal = async (path: string, filename: string): Promise<void | Error> => {
    try {
        // Verifica se o arquivo é 'profile.jpg', caso seja, não permite a exclusão
        if (filename === 'profile.jpg') {
            console.log('\nFoto padrão não pode ser excluída localmente');
            return;
        }

        // Verifica se o arquivo existe
        const fileExists = await fs.access(path).then(() => true).catch(() => false);

        if (!fileExists) {
            console.log('\nFoto original não foi localizada');
            return;
        }

        // Tenta excluir o arquivo
        await fs.unlink(path);

        console.log('\nFoto original foi excluída localmente');

    } catch (error) {
        console.error('Erro ao tentar excluir o arquivo:', error);
        return new Error(`Erro ao tentar excluir o arquivo: ${error}`);
    }
};