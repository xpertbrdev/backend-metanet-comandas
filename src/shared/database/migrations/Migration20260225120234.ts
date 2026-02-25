import { Migration } from '@mikro-orm/migrations';

export class Migration20260225120234 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "filiais" ("id" serial primary key, "nome" varchar(255) not null, "cnpj" varchar(20) null, "ativo" boolean not null default true, "criado_em" timestamptz not null, "atualizado_em" timestamptz not null);`);
    this.addSql(`alter table "filiais" add constraint "filiais_nome_unique" unique ("nome");`);

    this.addSql(`create table "cfg_comandas" ("id" serial not null, "filial_id" int not null, "leitor_xpid" int null, "leitor_cartao_mag" int null, "nome_impressora" varchar(50) null, "ident_comanda" int null, "ident_altern_comanda" varchar(255) null, "tempo_comanda" timestamptz null, "imp_detalhamento" boolean null, "forca_imp_pedido_comanda" boolean not null default false, "imp_dados_empresa_detalhamento" boolean not null default false, "validar_funcionario" boolean null, "validar_cliente" boolean null, "validar_telefone" boolean null, "nao_reimprimir" boolean null, "teclado_virtual" boolean null, "imp_somente_itens_adicionais" boolean not null default false, constraint "cfg_comandas_pkey" primary key ("id", "filial_id"));`);

    this.addSql(`create table "usuarios" ("id" serial primary key, "nome_usuario" varchar(100) not null, "nome" varchar(255) not null, "email" varchar(255) null, "senha" varchar(255) not null, "ativo" boolean not null default true, "filial_principal_id" int not null, "criado_em" timestamptz not null, "atualizado_em" timestamptz not null);`);
    this.addSql(`alter table "usuarios" add constraint "usuarios_nome_usuario_unique" unique ("nome_usuario");`);

    this.addSql(`create table "usuarios_filiais_permitidas" ("usuario_id" int not null, "filial_id" int not null, constraint "usuarios_filiais_permitidas_pkey" primary key ("usuario_id", "filial_id"));`);

    this.addSql(`alter table "cfg_comandas" add constraint "cfg_comandas_filial_id_foreign" foreign key ("filial_id") references "filiais" ("id") on update cascade;`);

    this.addSql(`alter table "usuarios" add constraint "usuarios_filial_principal_id_foreign" foreign key ("filial_principal_id") references "filiais" ("id") on update cascade;`);

    this.addSql(`alter table "usuarios_filiais_permitidas" add constraint "usuarios_filiais_permitidas_usuario_id_foreign" foreign key ("usuario_id") references "usuarios" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "usuarios_filiais_permitidas" add constraint "usuarios_filiais_permitidas_filial_id_foreign" foreign key ("filial_id") references "filiais" ("id") on update cascade on delete cascade;`);
  }

}
