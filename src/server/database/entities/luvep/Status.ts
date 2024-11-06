import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Justificativa } from "..";

@Entity('status')
export class Status {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text', nullable: false, unique: true })
    status: string

    @Column({ type: 'text', nullable: false, default: 'insert_chart' })
    icone?: string;

    @Column({ type: 'text', nullable: true })
    usuario_cadastrador?: string;

    @Column({ type: 'text', nullable: true })
    usuario_atualizador?: string;

    @CreateDateColumn({ nullable: false, type: "date" })
    data_criacao: Date

    @UpdateDateColumn({ nullable: false, type: "date", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    data_atualizacao: Date

    @OneToMany(() => Justificativa, (justificativa) => justificativa.pedido)
    justificativas: Justificativa[]
}