import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import * as path from 'path';
import { Filial } from '../../modules/filiais/filial.entity';
import { Usuario } from '../../modules/usuarios/usuario.entity';
import { CfgComanda } from '../../modules/cfg-comandas/cfg-comanda.entity';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return defineConfig({
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          user: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          dbName: configService.get<string>('DB_NAME'),

          // Descoberta de entidades
          entities: [Filial, Usuario, CfgComanda],

          // Logging de todas as queries executadas pelo ORM
          debug: configService.get<string>('NODE_ENV') !== 'production',

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
      },
      inject: [ConfigService],
    }),
  ],
  exports: [],
})
export class DatabaseModule {}
