import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { CfgComanda } from './cfg-comanda.entity';
import { Filial } from '../filiais/filial.entity';
import { UpsertCfgComandaDto } from './dto/upsert-cfg-comanda.dto';

@Injectable()
export class CfgComandasService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Extrai apenas os campos de dados do DTO, removendo id e filialId,
   * e filtrando propriedades com valor undefined.
   */
  private extrairDados(dto: UpsertCfgComandaDto): Record<string, any> {
    const { id, filialId, ...campos } = dto;
    const dados: Record<string, any> = {};

    for (const [chave, valor] of Object.entries(campos)) {
      if (valor !== undefined) {
        dados[chave] = valor;
      }
    }

    return dados;
  }

  /**
   * Cria ou atualiza uma configuração de comanda.
   * Se id + filialId já existirem, atualiza. Caso contrário, cria.
   */
  async upsert(dto: UpsertCfgComandaDto): Promise<CfgComanda> {
    const filial = await this.em.findOneOrFail(
      Filial,
      { id: dto.filialId },
      { failHandler: () => new NotFoundException(`Filial ${dto.filialId} não encontrada`) },
    );

    let cfgComanda: CfgComanda | null = null;

    // Se o id foi informado, tenta buscar o registro existente
    if (dto.id) {
      cfgComanda = await this.em.findOne(CfgComanda, {
        id: dto.id,
        filial: filial,
      });
    }

    const dados = this.extrairDados(dto);

    if (cfgComanda) {
      // Atualizar registro existente (apenas campos enviados)
      this.em.assign(cfgComanda, dados);
    } else {
      // Criar novo registro com valores padrão para campos obrigatórios
      cfgComanda = this.em.create(CfgComanda, {
        filial: filial,
        forcaImpPedidoComanda: false,
        impDadosEmpresaDetalhamento: false,
        impSomenteItensAdicionais: false,
        ...dados,
      });
    }

    await this.em.flush();
    return cfgComanda;
  }

  /**
   * Remove uma configuração de comanda pelo id + filialId.
   */
  async delete(id: number, filialId: number): Promise<void> {
    const cfgComanda = await this.em.findOne(CfgComanda, {
      id,
      filial: { id: filialId },
    });

    if (!cfgComanda) {
      throw new NotFoundException(
        `Configuração de comanda com id ${id} e filial ${filialId} não encontrada`,
      );
    }

    await this.em.removeAndFlush(cfgComanda);
  }

  /**
   * Busca uma configuração de comanda pelo id + filialId.
   */
  async selectById(id: number, filialId: number): Promise<CfgComanda> {
    const cfgComanda = await this.em.findOne(
      CfgComanda,
      { id, filial: { id: filialId } },
      { populate: ['filial'] },
    );

    if (!cfgComanda) {
      throw new NotFoundException(
        `Configuração de comanda com id ${id} e filial ${filialId} não encontrada`,
      );
    }

    return cfgComanda;
  }

  /**
   * Lista todas as configurações de comanda de uma filial.
   */
  async selectAll(filialId: number): Promise<CfgComanda[]> {
    return this.em.find(
      CfgComanda,
      { filial: { id: filialId } },
      { populate: ['filial'] },
    );
  }
}
