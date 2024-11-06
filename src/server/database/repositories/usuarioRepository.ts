import { AppDataSource1 } from '../data-sources/data-source-luvep';
import { Usuario } from '../entities/luvep/Usuarios';

export const usuarioRepository = AppDataSource1.getRepository(Usuario);