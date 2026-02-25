import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CfgComanda } from './cfg-comanda.entity';
import { CfgComandasService } from './cfg-comandas.service';
import { CfgComandasController } from './cfg-comandas.controller';

@Module({
  imports: [MikroOrmModule.forFeature([CfgComanda])],
  providers: [CfgComandasService],
  controllers: [CfgComandasController],
  exports: [CfgComandasService],
})
export class CfgComandasModule {}
