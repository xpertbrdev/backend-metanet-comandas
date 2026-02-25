import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import * as path from 'path';
import { Filial } from '../../modules/filiais/filial.entity';
import { Usuario } from '../../modules/usuarios/usuario.entity';
import { CfgComanda } from '../../modules/cfg-comandas/cfg-comanda.entity';
process.loadEnvFile()

export default defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'metanet',
  password: process.env.DB_PASSWORD || 'metanet123',
  dbName: process.env.DB_NAME || 'metanet_comandas',

  // Descoberta de entidades
  entities: [Filial, Usuario, CfgComanda],

  // Logging de todas as queries executadas pelo ORM
  debug: true,

  // Extensões
  extensions: [Migrator, SeedManager],

  // Configuração de migrações
  migrations: {
    path: path.join(__dirname, './migrations'),
    pathTs: path.join(__dirname, './migrations'),
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
    snapshot: true,
  },

  // Configuração do seeder
  seeder: {
    path: path.join(__dirname, './seeders'),
    pathTs: path.join(__dirname, './seeders'),
    glob: '!(*.d).{js,ts}',
  },
});
