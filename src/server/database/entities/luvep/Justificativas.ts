import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Pedido } from "./Pedidos"

@Entity('justificativas')
export class Justificativa {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text', nullable: false })
    conteudo: string

    @CreateDateColumn({ nullable: false, type: "date" })
    data_criacao: Date

    @UpdateDateColumn({ nullable: false, type: "date", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    data_atualizacao: Date

    @ManyToOne(() => Pedido, (pedido) => pedido.justificativas)
    pedido: Pedido | null
}