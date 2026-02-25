import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager } from '@mikro-orm/postgresql';
import { Usuario } from '../usuarios/usuario.entity';
import { PasswordService } from '../usuarios/password.service';
import { Filial } from '../filiais/filial.entity';

/**
 * Payload do token JWT.
 */
export interface JwtPayload {
  sub: number;
  nomeUsuario: string;
  filialPrincipalId: number;
}

/**
 * Serviço de autenticação.
 * Responsável por validar credenciais, gerar tokens JWT e consultar permissões.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida as credenciais de um usuário por nomeUsuario e senha.
   * Retorna o usuário se as credenciais forem válidas.
   * Lança UnauthorizedException se inválidas.
   */
  async validarUsuario(nomeUsuario: string, senha: string): Promise<Usuario> {
    const usuario = await this.em.findOne(
      Usuario,
      { nomeUsuario, ativo: true },
      { populate: ['filialPrincipal'] },
    );

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await this.passwordService.comparar(
      senha,
      usuario.senha,
    );

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return usuario;
  }

  /**
   * Gera um token JWT para o usuário autenticado.
   */
  async gerarToken(usuario: Usuario): Promise<string> {
    const payload: JwtPayload = {
      sub: usuario.id,
      nomeUsuario: usuario.nomeUsuario,
      filialPrincipalId: usuario.filialPrincipal.id,
    };

    return this.jwtService.signAsync(payload);
  }

  /**
   * Retorna todas as filiais que o usuário tem permissão para acessar.
   * Inclui a filial principal e todas as filiais permitidas (ManyToMany).
   * Retorna apenas filiais ativas.
   */
  async buscarFiliaisDoUsuario(usuarioId: number): Promise<Filial[]> {
    const usuario = await this.em.findOneOrFail(
      Usuario,
      { id: usuarioId },
      { populate: ['filialPrincipal', 'filiaisPermitidas'] },
    );

    // Combinar filial principal + filiais permitidas, sem duplicatas
    const filiaisMap = new Map<number, Filial>();

    // Adicionar filial principal
    if (usuario.filialPrincipal.ativo) {
      filiaisMap.set(usuario.filialPrincipal.id, usuario.filialPrincipal);
    }

    // Adicionar filiais permitidas
    for (const filial of usuario.filiaisPermitidas) {
      if (filial.ativo) {
        filiaisMap.set(filial.id, filial);
      }
    }

    return Array.from(filiaisMap.values());
  }
}
