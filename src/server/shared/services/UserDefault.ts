import { PasswordCrypto } from './PasswordCrypto';
import { regraRepository, usuarioRepository } from '../../database/repositories';
import { FotosProvider } from '../../models/fotos';
import { fotoRepository } from '../../database/repositories/fotoRepository';
import { TipoUsuario } from '../../database/entities';

export async function UserDefault() {

    try {

        const email = process.env.EMAIL_USER_DEFAULT;

        const usuarioExiste = await usuarioRepository.findOneBy({ email });

        if (usuarioExiste) {
            return console.log('Usuario padrão já existe\n');
        } else {

            const resultFoto = await FotosProvider.createNoFile();

            if (resultFoto instanceof Error) {
                return new Error(resultFoto.message);
            }

            const foto = await fotoRepository.findOne({
                where: {
                    id: resultFoto
                }
            });

            const senha = process.env.SENHA_USER_DEFAULT;

            const hashPassword = await PasswordCrypto.hashPassword(String(senha));

            const regraAdmin = await regraRepository.find({
                where: {
                    nome: 'REGRA_ADMIN'
                }
            });

            if (!regraAdmin) {
                console.log('Regra admin não existe\n');
            }

            const novoUsuario = usuarioRepository.create({
                nome: process.env.NAME_USER_DEFAULT,
                sobrenome: process.env.SOBRENOME_USER_DEFAULT,
                tipo_usuario: TipoUsuario.ADM,
                email: email,
                senha: hashPassword,
                regra: regraAdmin,
                foto: foto || undefined,
                usuario_cadastrador: `${process.env.NAME_USER_DEFAULT}.${process.env.SOBRENOME_USER_DEFAULT}`,
                usuario_atualizador: `${process.env.NAME_USER_DEFAULT}.${process.env.SOBRENOME_USER_DEFAULT}`,
            });

            const userDefault = await usuarioRepository.save(novoUsuario);

            if (userDefault instanceof Error) {
                return console.log(userDefault.message);
            }

            return console.log('Usuario padrão foi criado\n');
        }

    } catch (error) {
        return console.log(error);
    }

}