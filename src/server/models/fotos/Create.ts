import mime from 'mime';
import { fotoRepository } from '../../database/repositories/fotoRepository';

interface IFile {
    path: string
    filename: string
    originalname: string
    mimetype: string
    size: number
    tipo_foto: 'colaboradores' | 'usuarios'
    width?: number,
    height?: number
}

export const create = async (foto: IFile): Promise<number | Error> => {

    const { filename, mimetype, originalname, path, size, tipo_foto, width, height } = foto;

    try {

        const fotosCadastradas = await fotoRepository.findAndCount({
            where: {
                nome: filename
            }
        });

        if (fotosCadastradas[1] > 0) {
            return new Error('Foto já cadastrada');
        }

        const newFoto = fotoRepository.create({
            local: path,
            nome: filename,
            originalname: originalname,
            tamanho: size,
            width: width,
            height: height,
            url: `http://${process.env.HOST}:${process.env.PORT}/uploads/fotos/${tipo_foto}/${filename}`,
            tipo: mime.extension(String(mimetype))
        });

        const result = await fotoRepository.save(newFoto);

        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }

        return new Error('Erro ao cadastrar ao salvar foto');

    } catch (error) {
        console.log(error);
        return new Error('Erro ao cadastrar ao salvar foto');
    }
};