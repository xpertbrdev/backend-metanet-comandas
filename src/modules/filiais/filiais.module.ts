import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Filial } from './filial.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Filial])],
  exports: [MikroOrmModule],
})
export class FiliaisModule {}
