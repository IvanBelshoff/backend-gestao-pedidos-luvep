import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Justificativa } from "./Justificativas";

export enum Status {
    ABER = 'aberto',
    FIN = 'finalizado'
}

@Entity('pedidos')
export class Pedido {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', nullable: false, unique: true })
    id_volvo: string;

    @Column({ type: 'int', nullable: false })
    filial: number;

    @Column({ type: 'varchar', nullable: false })
    tipo: string;

    @Column({ type: 'int', nullable: false })
    pedido: number;

    @Column({ type: 'int', nullable: false })
    cod_cliente: number;

    @Column({ type: 'varchar', length: 45, nullable: false })
    cliente: string;

    @Column({ type: 'timestamp', nullable: false })
    data_do_pedido: Date;

    @Column({ type: 'varchar', length: 3, nullable: false })
    vendedor: string;

    @Column({ type: 'varchar', nullable: false })
    chassi: string;

    @Column({ type: 'int', nullable: false })
    departamento: number;

    @Column({ type: 'float', nullable: false })
    total: number;

    @Column({ type: 'int', nullable: false })
    dias_em_aberto: number;

    @Column({ type: 'varchar', length: 2, nullable: false })
    tipo_de_operacao: string;

    @Column({ nullable: false, type: 'enum', enum: Status, default: Status.ABER })
    status: Status;

    @CreateDateColumn({ nullable: false, type: "date" })
    data_criacao: Date

    @UpdateDateColumn({ nullable: false, type: "date", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    data_atualizacao: Date

    @OneToMany(() => Justificativa, (justificativa) => justificativa.pedido)
    justificativas: Justificativa[]
}
