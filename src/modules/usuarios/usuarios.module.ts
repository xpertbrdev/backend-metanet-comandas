import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Usuario } from './usuario.entity';
import { PasswordService } from './password.service';

@Module({
  imports: [MikroOrmModule.forFeature([Usuario])],
  providers: [PasswordService],
  exports: [MikroOrmModule, PasswordService],
})
export class UsuariosModule {}
