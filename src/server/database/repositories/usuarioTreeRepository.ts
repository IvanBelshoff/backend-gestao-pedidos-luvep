import { AppDataSource1 } from '..';
import { Usuario } from '../entities';

export const usuarioTreeRepository = AppDataSource1.manager.getTreeRepository(Usuario);

