import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CfgComandasService } from './cfg-comandas.service';
import { UpsertCfgComandaDto } from './dto/upsert-cfg-comanda.dto';

/**
 * Controller de configurações de comanda.
 * Todos os endpoints são protegidos por JWT.
 */
@ApiTags('Configurações de Comanda')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cfg-comandas')
export class CfgComandasController {
  constructor(private readonly cfgComandasService: CfgComandasService) {}

  /**
   * Cria ou atualiza uma configuração de comanda (upsert).
   * Se id + filialId já existirem, atualiza. Caso contrário, cria.
   */
  @ApiOperation({ summary: 'Criar ou atualizar configuração de comanda (upsert)' })
  @ApiResponse({ status: 200, description: 'Configuração criada ou atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Filial não encontrada' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  @Post()
  async upsert(@Body() dto: UpsertCfgComandaDto) {
    const cfgComanda = await this.cfgComandasService.upsert(dto);
    return {
      id: cfgComanda.id,
      filialId: cfgComanda.filial.id,
      leitorXpid: cfgComanda.leitorXpid ?? null,
      leitorCartaoMag: cfgComanda.leitorCartaoMag ?? null,
      nomeImpressora: cfgComanda.nomeImpressora ?? null,
      identComanda: cfgComanda.identComanda ?? null,
      identAlternComanda: cfgComanda.identAlternComanda ?? null,
      tempoComanda: cfgComanda.tempoComanda ?? null,
      impDetalhamento: cfgComanda.impDetalhamento ?? null,
      forcaImpPedidoComanda: cfgComanda.forcaImpPedidoComanda,
      impDadosEmpresaDetalhamento: cfgComanda.impDadosEmpresaDetalhamento,
      validarFuncionario: cfgComanda.validarFuncionario ?? null,
      validarCliente: cfgComanda.validarCliente ?? null,
      validarTelefone: cfgComanda.validarTelefone ?? null,
      naoReimprimir: cfgComanda.naoReimprimir ?? null,
      tecladoVirtual: cfgComanda.tecladoVirtual ?? null,
      impSomenteItensAdicionais: cfgComanda.impSomenteItensAdicionais,
    };
  }

  /**
   * Lista todas as configurações de comanda de uma filial.
   * NOTA: Rota definida antes de :id/:filialId para evitar conflito de roteamento.
   */
  @ApiOperation({ summary: 'Listar todas as configurações de comanda de uma filial' })
  @ApiParam({ name: 'filialId', type: Number, description: 'ID da filial' })
  @ApiResponse({ status: 200, description: 'Lista de configurações retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  @Get('filial/:filialId')
  async selectAll(@Param('filialId', ParseIntPipe) filialId: number) {
    const cfgComandas = await this.cfgComandasService.selectAll(filialId);
    return cfgComandas.map((cfg) => ({
      id: cfg.id,
      filialId: cfg.filial.id,
      filialNome: cfg.filial.nome,
      leitorXpid: cfg.leitorXpid ?? null,
      leitorCartaoMag: cfg.leitorCartaoMag ?? null,
      nomeImpressora: cfg.nomeImpressora ?? null,
      identComanda: cfg.identComanda ?? null,
      identAlternComanda: cfg.identAlternComanda ?? null,
      tempoComanda: cfg.tempoComanda ?? null,
      impDetalhamento: cfg.impDetalhamento ?? null,
      forcaImpPedidoComanda: cfg.forcaImpPedidoComanda,
      impDadosEmpresaDetalhamento: cfg.impDadosEmpresaDetalhamento,
      validarFuncionario: cfg.validarFuncionario ?? null,
      validarCliente: cfg.validarCliente ?? null,
      validarTelefone: cfg.validarTelefone ?? null,
      naoReimprimir: cfg.naoReimprimir ?? null,
      tecladoVirtual: cfg.tecladoVirtual ?? null,
      impSomenteItensAdicionais: cfg.impSomenteItensAdicionais,
    }));
  }

  /**
   * Busca uma configuração de comanda pelo id + filialId.
   */
  @ApiOperation({ summary: 'Buscar configuração de comanda por ID e filial' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da configuração' })
  @ApiParam({ name: 'filialId', type: Number, description: 'ID da filial' })
  @ApiResponse({ status: 200, description: 'Configuração encontrada' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  @Get(':id/:filialId')
  async selectById(
    @Param('id', ParseIntPipe) id: number,
    @Param('filialId', ParseIntPipe) filialId: number,
  ) {
    const cfgComanda = await this.cfgComandasService.selectById(id, filialId);
    return {
      id: cfgComanda.id,
      filialId: cfgComanda.filial.id,
      filialNome: cfgComanda.filial.nome,
      leitorXpid: cfgComanda.leitorXpid ?? null,
      leitorCartaoMag: cfgComanda.leitorCartaoMag ?? null,
      nomeImpressora: cfgComanda.nomeImpressora ?? null,
      identComanda: cfgComanda.identComanda ?? null,
      identAlternComanda: cfgComanda.identAlternComanda ?? null,
      tempoComanda: cfgComanda.tempoComanda ?? null,
      impDetalhamento: cfgComanda.impDetalhamento ?? null,
      forcaImpPedidoComanda: cfgComanda.forcaImpPedidoComanda,
      impDadosEmpresaDetalhamento: cfgComanda.impDadosEmpresaDetalhamento,
      validarFuncionario: cfgComanda.validarFuncionario ?? null,
      validarCliente: cfgComanda.validarCliente ?? null,
      validarTelefone: cfgComanda.validarTelefone ?? null,
      naoReimprimir: cfgComanda.naoReimprimir ?? null,
      tecladoVirtual: cfgComanda.tecladoVirtual ?? null,
      impSomenteItensAdicionais: cfgComanda.impSomenteItensAdicionais,
    };
  }

  /**
   * Remove uma configuração de comanda pelo id + filialId.
   */
  @ApiOperation({ summary: 'Remover configuração de comanda' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da configuração' })
  @ApiParam({ name: 'filialId', type: Number, description: 'ID da filial' })
  @ApiResponse({ status: 200, description: 'Configuração removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou ausente' })
  @Delete(':id/:filialId')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Param('filialId', ParseIntPipe) filialId: number,
  ) {
    await this.cfgComandasService.delete(id, filialId);
    return { message: 'Configuração de comanda removida com sucesso' };
  }
}
