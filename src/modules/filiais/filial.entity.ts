import { Entity, PrimaryKey, Property, Unique, OptionalProps } from '@mikro-orm/core';

/**
 * Entidade Filial (Tenant).
 * Representa uma filial no sistema multi-tenant.
 * Cada filial é um tenant isolado com seus próprios dados.
 */
@Entity({ tableName: 'filiais' })
export class Filial {
  [OptionalProps]?: 'ativo' | 'cnpj' | 'criadoEm' | 'atualizadoEm';

  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ length: 255 })
  @Unique()
  nome!: string;

  @Property({ length: 20, nullable: true })
  cnpj?: string;

  @Property({ type: 'boolean', default: true })
  ativo: boolean = true;

  @Property({ onCreate: () => new Date() })
  criadoEm!: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  atualizadoEm!: Date;
}
