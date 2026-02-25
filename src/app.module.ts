import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database';
import { LoggerModule } from './shared/logger';
import { validate } from './shared/config';
import { FiliaisModule } from './modules/filiais';
import { UsuariosModule } from './modules/usuarios';
import { AuthModule } from './modules/auth';
import { CfgComandasModule } from './modules/cfg-comandas';

@Module({
  imports: [
    // Configuração global de variáveis de ambiente com validação
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: '.env',
    }),

    // Módulo de logging (Pino)
    LoggerModule,

    // Módulo de banco de dados (MikroORM + PostgreSQL)
    DatabaseModule,

    // Módulos de domínio
    FiliaisModule,
    UsuariosModule,
    AuthModule,
    CfgComandasModule,
  ],
})
export class AppModule {}
