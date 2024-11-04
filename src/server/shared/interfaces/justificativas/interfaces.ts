import { Justificativa } from '../../../database/entities';

export interface IBodyCreateById extends Pick<Justificativa, 'conteudo'> { }

export interface IBodyUpdateById extends Pick<Justificativa, 'conteudo'> { }
