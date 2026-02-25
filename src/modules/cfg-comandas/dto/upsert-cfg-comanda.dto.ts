import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para criação ou atualização (upsert) de uma configuração de comanda.
 * Se id + filialId já existirem, atualiza. Caso contrário, cria.
 */
export class UpsertCfgComandaDto {
  @ApiPropertyOptional({
    description: 'ID da configuração (informar para atualizar, omitir para criar)',
    example: 1,
  })
  id?: number;

  @ApiProperty({
    description: 'ID da filial à qual a configuração pertence',
    example: 1,
  })
  filialId!: number;

  @ApiPropertyOptional({ description: 'Leitor XPID', example: 1 })
  leitorXpid?: number;

  @ApiPropertyOptional({ description: 'Leitor de cartão magnético', example: 0 })
  leitorCartaoMag?: number;

  @ApiPropertyOptional({ description: 'Nome da impressora', example: 'Impressora Cozinha' })
  nomeImpressora?: string;

  @ApiPropertyOptional({ description: 'Identificador da comanda', example: 100 })
  identComanda?: number;

  @ApiPropertyOptional({ description: 'Identificador alternativo da comanda', example: 'A1' })
  identAlternComanda?: string;

  @ApiPropertyOptional({ description: 'Tempo da comanda', example: '2026-01-01T00:30:00.000Z' })
  tempoComanda?: Date;

  @ApiPropertyOptional({ description: 'Imprimir detalhamento', example: true })
  impDetalhamento?: boolean;

  @ApiPropertyOptional({ description: 'Forçar impressão do pedido na comanda', example: false })
  forcaImpPedidoComanda?: boolean;

  @ApiPropertyOptional({ description: 'Imprimir dados da empresa no detalhamento', example: false })
  impDadosEmpresaDetalhamento?: boolean;

  @ApiPropertyOptional({ description: 'Validar funcionário', example: false })
  validarFuncionario?: boolean;

  @ApiPropertyOptional({ description: 'Validar cliente', example: false })
  validarCliente?: boolean;

  @ApiPropertyOptional({ description: 'Validar telefone', example: false })
  validarTelefone?: boolean;

  @ApiPropertyOptional({ description: 'Não reimprimir', example: false })
  naoReimprimir?: boolean;

  @ApiPropertyOptional({ description: 'Teclado virtual', example: false })
  tecladoVirtual?: boolean;

  @ApiPropertyOptional({ description: 'Imprimir somente itens adicionais', example: false })
  impSomenteItensAdicionais?: boolean;
}
