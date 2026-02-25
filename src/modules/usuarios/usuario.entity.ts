import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
  ManyToOne,
  ManyToMany,
  Collection,
  OptionalProps,
} from '@mikro-orm/core';
import { Filial } from '../filiais/filial.entity';

/**
 * Entidade Usuario.
 * Representa um usuário do sistema, vinculado a uma filial principal
 * e com possibilidade de acesso a outras filiais via permissão explícita.
 */
@Entity({ tableName: 'usuarios' })
export class Usuario {
  [OptionalProps]?: 'ativo' | 'filiaisPermitidas' | 'criadoEm' | 'atualizadoEm';

  @PrimaryKey({ autoincrement: true })
  id!: number;

  /**
   * Nome de usuário para login. Deve ser único no sistema.
   */
  @Property({ length: 100 })
  @Unique()
  nomeUsuario!: string;

  @Property({ length: 255 })
  nome!: string;

  @Property({ length: 255, nullable: true })
  email?: string;

  @Property({ length: 255, hidden: true })
  senha!: string;

  @Property({ type: 'boolean', default: true })
  ativo: boolean = true;

  /**
   * Filial principal à qual o usuário pertence.
   * Todo usuário deve estar vinculado a pelo menos uma filial.
   */
  @ManyToOne(() => Filial, { nullable: false })
  filialPrincipal!: Filial;

  /**
   * Filiais adicionais que o usuário tem permissão para acessar.
   * Relação ManyToMany gerenciada por uma tabela intermediária.
   */
  @ManyToMany(() => Filial, undefined, {
    pivotTable: 'usuarios_filiais_permitidas',
    joinColumn: 'usuario_id',
    inverseJoinColumn: 'filial_id',
  })
  filiaisPermitidas = new Collection<Filial>(this);

  @Property({ onCreate: () => new Date() })
  criadoEm!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  atualizadoEm!: Date;
}
