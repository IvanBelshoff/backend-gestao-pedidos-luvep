import { AppDataSource1 } from '../data-sources/data-source-luvep';
import { Foto } from '../entities/luvep/Fotos';

export const fotoRepository = AppDataSource1.getRepository(Foto);