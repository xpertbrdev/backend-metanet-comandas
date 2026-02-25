import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Usuario } from '../usuarios/usuario.entity';

/**
 * Estratégia de autenticação local (nomeUsuario + senha) via Passport.
 * Utiliza o campo 'nomeUsuario' como usernameField.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'nomeUsuario',
      passwordField: 'senha',
    });
  }

  /**
   * Método chamado automaticamente pelo Passport para validar credenciais.
   */
  async validate(nomeUsuario: string, senha: string): Promise<Usuario> {
    return this.authService.validarUsuario(nomeUsuario, senha);
  }
}
