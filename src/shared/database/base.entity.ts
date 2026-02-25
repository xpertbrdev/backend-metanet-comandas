import { OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidade base abstrata que define campos comuns a todas as entidades do sistema.
 * Todas as entidades devem estender esta classe.
 */
export abstract class BaseEntity<Optional extends string = never> {
  [OptionalProps]?: 'id' | 'criadoEm' | 'atualizadoEm' | Optional;

  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'timestamptz', defaultRaw: 'now()' })
  criadoEm: Date = new Date();

  @Property({ type: 'timestamptz', defaultRaw: 'now()', onUpdate: () => new Date() })
  atualizadoEm: Date = new Date();
}
