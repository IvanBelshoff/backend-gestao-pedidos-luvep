import { AppDataSource } from '../data-source';
import { Foto } from '../entities/luvep/Fotos';

export const fotoRepository = AppDataSource.getRepository(Foto);