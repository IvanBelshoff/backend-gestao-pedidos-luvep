import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
    OneToOne,
    JoinColumn,
    UpdateDateColumn,
    TreeParent,
    TreeChildren,
    Tree,
} from "typeorm";
import { Regra } from "./Regras";
import { Permissao } from "./Permissoes";
import { Foto } from "./Fotos";

export enum Localidade {
    VIA = 'via',
    VCA = 'vca',
    TXF = 'txf',
    LIN = 'lin',
}

export enum TipoUsuario {
    CON = 'consultor',
    COOR = 'coordenador',
    PRE = 'presidente'
}

@Entity("usuarios")
@Tree("closure-table", {
    closureTableName: "usuario_closure",
    ancestorColumnName: (column) => "ancestor_" + column.propertyName,
    descendantColumnName: (column) => "descendant_" + column.propertyName,
})
export class Usuario {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'text', nullable: false })
    nome: string

    @Column({ type: 'text', nullable: false })
    sobrenome: string

    @Column({ type: 'text', nullable: false, unique: true })
    email: string

    @Column({ type: 'text', nullable: false, unique: true })
    codigo_vendedor: string

    @Column({ default: false })
    bloqueado: boolean

    @Column({ nullable: false, type: 'enum', enum: Localidade, default: Localidade.VIA })
    localidade: Localidade;

    @Column({ nullable: false, type: 'enum', enum: TipoUsuario, default: TipoUsuario.CON })
    tipo_usuario: TipoUsuario;

    @Column()
    senha?: string;

    @Column({ type: 'text', nullable: true })
    usuario_atualizador?: string;

    @Column({ type: 'text', nullable: true })
    usuario_cadastrador?: string;

    @Column({ nullable: true, type: "timestamp" }) // Alteração do tipo para timestamp
    ultimo_login?: Date

    @CreateDateColumn({ nullable: false, type: "timestamp" }) // Alteração do tipo para timestamp
    data_criacao: Date

    @UpdateDateColumn({ nullable: false, type: "timestamp" }) // Alteração do tipo para timestamp
    data_atualizacao: Date

    @ManyToMany(() => Permissao, (permissao) => permissao.usuario, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'SET NULL',
    })

    @JoinTable({
        name: 'usuarios_permissoes',
        joinColumns: [{ name: 'usuario_id' }],
        inverseJoinColumns: [{ name: 'permissao_id' }],
    })

    permissao: Permissao[];

    @ManyToMany(() => Regra, (regra) => regra.usuario, {
        cascade: true,
        onDelete: "CASCADE",
        onUpdate: "SET NULL",
    })

    @JoinTable({
        name: "usuarios_regras",
        joinColumns: [{ name: "usuario_id" }],
        inverseJoinColumns: [{ name: "regra_id" }],
    })

    regra: Regra[];

    @OneToOne(() => Foto, (foto) => foto.usuario, {
        cascade: true,
        onDelete: 'CASCADE'
    })

    @JoinColumn({ name: "foto_id" })
    foto: Foto

    @TreeParent()
    parent: Usuario | null;

    @TreeChildren()
    children: Usuario[];
}
