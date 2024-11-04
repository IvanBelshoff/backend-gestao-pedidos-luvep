import { AppDataSource } from '../data-source';
import { Usuario } from '../entities/luvep/Usuarios';

export const usuarioRepository = AppDataSource.getRepository(Usuario);