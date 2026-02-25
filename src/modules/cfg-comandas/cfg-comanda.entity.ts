import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/core';
import { Filial } from '../filiais/filial.entity';

/**
 * Entidade CfgComanda.
 * Configuração de comanda por filial.
 * Chave primária composta: id (auto-increment) + filial.
 */
@Entity({ tableName: 'cfg_comandas' })
export class CfgComanda {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @ManyToOne(() => Filial, { primary: true, nullable: false })
  filial!: Filial;

  @Property({ type: 'int', nullable: true })
  leitorXpid?: number;

  @Property({ type: 'int', nullable: true })
  leitorCartaoMag?: number;

  @Property({ length: 50, nullable: true })
  nomeImpressora?: string;

  @Property({ type: 'int', nullable: true })
  identComanda?: number;

  @Property({ nullable: true })
  identAlternComanda?: string;

  @Property({ type: 'Date', nullable: true })
  tempoComanda?: Date;

  @Property({ type: 'boolean', nullable: true })
  impDetalhamento?: boolean;

  @Property({ type: 'boolean', default: false })
  forcaImpPedidoComanda: boolean = false;

  @Property({ type: 'boolean', default: false })
  impDadosEmpresaDetalhamento: boolean = false;

  @Property({ type: 'boolean', nullable: true })
  validarFuncionario?: boolean;

  @Property({ type: 'boolean', nullable: true })
  validarCliente?: boolean;

  @Property({ type: 'boolean', nullable: true })
  validarTelefone?: boolean;

  @Property({ type: 'boolean', nullable: true })
  naoReimprimir?: boolean;

  @Property({ type: 'boolean', nullable: true })
  tecladoVirtual?: boolean;

  @Property({ type: 'boolean', default: false })
  impSomenteItensAdicionais: boolean = false;
}
